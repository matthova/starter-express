import type { EntryContext } from "@remix-run/core";
import Remix from "@remix-run/react/server";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const sheet = new ServerStyleSheet();

  let markup = renderToString(
    sheet.collectStyles(<Remix context={remixContext} url={request.url} />)
  );

  // get the styles
  const styles = sheet
    .getStyleTags()
    // remove the <style> tags
    .replace(/(<([^>]+)>)/gi, "");
  const styleData = Buffer.from(styles).toString("base64");
  sheet.seal();

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
      Link: `<data:text/css;utf-8;base64,${styleData}>; REL=stylesheet`,
    },
  });
}
