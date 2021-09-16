import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { createFilter } from '@rollup/pluginutils';
import { readFileSync, realpathSync } from 'fs';
import { defineConfig } from 'rollup';
import copy from 'rollup-plugin-copy';

/**
 * @param {{ include: import('@rollup/pluginutils').FilterPattern, exclude?: import('@rollup/pluginutils').FilterPattern }} options
 * @returns {{ name: string, load: (id: string) => string}}
 */
const raw = (options = {}) => {
  const filter = createFilter(options.include, options.exclude);
  return {
    name: 'raw',
    load(id) {
      if (!filter(id)) return;
      const path = realpathSync(id);
      const base64 = readFileSync(path).toString('base64');
      const code = `const raw = Uint8Array.from(atob('${base64}'), c => c.charCodeAt(0)); export default raw;`;
      return { code };
    },
  };
};

const config = defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.mjs',
    format: 'esm',
  },
  plugins: [
    nodeResolve(),
    typescript(),
    copy({
      targets: [
        {
          src: 'src/svg2png_wasm_bg.wasm',
          dest: 'dist',
        },
        {
          src: 'src/Roboto-Thin.ttf',
          dest: 'dist',
        },
      ],
    }),
  ],
  external: [/.+\.wasm$/i, /.+\.ttf$/i],
});

export default config;
