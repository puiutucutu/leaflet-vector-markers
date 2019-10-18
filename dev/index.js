import { VectorMarkers } from "../src";
import "./custom-marker-style.scss";

// prettier-ignore
const sampleIconSvgPaths = {
  buildings: {
    // https://www.freepik.com/free-icon/city_868941.htm
    width: "128",
    height: "128",
    viewBox: [0,0,128,128],
    paths: [
      {
        d: "M28 40h-8v8h8v-8zm32-8h-8v8h8v-8zm16 0h-8v8h8v-8zm16 0h-8v8h8v-8zM60 16h-8v8h8v-8zm16 0h-8v8h8v-8zm16 0h-8v8h8v-8zM60 64h-8v8h8v-8zm16 0h-8v8h8v-8zm16 0h-8v8h8v-8zM60 80h-8v8h8v-8zm32 0h-8v8h8v-8zM60 96h-8v8h8v-8zm32 0h-8v8h8v-8zM60 48h-8v8h8v-8zm16 0h-8v8h8v-8zm16 0h-8v8h8v-8zm-64 8h-8v8h8v-8zm0 16h-8v8h8v-8zm0 16h-8v8h8v-8zm0 16h-8v8h8v-8zm48-24h-8v8h8v-8zm40-24h-8V8c0-4.422-3.578-8-8-8H44c-4.422 0-8 3.578-8 8v16H12c-4.422 0-8 3.578-8 8v88c0 4.422 3.578 8 8 8h104c4.422 0 8-3.578 8-8V64c0-4.422-3.578-8-8-8zm-80 64H12V32h24v88zm64 0H76V96h-8v24H44V8h56v112zm16 0h-8v-8h8v8zm0-16h-8v-8h8v8zm0-16h-8v-8h8v8zm0-16h-8v-8h8v8z",
        attributes: {
          "fill-rule": "evenodd",
          "clip-rule": "evenodd"
        }
      }
    ]
  }
};

/* -------------------------------------------------------------------------- */
/* (1) Create custom markers
/* -------------------------------------------------------------------------- */

const vectorMarkerExamples = {
  redMarkerWithCoffeeIcon: {
    latLng: [48.15491, 11.54183],
    popupMessage: "red marker with coffee icon",
    vectorMarker: VectorMarkers.icon({
      iconName: "coffee",
      markerColor: "red"
    })
  },
  greenMarkerWithCarIcon: {
    latLng: [48.155, 11.543],
    popupMessage: "green marker with car icon",
    vectorMarker: VectorMarkers.icon({
      iconName: "car",
      iconColor: "black",
      markerColor: "#b4fb87"
    })
  },

  /**
   * Example of a using a marker with a preset gradient.
   */
  presetGradientNameWithAirplaneIcon: {
    latLng: [48.15427571363835, 11.543408378175759],
    popupMessage: "this marker uses a preset gradient",
    vectorMarker: VectorMarkers.icon({
      iconName: "bolt",
      markerGradientPresetName: "blue"
    })
  },

  /**
   * Example of a using a marker with a custom gradient.
   */
  customGradientMarkerWithBoltIcon: {
    latLng: [48.15426020557778, 11.541592162814574],
    popupMessage: "this marker uses a custom gradient",
    vectorMarker: VectorMarkers.icon({
      iconName: "plane",
      markerGradient: {
        top: "rgb(255,119,43)",
        bottom: "rgb(0,0,0)"
      }
    })
  },

  /**
   * An example of a custom marker pin having (i) a client provided svg
   * shape for the marker pin and (ii) explicit control over the size of the
   * icon inside of the marker pin via the `iconSize` and `iconFontSize`
   * properties.
   *
   * Note that you may or may not have to also adjust the popup anchor
   * position depending on the change in size.
   */
  customMarkerPin: {
    latLng: [48.1539273809539, 11.542746927099248],
    popupMessage:
      "using a custom SVG for the marker pin with increased marker pin and icon sizes",
    vectorMarker: VectorMarkers.icon({
      iconSize: [48, 64],
      iconAnchor: [24, 64], // this width is half the width of the `iconSize` width
      popupAnchor: [0, -(64 * 0.786)],

      iconColor: "white", // any valid property for css `color` attribute
      iconFontSize: 24,
      iconName: "home",

      doesMarkerHaveShadow: true,
      markerColor: "rgb(50,150,200)", // any valid property for css `color` attribute
      markerClasses: ["custom-marker-style"],
      markerPinPath: "M16 0C7 0 0 7 0 15c0 9 16 37 16 37s16-28 16-37c0-8-7-15-16-15z",
      markerPinViewBox: "0 0 32 52"
    })
  },

  customSvgMarkerPinWithCustomSvgIcon: {
    latLng: [48.15390471523871, 11.54213011264801],
    popupMessage: "a marker with a custom svg pin and a custom svg icon",
    vectorMarker: VectorMarkers.icon({
      iconSize: [48, 64],
      iconAnchor: [24, 64], // this width is half the width of the `iconSize` width
      popupAnchor: [0, -(64 * 0.786)],

      iconColor: "white", // any valid property for css `color` attribute
      iconFontSize: 24,
      iconName: "home",

      iconSvg: {
        width: 64,
        height: 64,
        viewBox: [0, 0, 128, 128],
        paths: sampleIconSvgPaths.buildings.paths
      },

      markerColor: "rgb(50,150,200)", // any valid property for css `color` attribute
      markerClasses: ["custom-marker-style"],
      markerPinPath: "M16 0C7 0 0 7 0 15c0 9 16 37 16 37s16-28 16-37c0-8-7-15-16-15z",
      markerPinViewBox: "0 0 32 52"
    })
  }
};

/* -------------------------------------------------------------------------- */
/* (2) Instantiate Leaflet map and add custom markers
/* -------------------------------------------------------------------------- */

const mapContainer = document.getElementById("mapContainer");
const coords = [48.15491, 11.54183];
const initialZoom = 18;

const map = L.map(mapContainer).setView(coords, initialZoom);
map.on("click", e => console.log(e.latlng));

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 5
}).addTo(map);

Object.entries(vectorMarkerExamples).forEach(([name, example]) => {
  L.marker(example.latLng, { icon: example.vectorMarker, draggable: true })
    .addTo(map)
    .bindPopup(example.popupMessage);
});
