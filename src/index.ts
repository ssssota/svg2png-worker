import {
  ConverterOptions,
  ConvertOptions,
  initialize,
  svg2png,
} from 'svg2png-wasm';
import marked from 'marked';
import wasm from './svg2png_wasm_bg.wasm';
import roboto from './Roboto-Thin.ttf';

const getOptionsFromUrl = (url: string): ConvertOptions => {
  try {
    const { searchParams } = new URL(url);
    const scale = Number(searchParams.get('svg2png-scale')) || 1;
    const backgroundColor = searchParams.get('svg2png-background') || undefined;
    return { scale, backgroundColor };
  } catch (e) {
    return {};
  }
};

const getSvgUrl = (source: string): string | undefined => {
  try {
    const { href, origin } = new URL(source);
    const svgPath = new URL(
      href.substring(origin.length + 1).replace(/(https?:)\/\/?/, '$1//'),
    );
    return svgPath.toString();
  } catch (e) {
    return undefined;
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
    return new Response(`${e}`, { status: 500 });
  }
};

const handleRequest = async (req: Request): Promise<Response> => {
  try {
    const svgUrl = getSvgUrl(req.url);
    if (svgUrl === undefined) {
      return new Response(marked(process.env.README ?? ''), {
        headers: { 'content-type': 'text/html' },
      });
    }

    const svg = await fetchSvg(svgUrl);
    if (svg instanceof Response) return svg;

    await initialize(wasm).catch(() => {});
    const options: ConverterOptions & ConvertOptions = {
      ...getOptionsFromUrl(req.url),
      fonts: await Promise.all([new Uint8Array(roboto)]),
      defaultFontFamily: {
        sansSerifFamily: 'Roboto',
        serifFamily: 'Roboto',
        cursiveFamily: 'Roboto',
        fantasyFamily: 'Roboto',
        monospaceFamily: 'Roboto',
      },
    };

    const buf = await svg2png(svg, options);
    return new Response(buf, { headers: { 'content-type': 'image/png' } });
  } catch (e) {
    return new Response(`${e}`, { status: 500 });
  }
};
export default { fetch: handleRequest };
