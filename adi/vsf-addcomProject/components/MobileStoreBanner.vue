<template>
  <AwBanner
    image="/homepage/bannerD.png"
    :subtitle="$t('Fashion to take away')"
    :title="$t('Download our application to your mobile')"
    class="sf-banner--left desktop-only banner-app"
  >
    <template #call-to-action>
      <div class="banner-app__call-to-action">
        <AwButton
          class="banner-app__button sf-button--pure"
          aria-label="Go to Apple Product"
          @click="() => {}"
        >
          <nuxt-img
            src="/homepage/apple.png"
            loading="lazy"
            width="174"
            height="57"
          /> 
        </AwButton>
        <AwButton
          class="banner-app__button sf-button--pure"
          aria-label="Go to Google Product"
          @click="() => {}"
        >
          <nuxt-img
            src="/homepage/google.png"
            loading="lazy"
            width="166"
            height="57"
          />
        </AwButton>
      </div>
    </template>
  </AwBanner>
</template>
<script type="module">
import AwBanner from '@storefront-ui/root/packages/vue/src/components/molecules/AwBanner/AwBanner.vue';
import AwButton from '@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue';
// import { 
//   SfBanner,
//   SfButton,
// } from '@storefront-ui/vue';
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'AppStoreBanner',
  components: {
    AwBanner,
    AwButton,
  },
});
</script>
<style lang="scss" scoped>

.banner-app {
  --banner-title-margin: var(--spacer-base) 0 var(--spacer-xl) 0;
  --banner-padding: 0 0 var(--spacer-2xl);
  // --banner-title-font-size: var(--h1-font-size);
  --banner-title-font-size: 190%;
  --banner-subtitle-font-size: var(--font-size--xl);
  // --banner-title-font-weight: var(--font-weight--semibold);
  --banner-title-font-weight:var(--semibold)"Source Sans Pro", sans-serif;
  --banner-subtitle-font-weight: var(--font-weight--medium);
  --banner-title-text-transform: capitalize;
  --banner-title-text-transform: none;
  --banner-background-size: contain;
  --banner-background-position: right;
  display: inline-block;
  min-height: 26.25rem;
  max-width: 77.5rem;
  margin: 0 auto;
  padding: 5.625rem 31.25rem 0 5.625rem;
  &__call-to-action {
    display: flex;
    flex-wrap: nowrap;
  }
  &__button {
    --image-width: 10.875rem;
    --image-height: 3.5625rem;
    pointer-events: visible;
    & + & {
      margin: 0 0 0 var(--spacer-base);
      margin-left:195px;
    }
  }
}
.sf-banner__subtitle{
  font-size: 16px;
}
#layout{
  position: absolute;
  width: 1240px;
  height: 420px;
}

</style>

<style lang=scss scoped>
.sf-banner__title{
  width: 400px;
  font-family: Source Sans Pro;
  font-size: 36px;
  font-weight: 600, semi bold;
  line-height: 48px;
  letter-spacing: 0px;
  text-align: left;
  
}
</style>