import crypto from "crypto";
import { Style } from "@dash-ui/react/server";
import Document, { Head, Html, Main, NextScript } from "next/document";
import * as React from "react";
import { styles } from "@/dash.config";

export default class AppDocument extends Document {
  render() {
    const nonce = crypto.randomBytes(16).toString("base64");

    return (
      <Html>
        <Head nonce={nonce}>
          <meta httpEquiv="Content-Security-Policy" content={csp(nonce)} />
          <meta name="referrer" content="strict-origin" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Lora&display=swap"
            rel="stylesheet"
          ></link>
          <Style html={this.props.html} styles={styles} />
        </Head>
        <body className={styles.theme("light")}>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

function csp(nonce: string) {
  return "".concat(
    `base-uri 'self';`,
    `form-action 'self';`,
    `default-src 'self';`,
    `script-src 'self' ${
      process.env.NODE_ENV === "production"
        ? `'nonce-${nonce}' https://browser.sentry-cdn.com https://js.sentry-cdn.com https://*.sentry.io https://*.lunde.cloud https://lunde.cloud`
        : "'unsafe-eval'"
    };`,
    `style-src 'self' https://fonts.googleapis.com 'unsafe-inline';`,
    `connect-src 'self' *.sentry.io sentry.io vitals.vercel-insights.com wss://${process.env.NEXT_LUNDE_CLOUD_WS_ENDPOINT};`,
    `img-src 'self' https://*.githubusercontent.com https://*.lunde.cloud https://lunde.cloud data: blob:;`,
    `font-src 'self' https://fonts.gstatic.com;`,
    `frame-src *;`,
    `media-src *;`
  );
}
