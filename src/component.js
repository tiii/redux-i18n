/*
 * Project: redux-i18n
 * File: component.js
 */
import React from 'react'
import {connect} from 'react-redux'
import deepForceUpdate from 'react-deep-force-update'

class I18n extends React.Component {

  constructor(props) {
    super(props)
    this.trans = this.trans.bind(this)
  }

  // Check if the text need replace some params
  params(text, params) {
    if (params !== undefined) {
      for (let k in params) {
        let reg = new RegExp('\{' + k + '\}', 'g')
        text = text.replace(reg, params[k])
      }
    }
    return text
  }

  // Main method for translating texts
  trans(textKey, params) {
    let langMessages = this.props.translations[this.props.lang]

    if (langMessages === undefined) {
      return this.params(textKey, params)
    }

    let message = langMessages[textKey]
    if (message === undefined || message === '') {
      return this.params(textKey, params)
    }

    return this.params(message, params)
  }

  getChildContext() {
    return {
      t: this.trans
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.lang !== this.props.lang) {
      deepForceUpdate(this)
    }
  }

  render() {
    return this.props.children
  }
}

I18n.childContextTypes = {
  t: React.PropTypes.func.isRequired
}

I18n.propTypes = {
  translations: React.PropTypes.object.isRequired
}

export default connect(state => ({
  lang: state.i18nState.lang
}))(I18n)
