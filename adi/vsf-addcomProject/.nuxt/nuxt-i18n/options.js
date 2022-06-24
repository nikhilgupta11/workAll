import locale77427e78 from '../../lang/en.js'

export const Constants = {
  COMPONENT_OPTIONS_KEY: "nuxtI18n",
  STRATEGIES: {"PREFIX":"prefix","PREFIX_EXCEPT_DEFAULT":"prefix_except_default","PREFIX_AND_DEFAULT":"prefix_and_default","NO_PREFIX":"no_prefix"},
}
export const nuxtOptions = {
  isUniversalMode: true,
  trailingSlash: undefined,
}
export const options = {
  vueI18n: {"fallbackLocale":"default","numberFormats":{"default":{"currency":{"style":"currency","currency":"USD","currencyDisplay":"symbol"}},"german":{"currency":{"style":"currency","currency":"EUR","currencyDisplay":"symbol"}}}},
  vueI18nLoader: false,
  locales: [{"code":"default","file":"en.js","iso":"en_US","defaultCurrency":"USD"},{"code":"german","file":"de.js","iso":"de_DE","defaultCurrency":"EUR"}],
  defaultLocale: "default",
  defaultDirection: "ltr",
  routesNameSeparator: "___",
  defaultLocaleRouteNameSuffix: "default",
  sortRoutes: true,
  strategy: "prefix",
  lazy: true,
  langDir: "/home/addweb/Desktop/adi/vsf-addcomProject/lang",
  rootRedirect: null,
  detectBrowserLanguage: false,
  differentDomains: false,
  seo: true,
  baseUrl: "http://localhost:3000",
  vuex: {"moduleName":"i18n","syncLocale":false,"syncMessages":false,"syncRouteParams":true},
  parsePages: true,
  pages: {},
  skipSettingLocaleOnNavigate: false,
  beforeLanguageSwitch: () => null,
  onBeforeLanguageSwitch: () => {},
  onLanguageSwitched: () => null,
  country: "US",
  autoChangeCookie: {"currency":false,"locale":false,"country":false},
  normalizedLocales: [{"code":"default","file":"en.js","iso":"en_US","defaultCurrency":"USD"},{"code":"german","file":"de.js","iso":"de_DE","defaultCurrency":"EUR"}],
  localeCodes: ["default","german"],
}

export const localeMessages = {
  'en.js': () => Promise.resolve(locale77427e78),
  'de.js': () => import('../../lang/de.js' /* webpackChunkName: "lang-de.js" */),
}
