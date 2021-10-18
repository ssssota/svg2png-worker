import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';
import { readFileSync } from 'fs';

const config = defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.mjs',
    format: 'esm',
  },
  plugins: [
    replace({
      'process.env.README': JSON.stringify(readFileSync('README.md', 'utf8')),
    }),
    nodeResolve(),
    typescript(),
    copy({
      targets: [
        {
          src: 'node_modules/svg2png-wasm/svg2png_wasm_bg.wasm',
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
