<template>
  <div>
    <AwTabs :open-tab="1" class="customer_service">
      <AwTab :title="$t('About Us')">
        <p>
          This website ("website") is operated by Luma Inc., which includes Luma
          stores, and Luma Private Sales. This privacy policy only covers
          information collected at this website, and does not cover any
          information collected offline by Luma. All Luma websites are covered
          by this privacy policy.
        </p>
      </AwTab>
    </AwTabs>
  </div>
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";
import AwTabs from "@storefront-ui/root/packages/vue/src/components/organisms/AwTabs/AwTabs.vue";

export default defineComponent({
  name: "AboutUs",

  components: {
    AwTabs,
  },
});
</script>

<style lang="scss" scoped>
p,
h1 {
  font-family: "Source Sans Pro";
  font-style: normal;
  font-weight: 400;
  color: #282828;
  font-size: 18px;
}
p {
  font-size: 16px;
  color: #3c3c3c;
}
</style>
