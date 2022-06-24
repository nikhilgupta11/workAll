<template>
<AwTabs
:open-tab="1"
class="tab-orphan"
>
<AwTab :title="$t('My Loyalty Card')">
<p class="message">
This feature is not implemented yet! Please take a look at<br>
<AwLink
link="https://github.com/DivanteLtd/vue-storefront/issues"
target="_blank"
class="notice__link"
href="#"
>
https://github.com/DivanteLtd/vue-storefront/issues
</AwLink>
for our Roadmap!
</p>
</AwTab>
</AwTabs>
</template>

<script>

import AwTabs from '@storefront-ui/root/packages/vue/src/components/organisms/AwTabs/AwTabs.vue';
import AwButton from '@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue';
import AwLink from '@storefront-ui/root/packages/vue/src/components/atoms/AwLink/AwLink.vue';
import { onSSR } from '@vue-storefront/core';
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { useUser } from '@vue-storefront/magento';

export default defineComponent({
name: 'LoyalityCard',
components: {
AwTabs,
AwButton,
AwLink,
},
setup() {
const {
user,
load,
updateUser,
isAuthenticated,
} = useUser();

const isSubscribed = ref(!!user.value.is_subscribed);

onSSR(async () => {
await load();
});



return {
isSubscribed,

};
},
});
</script>

<style lang='scss' scoped>
.tab-orphan {
@include for-mobile {
--tabs-title-display: none;
--tabs-content-padding: 0;
--tabs-conent-border-width: 0;
}
}



.message {
margin: 0 0 var(--spacer-xl) 0;
color: var(--c-dark-variant);
}

.notice {
margin: var(--spacer-base) 0 0 0;
font-size: var(--font-size--xs);

&__link {
color: var(--c-primary);
text-decoration: none;

&:hover {
color: var(--c-text);
}
}
}
.notice__link,.message{
font-size: 16px;
}
</style>
