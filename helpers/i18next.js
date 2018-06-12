import i18n from 'i18next'
import XHR from 'i18next-xhr-backend';
import fetch from 'isomorphic-fetch'
/**
 * Initialize a i18next instance.
 * @function startI18n
 * @param {object} session - Session params.
 * @param {string} lang - Active language.
 * @param {object} i18nOptions - Custom options for i18n
 */
const startI18n = (session, lang, i18nOptions) => {
  const defaults = {
    lng: lang, // active language http://i18next.com/translate/
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    debug: false,
    backend: {
      // path where resources get loaded from, or a function
      // returning a path:
      // function(lngs, namespaces) { return customPath; }
      // the returned path will interpolate lng, ns if provided like giving a static path
      loadPath: '/translations/{{lng}}/{{ns}}.json',

      // your backend server supports multiloading
      // /locales/resources.json?lng=de+en&ns=ns1+ns2
      allowMultiLoading: false, // set loadPath: '/locales/resources.json?lng={{lng}}&ns={{ns}}' to adapt to multiLoading

      // allow cross domain requests
      crossDomain: true,

      // allow credentials on cross domain requests
      withCredentials: true,

      // define a custom xhr function
      // can be used to support XDomainRequest in IE 8 and 9
      ajax: (url, options, callback, data) => {
        const fetchOptions = {
          method: 'GET',
          headers: {
          'X-CSRF-TOKEN': session.csrfToken,
          'content-type': 'application/json'
          }
        }
        if (data) {
          fetchOptions.method = 'POST',
          fetchOptions.body = data
        }
        // TODO: dynamic domain
        fetch(`http://localhost:3000${url}`, fetchOptions)
          .then(response => response.json())
          .then(responseJson => {
            callback(JSON.stringify(responseJson), { status: 200 })
          })
          .catch((error) => console.error('i18n fetch error:', error))
      }
    }
  }

  return i18n.use(XHR).init((i18nOptions ? Object.assign({}, defaults, i18nOptions) : defaults))
}

export { startI18n }