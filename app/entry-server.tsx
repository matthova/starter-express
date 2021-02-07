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

  const styles = sheet.getStyleTags();
  sheet.seal();

  const markupWithStyles = markup.replace("</head>", `${styles}</head>`);
  return new Response("<!DOCTYPE html>" + markupWithStyles, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
    },
  });
}
