import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head';

export default class MyApp extends App {
  constructor(props) {
    super(props);
    
    this.state = {
      date: ''
    }
  }

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const res = await fetch('https://wfc-2019.firebaseapp.com/images?limit=200&offset=0');
    const json = await res.json();
    const data = await json.data;

    pageProps.data = data;
    
    return { pageProps }
  }

  componentDidMount() { 
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <title>from</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <meta property="og:title" content='from' />
          <meta property="og:description" content='from now' />
          <meta property="og:type" content="blog" />
          <meta property="og:url" content='ca-fe-challenge.tsubasahonda.now.sh' />
          <meta property="og:image" content='' />
          <meta property="og:site_name" content='from now' />
        </Head>
        <Component {...pageProps} />
      </Container>
    )
  }
}