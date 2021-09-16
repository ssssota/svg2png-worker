import {
  ConvertOptions,
  createSvg2png,
  DefaultFontFamily,
} from 'svg2png-wasm/core';
import wasm from './svg2png_wasm_bg.wasm';
import roboto from './Roboto-Thin.ttf';

const svg2png = createSvg2png(wasm);
const fonts = [new Uint8Array(roboto)];
const defaultFontFamily: DefaultFontFamily = {
  sansSerifFamily: 'Roboto Thin',
  serifFamily: 'Roboto Thin',
  cursiveFamily: 'Roboto Thin',
  fantasyFamily: 'Roboto Thin',
  monospaceFamily: 'Roboto Thin',
};

const getOptionsFromUrl = (url: string): ConvertOptions => {
  try {
    const { searchParams } = new URL(url);
    const scale = Number(searchParams.get('svg2png-scale')) || 1;
    return { scale };
  } catch (e) {
    return {};
  }
};

const getSvgUrl = (source: string): string | Response => {
  try {
    const { href, origin } = new URL(source);
    const svgPath = new URL(
      href.substring(origin.length + 1).replace(/(https?:)\/\/?/, '$1//'),
    );
    return svgPath.toString();
  } catch (e) {
    return new Response('Invalid URL', {
      status: 400,
    });
  }
};

const fetchSvg = async (svgUrl: string): Promise<string | Response> => {
  try {
    const response = await fetch(svgUrl);
    const body = await response.text();
    if (response.ok) return body;
    return new Response(`SVGFetchError: ${body || response.statusText}`, {
      status: response.status,
      statusText: response.statusText,
    });
  } catch (e) {
    return new Response(`${e}`, {
      status: 500,
    });
  }
};

const main = async (req: Request): Promise<Response> => {
  try {
    const options = getOptionsFromUrl(req.url);
    const svgPath = getSvgUrl(req.url);
    if (svgPath instanceof Response) return svgPath;

    const svg = await fetchSvg(svgPath);
    if (svg instanceof Response) return svg;

    const buf = await svg2png(svg, {
      ...options,
      fonts,
      defaultFontFamily,
    });
    return new Response(buf, {
      headers: {
        'content-type': 'image/png',
      },
    });
  } catch (e) {
    return new Response(`${e}`, {
      status: 500,
    });
  }
};

export default { fetch: main };
