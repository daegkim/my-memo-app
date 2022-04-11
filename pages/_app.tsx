import '../styles/globals.scss'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Fragment } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>memo app</title>
      </Head>
      <Component {...pageProps} />
    </Fragment>
  )
}

export default MyApp
