import { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'
import 'dotenv/config'

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/fonts/fontawesome6/css/all.min.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
      </Head>
      <body>
        <Main />

        <NextScript />

        <script src="/assets/bootstrap/js/bootstrap.min.js"></script>
        <script src="/assets/js/jquery.min.js"></script>
        <script src="/assets/js/main.js"></script>
      </body>
    </Html>
  )
}