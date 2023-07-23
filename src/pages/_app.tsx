import './globals.css'
import type { AppProps } from 'next/app'
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import Layout from "../layout/Layout";
import Head from 'next/head';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <Layout style={{ alignText: 'center', }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content="Aptos Toad Overload" />
          <meta property="og:url" content="https://aptoads.io" />
          <meta property="og:image" content="https://aptoads.nyc3.digitaloceanspaces.com/images/aptoads.png" />
          <link rel="shortcut icon" href="https://aptoads.nyc3.digitaloceanspaces.com/images/aptoads.ico" />
          <title>Aptos Toad Overload</title>
        </Head>
        <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp
