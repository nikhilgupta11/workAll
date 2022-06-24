import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _2725fc46 = () => interopDefault(import('../pages/Home.vue' /* webpackChunkName: "" */))
const _09cb7f9e = () => interopDefault(import('../pages/Cart.vue' /* webpackChunkName: "" */))
const _16203f7c = () => interopDefault(import('../pages/Category.vue' /* webpackChunkName: "pages/Category" */))
const _53e76bc4 = () => interopDefault(import('../pages/Checkout.vue' /* webpackChunkName: "" */))
const _4640f110 = () => interopDefault(import('../pages/Checkout/Billing.vue' /* webpackChunkName: "" */))
const _048b39e1 = () => interopDefault(import('../pages/Checkout/ExternalCheckoutThankYou.vue' /* webpackChunkName: "" */))
const _361f79ca = () => interopDefault(import('../pages/Checkout/Payment.vue' /* webpackChunkName: "" */))
const _7cd1312e = () => interopDefault(import('../pages/Checkout/Shipping.vue' /* webpackChunkName: "" */))
const _a9b599e0 = () => interopDefault(import('../pages/Checkout/ThankYou.vue' /* webpackChunkName: "" */))
const _c3dbaf12 = () => interopDefault(import('../pages/Checkout/UserAccount.vue' /* webpackChunkName: "" */))
const _13a71614 = () => interopDefault(import('../pages/ContactForm.vue' /* webpackChunkName: "" */))
const _642052d3 = () => interopDefault(import('../pages/MyAccount.vue' /* webpackChunkName: "pages/MyAccount" */))
const _00d56acc = () => interopDefault(import('../pages/MyAccount/AddressesDetails.vue' /* webpackChunkName: "pages/MyAccount/AddressesDetails" */))
const _6a88c15a = () => interopDefault(import('../pages/MyAccount/BillingDetails.vue' /* webpackChunkName: "pages/MyAccount/BillingDetails" */))
const _a7c1e4de = () => interopDefault(import('../pages/MyAccount/MyNewsletter.vue' /* webpackChunkName: "pages/MyAccount/MyNewsletter" */))
const _333edd01 = () => interopDefault(import('../pages/MyAccount/MyProfile.vue' /* webpackChunkName: "pages/MyAccount/MyProfile" */))
const _7ac1be73 = () => interopDefault(import('../pages/MyAccount/MyReviews.vue' /* webpackChunkName: "pages/MyAccount/MyReviews" */))
const _46a9eec6 = () => interopDefault(import('../pages/MyAccount/MyWishlist.vue' /* webpackChunkName: "pages/MyAccount/MyWishlist" */))
const _f137a21c = () => interopDefault(import('../pages/MyAccount/OrderHistory.vue' /* webpackChunkName: "pages/MyAccount/OrderHistory" */))
const _3c93b2d8 = () => interopDefault(import('../pages/MyAccount/ShippingDetails.vue' /* webpackChunkName: "pages/MyAccount/ShippingDetails" */))
const _3ca2178d = () => interopDefault(import('../pages/Page.vue' /* webpackChunkName: "pages/Page" */))
const _1d83073e = () => interopDefault(import('../pages/Product.vue' /* webpackChunkName: "pages/Product" */))
const _71cf0908 = () => interopDefault(import('../pages/ResetPassword.vue' /* webpackChunkName: "" */))
const _360eefa8 = () => interopDefault(import('../pages/Shipping.vue' /* webpackChunkName: "pages/Shipping" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/default",
    component: _2725fc46,
    name: "home___default"
  }, {
    path: "/german",
    component: _2725fc46,
    name: "home___german"
  }, {
    path: "/default/cart",
    component: _09cb7f9e,
    name: "cart___default"
  }, {
    path: "/default/Cart",
    component: _09cb7f9e,
    name: "Cart___default"
  }, {
    path: "/default/Category",
    component: _16203f7c,
    name: "Category___default"
  }, {
    path: "/default/checkout",
    component: _53e76bc4,
    name: "checkout___default",
    children: [{
      path: "billing",
      component: _4640f110,
      name: "billing___default"
    }, {
      path: "external-thank-you",
      component: _048b39e1,
      name: "external-thank-you___default"
    }, {
      path: "payment",
      component: _361f79ca,
      name: "payment___default"
    }, {
      path: "shipping",
      component: _7cd1312e,
      name: "shipping___default"
    }, {
      path: "thank-you",
      component: _a9b599e0,
      name: "thank-you___default"
    }, {
      path: "user-account",
      component: _c3dbaf12,
      name: "user-account___default"
    }]
  }, {
    path: "/default/Checkout",
    component: _53e76bc4,
    name: "Checkout___default",
    children: [{
      path: "Billing",
      component: _4640f110,
      name: "Checkout-Billing___default"
    }, {
      path: "ExternalCheckoutThankYou",
      component: _048b39e1,
      name: "Checkout-ExternalCheckoutThankYou___default"
    }, {
      path: "Payment",
      component: _361f79ca,
      name: "Checkout-Payment___default"
    }, {
      path: "Shipping",
      component: _7cd1312e,
      name: "Checkout-Shipping___default"
    }, {
      path: "ThankYou",
      component: _a9b599e0,
      name: "Checkout-ThankYou___default"
    }, {
      path: "UserAccount",
      component: _c3dbaf12,
      name: "Checkout-UserAccount___default"
    }]
  }, {
    path: "/default/contact",
    component: _13a71614,
    name: "contact___default"
  }, {
    path: "/default/ContactForm",
    component: _13a71614,
    name: "ContactForm___default"
  }, {
    path: "/default/Home",
    component: _2725fc46,
    name: "Home___default"
  }, {
    path: "/default/MyAccount",
    component: _642052d3,
    name: "MyAccount___default",
    children: [{
      path: "AddressesDetails",
      component: _00d56acc,
      name: "MyAccount-AddressesDetails___default"
    }, {
      path: "BillingDetails",
      component: _6a88c15a,
      name: "MyAccount-BillingDetails___default"
    }, {
      path: "MyNewsletter",
      component: _a7c1e4de,
      name: "MyAccount-MyNewsletter___default"
    }, {
      path: "MyProfile",
      component: _333edd01,
      name: "MyAccount-MyProfile___default"
    }, {
      path: "MyReviews",
      component: _7ac1be73,
      name: "MyAccount-MyReviews___default"
    }, {
      path: "MyWishlist",
      component: _46a9eec6,
      name: "MyAccount-MyWishlist___default"
    }, {
      path: "OrderHistory",
      component: _f137a21c,
      name: "MyAccount-OrderHistory___default"
    }, {
      path: "ShippingDetails",
      component: _3c93b2d8,
      name: "MyAccount-ShippingDetails___default"
    }]
  }, {
    path: "/default/Page",
    component: _3ca2178d,
    name: "Page___default"
  }, {
    path: "/default/Product",
    component: _1d83073e,
    name: "Product___default"
  }, {
    path: "/default/reset-password",
    component: _71cf0908,
    alias: "/customer/account/createPassword",
    name: "reset-password___default"
  }, {
    path: "/default/ResetPassword",
    component: _71cf0908,
    name: "ResetPassword___default"
  }, {
    path: "/default/Shipping",
    component: _360eefa8,
    name: "Shipping___default"
  }, {
    path: "/german/cart",
    component: _09cb7f9e,
    name: "cart___german"
  }, {
    path: "/german/Cart",
    component: _09cb7f9e,
    name: "Cart___german"
  }, {
    path: "/german/Category",
    component: _16203f7c,
    name: "Category___german"
  }, {
    path: "/german/checkout",
    component: _53e76bc4,
    name: "checkout___german",
    children: [{
      path: "billing",
      component: _4640f110,
      name: "billing___german"
    }, {
      path: "external-thank-you",
      component: _048b39e1,
      name: "external-thank-you___german"
    }, {
      path: "payment",
      component: _361f79ca,
      name: "payment___german"
    }, {
      path: "shipping",
      component: _7cd1312e,
      name: "shipping___german"
    }, {
      path: "thank-you",
      component: _a9b599e0,
      name: "thank-you___german"
    }, {
      path: "user-account",
      component: _c3dbaf12,
      name: "user-account___german"
    }]
  }, {
    path: "/german/Checkout",
    component: _53e76bc4,
    name: "Checkout___german",
    children: [{
      path: "Billing",
      component: _4640f110,
      name: "Checkout-Billing___german"
    }, {
      path: "ExternalCheckoutThankYou",
      component: _048b39e1,
      name: "Checkout-ExternalCheckoutThankYou___german"
    }, {
      path: "Payment",
      component: _361f79ca,
      name: "Checkout-Payment___german"
    }, {
      path: "Shipping",
      component: _7cd1312e,
      name: "Checkout-Shipping___german"
    }, {
      path: "ThankYou",
      component: _a9b599e0,
      name: "Checkout-ThankYou___german"
    }, {
      path: "UserAccount",
      component: _c3dbaf12,
      name: "Checkout-UserAccount___german"
    }]
  }, {
    path: "/german/contact",
    component: _13a71614,
    name: "contact___german"
  }, {
    path: "/german/ContactForm",
    component: _13a71614,
    name: "ContactForm___german"
  }, {
    path: "/german/Home",
    component: _2725fc46,
    name: "Home___german"
  }, {
    path: "/german/MyAccount",
    component: _642052d3,
    name: "MyAccount___german",
    children: [{
      path: "AddressesDetails",
      component: _00d56acc,
      name: "MyAccount-AddressesDetails___german"
    }, {
      path: "BillingDetails",
      component: _6a88c15a,
      name: "MyAccount-BillingDetails___german"
    }, {
      path: "MyNewsletter",
      component: _a7c1e4de,
      name: "MyAccount-MyNewsletter___german"
    }, {
      path: "MyProfile",
      component: _333edd01,
      name: "MyAccount-MyProfile___german"
    }, {
      path: "MyReviews",
      component: _7ac1be73,
      name: "MyAccount-MyReviews___german"
    }, {
      path: "MyWishlist",
      component: _46a9eec6,
      name: "MyAccount-MyWishlist___german"
    }, {
      path: "OrderHistory",
      component: _f137a21c,
      name: "MyAccount-OrderHistory___german"
    }, {
      path: "ShippingDetails",
      component: _3c93b2d8,
      name: "MyAccount-ShippingDetails___german"
    }]
  }, {
    path: "/german/Page",
    component: _3ca2178d,
    name: "Page___german"
  }, {
    path: "/german/Product",
    component: _1d83073e,
    name: "Product___german"
  }, {
    path: "/german/reset-password",
    component: _71cf0908,
    alias: "/customer/account/createPassword",
    name: "reset-password___german"
  }, {
    path: "/german/ResetPassword",
    component: _71cf0908,
    name: "ResetPassword___german"
  }, {
    path: "/german/Shipping",
    component: _360eefa8,
    name: "Shipping___german"
  }, {
    path: "/default/my-account/:pageName?",
    component: _642052d3,
    name: "my-account___default"
  }, {
    path: "/german/my-account/:pageName?",
    component: _642052d3,
    name: "my-account___german"
  }, {
    path: "/default/p/:id/:slug",
    component: _1d83073e,
    name: "product___default"
  }, {
    path: "/german/p/:id/:slug",
    component: _1d83073e,
    name: "product___german"
  }, {
    path: "/default/c/:slug_1/:slug_2?/:slug_3?/:slug_4?/:slug_5?",
    component: _16203f7c,
    name: "category___default"
  }, {
    path: "/german/c/:slug_1/:slug_2?/:slug_3?/:slug_4?/:slug_5?",
    component: _16203f7c,
    name: "category___german"
  }, {
    path: "/default/:slug+",
    component: _3ca2178d,
    name: "page___default"
  }, {
    path: "/german/:slug+",
    component: _3ca2178d,
    name: "page___german"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
