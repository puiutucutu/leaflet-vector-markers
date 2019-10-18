// throws InvalidViewBoxProvidedError when a viewBox string is provided
// instead of a 4-tuple
//
// const sampleIconSvgPaths = {
//   buildings: {
//     // https://www.freepik.com/free-icon/city_868941.htm
//     width: "128",
//     height: "128",
//     viewBox: "0 0 128 128", // instead of [0,0,128,128]
//     paths: [
//       {
//         d: "M28 40h-8v8h8v-8zm32-8h-8v8h8v-8zm16 0h-8v8h8v-8zm16 0h-8v8h8v-8zM60 16h-8v8h8v-8zm16 0h-8v8h8v-8zm16 0h-8v8h8v-8zM60 64h-8v8h8v-8zm16 0h-8v8h8v-8zm16 0h-8v8h8v-8zM60 80h-8v8h8v-8zm32 0h-8v8h8v-8zM60 96h-8v8h8v-8zm32 0h-8v8h8v-8zM60 48h-8v8h8v-8zm16 0h-8v8h8v-8zm16 0h-8v8h8v-8zm-64 8h-8v8h8v-8zm0 16h-8v8h8v-8zm0 16h-8v8h8v-8zm0 16h-8v8h8v-8zm48-24h-8v8h8v-8zm40-24h-8V8c0-4.422-3.578-8-8-8H44c-4.422 0-8 3.578-8 8v16H12c-4.422 0-8 3.578-8 8v88c0 4.422 3.578 8 8 8h104c4.422 0 8-3.578 8-8V64c0-4.422-3.578-8-8-8zm-80 64H12V32h24v88zm64 0H76V96h-8v24H44V8h56v112zm16 0h-8v-8h8v8zm0-16h-8v-8h8v8zm0-16h-8v-8h8v8zm0-16h-8v-8h8v8z",
//         attributes: {
//           "fill-rule": "evenodd",
//           "clip-rule": "evenodd"
//         }
//       }
//     ]
//   }
// };
