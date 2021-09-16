# svg2png-worker

svg2png-wasm demo with Cloudflare Workers.

Convert online svg to png.

## Usage

`https://svg2png-worker.ssssota.workers.dev/[svg url]`

e.g.

`https://svg2png-worker.ssssota.workers.dev/https://github.com/ssssota/svg2png-wasm/raw/main/logo.svg`

![](https://svg2png-worker.ssssota.workers.dev/https://github.com/ssssota/svg2png-wasm/raw/main/logo.svg)

### options

`?svg2png-scale=N`

e.g.

`https://svg2png-worker.ssssota.workers.dev/https://github.com/ssssota/svg2png-wasm/raw/main/logo.svg?svg2png-scale=10`

![](https://svg2png-worker.ssssota.workers.dev/https://github.com/ssssota/svg2png-wasm/raw/main/logo.svg?svg2png-scale=10)

## License

MIT

This project use [resvg](https://github.com/RazrFalcon/resvg) that project is licensed under the MPLv2.0.
You can see resvg source from [here](https://github.com/RazrFalcon/resvg).
