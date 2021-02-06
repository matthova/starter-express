import type { Loader } from "@remix-run/data";
import { Meta, Scripts, Styles, useRouteData } from "@remix-run/react";
import { Outlet } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

const theme = {
  customRed: "#FF1234",
};

const Block = styled("div")`
  width: 100px;
  height: 100px;
  background-color: ${(p) => p.theme.customRed};
`;

export let loader: Loader = async () => {
  return { date: new Date() };
};

export default function App() {
  let data = useRouteData();

  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <Meta />
          <Styles />
        </head>
        <body>
          <Block />
          <Outlet />
          <footer>
            <p>This page was rendered at {data.date.toLocaleString()}</p>
          </footer>
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Oops!</title>
      </head>
      <body>
        <div>
          <h1>App Error</h1>
          <pre>{error.message}</pre>
          <p>
            Replace this UI with what you want users to see when your app throws
            uncaught errors. The file is at <code>app/App.tsx</code>.
          </p>
        </div>

        <Scripts />
      </body>
    </html>
  );
}
