import React from 'react'
import App, {Container} from 'next/app'
import Router from 'next/router'
import { I18nextProvider, translate } from 'react-i18next'
import { startI18n } from '../helpers/i18next'

export default class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx, lang }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  constructor (props) {
    super(props)
    const { session, lang } = props.pageProps
    this.i18n = startI18n(session, lang)
  }

  render () {
    const {Component, pageProps} = this.props
    const TranslatedComponent = translate(['common'], { wait: true })(Component)
    return ( 
      <Container>
        <I18nextProvider i18n={this.i18n}>
          <TranslatedComponent {...pageProps} />
        </I18nextProvider>
      </Container>
    )
  }
}