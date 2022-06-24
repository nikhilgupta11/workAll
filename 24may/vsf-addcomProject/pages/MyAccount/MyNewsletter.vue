<template>
<AwTabs
:open-tab="1"
class="tab-orphan"
>
<AwTab :title="$t('My newsletter')">
<p class="message">
{{ $t('Set up newsletter') }}
</p>
<div class="form">
<div class="form__checkbox-group">
Select what interests you:
<AwCheckbox
v-model="isSubscribed"
v-e2e="'sign-up-newsletter'"
:label="$t('Woman')"
name="box"
class="form__element checkbox"
/>
<AwCheckbox
v-model="isSubscribed1"
v-e2e="'sign-up-newsletter'"
:label="$t('Men')"
name="box"
class="form__element"
/>
<AwCheckbox
v-model="isSubscribed2"
v-e2e="'sign-up-newsletter'"
:label="$t('Kids')"
name="box"
class="form__element"
/>
</div>
<AwButton
class="form__button"
@click="saveForm"
>
{{ $t('Save changes') }}
</AwButton>
</div>
<p class="notice">
I have read and understand the Privacy and Cookies Policy and agree to receive personalized commercial information from Brand name by email.
</p>
</AwTab>
</AwTabs>
</template>

<script>

import AwTabs from '@storefront-ui/root/packages/vue/src/components/organisms/AwTabs/AwTabs.vue';
import AwCheckbox from '@storefront-ui/root/packages/vue/src/components/molecules/AwCheckbox/AwCheckbox.vue';
import AwButton from '@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue';
import AwLink from '@storefront-ui/root/packages/vue/src/components/atoms/AwLink/AwLink.vue';
// import {
// SfTabs, SfCheckbox, SfButton, SfLink,
// } from '@storefront-ui/vue';
import { onSSR } from '@vue-storefront/core';
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { useUser } from '@vue-storefront/magento';

export default defineComponent({
name: 'MyNewsletter',
components: {
AwTabs,
AwCheckbox,
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
const isSubscribed1 = ref(!!user.value.is_subscribed);
const isSubscribed2 = ref(!!user.value.is_subscribed);

onSSR(async () => {
await load();
});
const saveForm = async () => {
if (isAuthenticated.value && !!user.value.box) {
await updateUser({
user: {
is_subscribed: isSubscribed.value,
is_subscribed: isSubscribed1.value,
is_subscribed: isSubscribed2.value,
},
});
}
};

return {
isSubscribed,
isSubscribed1,
isSubscribed2,
saveForm,
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

.form {
&__element {
margin: 0 0 var(--spacer-base) 0;

&:last-child {
margin: 0;
}
}

&__checkbox-group {
margin: 0 0 var(--spacer-xl) 0;
}

&__title {
margin: 0 0 var(--spacer-base) 0;
}

&__button {
--button-width: 100%;
@include for-desktop {
--button-width: 17.5rem;
}
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
.checkbox{
margin-top: 40px;
}
</style>