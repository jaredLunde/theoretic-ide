import { Provider as JotaiProvider } from "jotai";
import type { AppProps } from "next/app";
import * as React from "react";
import { Toast } from "@/components/toast";
import { GlobalStyles } from "@/styles/global";

function App({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <GlobalStyles />
      <Component {...pageProps} />
      <React.Suspense>{/*<Toast />*/}</React.Suspense>
    </JotaiProvider>
  );
}

export default App;
