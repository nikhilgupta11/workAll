/* eslint-disable */
export default (ctx) => {
  const options = {"enabled":false,"invalidation":{"endpoint":undefined,"key":undefined,"handlers":["@vue-storefront\u002Fcache\u002FdefaultHandler"]},"driver":["@vue-storefront\u002Fredis-cache",{"redis":{"keyPrefix":undefined,"host":undefined,"port":undefined}}]};

  ctx.req.$vsfCache = {
    ...options,
    tagsSet: new Set()
  };
}
