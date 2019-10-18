import Leaflet from "leaflet";
import {
  createSvgElement,
  createSvgFromPaths,
  createSvgPathElement,
  generateViewBoxFromPaths
} from "./svg";
import { mapMarker } from "./mapMarker";
import { gradients } from "./markers";
import { UnrecognizedMarkerGradientPresetError } from "./markers/gradients/UnrecognizedMarkerGradientPresetError";
import { InvalidViewBoxProvidedError } from "./InvalidViewBoxProvidedError";
import { isString, logWarning } from "./utils/utils";

const warnings = {
  customIconSizeExceedsMarkerPinSize: function(
    customIconWidth,
    customIconHeight,
    markerWidth,
    markerHeight,
    resizedWidth,
    resizedHeight
  ) {
    logWarning(
      `Supplied dimensions for custom icon (${customIconWidth},${customIconHeight}) exceed marker pin size (${markerWidth},${markerHeight}) - custom icon will be resized to (${resizedWidth},${resizedHeight}) in order to fit within the marker pin.`
    );
  }
};

/**
 * @type DefaultOptions
 */
const defaultOptions = {
  /**
   * native properties available in `L.Icon.Default`
   */

  // note that this `iconSize` property is set to match the SVG markers'
  // dimensions of 30px width and 40px height
  iconSize: [30, 40],
  iconAnchor: [15, 40], // this width is half the width of the `iconSize` width
  popupAnchor: [0, -(40 * 0.786)], // offset the popup by a fib ratio to slightly cover the top of the marker

  /**
   * non-native properties
   */

  rootClassName: "vector-marker",

  // icon
  iconColor: "white",
  iconClasses: "",
  iconFontSize: 14,
  iconName: "home",
  shouldDisplayIcon: true,

  // icon custom from svg path strings
  iconSvg: {
    width: 30, // optional
    height: 40, // optional
    viewBox: "", // optional
    paths: [] // required
  },

  // @todo move marker options to own namespace
  marker: {
    hasShadow: true,
    cssClasses: "",
    color: "blue",
    gradient: {
      top: "",
      bottom: ""
    },
    gradientPresetName: "",
    path: mapMarker.d,
    viewBox: mapMarker.viewBox
  },

  // customisation of map marker pin options
  doesMarkerHaveShadow: true,
  markerClasses: "",
  markerColor: "blue",

  /**
   * @type {MarkerGradient}
   */
  markerGradient: {
    bottom: "",
    top: ""
  },
  markerGradientPresetName: "",

  // for creating custom pin marker
  markerPinPath: mapMarker.d,
  markerPinViewBox: mapMarker.viewBox
};

/**
 * Overwrites leaflet's own L.DivIcon class implementation.
 *
 * We are using the `L.DivIcon` as the base class because it is Leaflet's
 * native feature-light implementation of the `L.Icon`.
 *
 * @external L.Icon
 * @see {@link https://github.com/Leaflet/Leaflet/blob/master/src/layer/marker/Icon.js}
 * @see {@link https://github.com/Leaflet/Leaflet/blob/master/src/layer/marker/Icon.Default.js}
 */
class Icon extends Leaflet.DivIcon {
  constructor(options) {
    super(options);
    Leaflet.Util.setOptions(this, defaultOptions);
    Leaflet.Util.setOptions(this, options);
  }

  /**
   * @override
   * @param {HTMLElement} [oldIcon]
   * @return {HTMLElement}
   */
  createIcon(oldIcon) {
    const options = this.options;
    const { rootClassName } = this.options;

    const div =
      oldIcon && oldIcon.tagName === "DIV"
        ? oldIcon
        : document.createElement("div");

    /**
     * prepare marker pin
     */

    const svg = this.createSvgMarkerPin();

    // inject html into div, forcing a render - otherwise, Leaflet does not
    // seem to work render the <svg> properly when using `div.appendChild(svg)`
    div.innerHTML = svg.outerHTML;

    // start adding css classes to container
    div.classList.add(rootClassName);

    if (!!options.markerClasses) {
      div.classList.add(...options.markerClasses);
    }

    if (options.doesMarkerHaveShadow) {
      div.classList.add("vector-marker-shadow");
    }

    /**
     * prepare icon
     */

    if (this.options.shouldDisplayIcon) {
      div.appendChild(this.handleCreateIcon());
    }

    this._setIconStyles(div);

    return div;
  }

  /**
   * @param {MarkerGradient} markerGradient
   *
   * @return {boolean}
   */
  isValidMarkerGradient(markerGradient) {
    return !!markerGradient.bottom && !!markerGradient.top;
  }

  /**
   * Delegates which <svg> marker will be used.
   *
   * @return {SVGElement}
   */
  createSvgMarkerPin() {
    // @todo sanity check if user requested a custom marker pin

    //
    // need to check the following
    //
    // (1) did the user pass in one of the preset gradient names to use?
    // (2) did the user pass in a custom gradient to use?
    // (3) otherwise, create a generic marker
    //

    const options = this.options;
    const [width, height] = options.iconSize;
    const {
      markerGradient,
      markerGradientPresetName,
      markerPinPath,
      markerPinViewBox
    } = options;

    const availableGradientPresetNames = gradients.getAvailableGradientPresetNames();

    // (1) did the user pass in one of the preset gradient names to use?
    if (!!markerGradientPresetName) {
      try {
        const gradient = gradients.getMarkerGradient(markerGradientPresetName);
        return this.createSvgMarkerPinWithGradient(
          width,
          height,
          markerPinViewBox,
          markerPinPath,
          gradient.top,
          gradient.bottom
        );
      } catch (e) {
        console.log(
          `%c WARNING - Requested gradient preset named "${markerGradientPresetName}" is not recognized. Defaults will be used to style the marker pin.`,
          "background: yellow; color: black; font-weight: bold"
        );
        return this.createSvgMarkerPinGeneric();
      }
    }

    // (2) did the user pass in a custom gradient to use?
    if (this.isValidMarkerGradient(this.options.markerGradient)) {
      return this.createSvgMarkerPinWithGradient(
        width,
        height,
        markerPinViewBox,
        markerPinPath,
        markerGradient.top,
        markerGradient.bottom
      );
    }

    // (3) otherwise, create a generic marker
    return this.createSvgMarkerPinGeneric();

    // // @todo see about implementing this
    // return this.isValidMarkerGradient(this.options.markerGradient) ||
    //   doesSuppliedGradientNameExist(
    //     markerGradientPresetName,
    //     availableGradientPresetNames
    //   )
    //   ? this.createSvgMarkerPinWithGradient(
    //       // @todo make it so the fn knows to extract data from options alone
    //       width,
    //       height,
    //       markerPinViewBox,
    //       markerPinPath,
    //       markerGradient.gradient.bottom,
    //       markerGradient.gradient.top
    //     )
    //   : this.createSvgMarkerPinGeneric();
  }

  /**
   * Programmatically create marker pin <svg> element.
   *
   * @return {SVGElement}
   */
  createSvgMarkerPinGeneric() {
    const options = this.options;
    const [width, height] = options.iconSize;

    const svg = createSvgElement();
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", options.markerPinViewBox);

    const markerPath = createSvgPathElement(options.markerPinPath, {
      fill: options.markerColor
    });

    svg.appendChild(markerPath); // add path shape to svg

    return svg;
  }

  /**
   * Programmatically create a marker pin <svg> element with a gradient.
   *
   * @param {String} width
   * @param {String} height
   * @param {String} viewBox
   * @param {String} pathValue
   * @param {String} gradientTopValue {@link MarkerGradient.top}
   * @param {String} gradientBottomValue {@link MarkerGradient}
   * @return {SVGElement}
   */
  createSvgMarkerPinWithGradient(
    width,
    height,
    viewBox,
    pathValue,
    gradientTopValue,
    gradientBottomValue
  ) {
    const svg = createSvgElement();
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", viewBox);

    // generate a unique id for each gradient id to avoid gradient id
    // collisions which will prevent gradients from working
    const linearGradientId = String(Math.floor(Math.random() * 1e6));

    const linearGradient = document.createElement("linearGradient");
    linearGradient.setAttribute("id", linearGradientId);
    linearGradient.setAttribute("x1", "0.5");
    linearGradient.setAttribute("x2", "0.5");
    linearGradient.setAttribute("y2", "1");
    linearGradient.setAttribute("gradientUnits", "userSpaceOnUse");

    // the `<linearGradient/>` scale property must match the last two digits
    // of the svg `viewBox` property, otherwise the gradient won't scale
    // properly and will look small
    const [x, y] = viewBox.split(" ").slice(2);
    linearGradient.setAttribute("gradientTransform", `scale(${x} ${y})`);

    const stopBottom = document.createElement("stop");
    stopBottom.setAttribute("offset", "0%");
    stopBottom.setAttribute("stop-color", gradientTopValue);

    const stopTop = document.createElement("stop");
    stopTop.setAttribute("offset", "100%");
    stopTop.setAttribute("stop-color", gradientBottomValue);

    const markerPath = createSvgPathElement(pathValue);
    markerPath.setAttribute("fill", `url(#${linearGradientId})`);

    linearGradient.appendChild(stopBottom);
    linearGradient.appendChild(stopTop);
    svg.appendChild(linearGradient);
    svg.appendChild(markerPath);

    return svg;
  }

  // handles user requesting to use custom icon from svg paths or to use a fa
  // icon
  handleCreateIcon() {
    const { iconSvg } = this.options;

    if (Array.isArray(iconSvg.paths) && iconSvg.paths.length) {
      return this.createCustomSvgIconElement();
    } else {
      return this.createIconElement();
    }
  }

  /**
   * This function is used when the client supplied width and height
   * exceed the containing marker pin dimensions to create new scaled
   * dimensions that fit comfortably inside the marker.
   *
   * @param {Number[]} iconSize A 2-tuple representing width and height.
   * @param {Number} [scalingFactor=0.618] A fib ratio used to scale; can
   * also use 0.786.
   * @return {Number[]} A 2-tuple representing width and height with the
   * scaling factor applied.
   */
  fitIconInMarker([width, height], scalingFactor = 0.618) {
    return [width * scalingFactor, height * scalingFactor];
  }

  /**
   * Whether or not the client supplied a width and a height to use for
   * their custom icon.
   *
   * @param {Object} options
   * @return {boolean}
   */
  didUserSupplyOwnIconDimensions(options) {
    return !!options.iconSvg.width && !!options.iconSvg.height;
  }

  /**
   * @return {HTMLElement}
   */
  createCustomSvgIconElement() {
    // prettier-ignore
    const { iconSvg: { viewBox, paths }} = this.options;
    const { iconName, iconClasses, iconColor, iconFontSize } = this.options;

    const width = this.options.iconSvg.width || defaultOptions.iconSvg.width;
    const height = this.options.iconSvg.height || defaultOptions.iconSvg.height;

    // type guard that the paths is proper type
    for (let path of paths) {
      if (!path.hasOwnProperty("d")) {
        throw InvalidViewBoxProvidedError.forPath(path);
      }

      // ensure that each dictionary item is a valid <k,v>
      if (path.hasOwnProperty("attributes")) {
        for (let [k, v] of Object.entries(path.attributes)) {
          if (!isString(k) || !isString(v)) {
            throw InvalidViewBoxProvidedError.forPathAttributes(k, v, path);
          }
        }
      }
    }

    // type guard that the viewBox is a 4-tuple
    if (!!viewBox) {
      if (viewBox.length !== 4) {
        throw InvalidViewBoxProvidedError.forIcon(viewBox);
      }
    }

    // use the client provided viewbox or generate it from the icon paths
    const viewBoxToUse = viewBox || generateViewBoxFromPaths(paths);

    /**
     * @param {DefaultOptions} options
     * @return {boolean}
     */
    function isUserIconSizeExceedingMarkerSize(options) {
      return (
        options.iconSvg.width >= options.iconSize[0] ||
        options.iconSvg.height >= options.iconSize[1]
      );
    }

    // -------------------------------------------------------------------------
    // Handle dimensions of a custom icon svg
    // -------------------------------------------------------------------------
    //
    // When deriving the dimensions of the custom icon svg, we need to
    // ensure that the generated svg for the icon will fit within the
    // dimensions of its parent marker.
    //
    // Width and height may be optionally provided by the client, at which
    // point care must be taken to ensure that the icon fits within the
    // marker pin.
    //

    let svgIcon;
    if (this.didUserSupplyOwnIconDimensions(this.options)) {
      if (isUserIconSizeExceedingMarkerSize(this.options)) {
        // when the supplied width and height exceed the marker pin dimensions,
        // force icon to fit inside marker comfortably
        const [w, h] = this.fitIconInMarker(this.options.iconSize);
        svgIcon = createSvgFromPaths(paths, viewBoxToUse, w, h);

        // notify client that they supplied width and height exceeding
        // marker pin dimensions
        warnings.customIconSizeExceedsMarkerPinSize(
          this.options.iconSvg.width,
          this.options.iconSvg.height,
          this.options.iconSize[0],
          this.options.iconSize[1],
          w,
          h
        );
      } else {
        // client supplied width and height do not exceed marker pin dimensions
        svgIcon = createSvgFromPaths(
          paths,
          viewBoxToUse,
          this.options.iconSvg.width,
          this.options.iconSvg.height
        );
      }
    } else {
      // client did not explicitly specify a width and height to use, thus
      // it must be generated using the marker pin size as the basis
      const [w, h] = this.fitIconInMarker(this.options.iconSize);
      svgIcon = createSvgFromPaths(paths, viewBoxToUse, w, h);
    }

    const i = document.createElement("i");
    i.style.width = "100%";
    i.style.height = "100%";

    if (!!iconClasses) {
      i.classList.add(iconClasses);
    }

    if (!!iconColor) {
      i.style.color = iconColor;
    }

    i.appendChild(svgIcon);

    return i;
  }

  createSvgIconElementWhenViewBoxIsProvided() {}

  createSvgIconElementWhenViewBoxIsNotProvided() {}

  /**
   * @private
   * @return {HTMLElement}
   */
  createIconElement() {
    const { iconName, iconClasses, iconColor, iconFontSize } = this.options;

    // use default icon name if none is supplied
    // @todo handle case for supplying an icon name that does not exist?
    const iconNameToUse = !!iconName ? iconName : defaultOptions.iconName;

    const i = document.createElement("i");
    i.classList.add("fa", `fa-${iconNameToUse}`);
    i.style.fontSize = `${iconFontSize}px`;
    i.style.width = "100%";
    i.style.height = "100%";

    if (!!iconClasses) {
      i.classList.add(iconClasses);
    }

    if (!!iconColor) {
      i.style.color = iconColor;
    }

    return i;
  }

  /**
   * The body of this method has been stripped down since we have opted to
   * use a css based shadow method instead of a separate image shadow and no
   * longer need that functionality from the original method.
   *
   * @override
   * @private
   * @param {HTMLElement} element
   */
  _setIconStyles(element) {
    const options = this.options;
    const size = Leaflet.point(options.iconSize);
    const anchor = Leaflet.point(options.iconAnchor);

    // unchanged behaviour from original leaflet source
    if (anchor) {
      const { x, y } = anchor;
      element.style.marginLeft = `-${x}px`;
      element.style.marginTop = `-${y}px`;
    }

    if (size) {
      const { x, y } = size;
      element.style.width = `${x}px`;
      element.style.height = `${y}px`;
    }
  }
}

export { Icon };
