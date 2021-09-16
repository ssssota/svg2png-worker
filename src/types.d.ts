declare module '*.wasm' {
  const wasm: WebAssembly.Module;
  export default wasm;
}

declare module '*.ttf' {
  const raw: ArrayBuffer;
  export default raw;
}
