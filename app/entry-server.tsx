import ReactDOMServer from "react-dom/server";
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
  let markup = ReactDOMServer.renderToString(
    <Remix context={remixContext} url={request.url} />
  );

  const sheet = new ServerStyleSheet();
  let styleHeader = "";
  try {
    const html = renderToString(
      sheet.collectStyles(<Remix context={remixContext} url={request.url} />)
    );
    styleHeader = sheet
      .getStyleTags()
      // remove the <style> tags?
      .replace(/(<([^>]+)>)/gi, "")
      // remove line breaks to be a valid Fetch header string
      .replace(/\n/g, "");
  } catch (error) {
    // handle error
    console.error(error);
  } finally {
    sheet.seal();
  }

  console.log("Our styles: ", styleHeader);

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
      style: styleHeader,
    },
  });
}
