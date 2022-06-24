<template>
  <AwTabs :open-tab="1" class="customer_service">
    <AwTab :title="$t('Security')">
      <p>
        This website ("website") is operated by Luma Inc., which includes Luma
        stores, and Luma Private Sales. This privacy policy only covers
        information collected at this website, and does not cover any
        information collected offline by Luma. All Luma websites are covered by
        this privacy policy.
      </p>
    </AwTab>

    <AwTab :title="$t('Privacy Policy')">
      <p>
        This website ("website") is operated by Luma Inc., which includes Luma
        stores, and Luma Private Sales. This privacy policy only covers
        information collected at this website, and does not cover any
        information collected offline by Luma. All Luma websites are covered by
        this privacy policy.
      </p>
    </AwTab>
    <AwTab :title="$t('Additional Information')">
      <p>
        This website ("website") is operated by Luma Inc., which includes Luma
        stores, and Luma Private Sales. This privacy policy only covers
        information collected at this website, and does not cover any
        information collected offline by Luma. All Luma websites are covered by
        this privacy policy.
      </p>
      <p class="sub_title">Luma Security</p>
      <p class="sub_title_content">
        Personal information provided on the website and online credit card
        transactions are transmitted through a secure server. We are committed
        to handling your personal information with high standards of information
        security. We take appropriate physical, electronic, and administrative
        steps to maintain the security and accuracy of personally identifiable
        information we collect, including limiting the number of people who have
        physical access to our database servers, as well as employing electronic
        security systems and password protections that guard against
        unauthorized access.
      </p>
    </AwTab>
  </AwTabs>
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";
import AwTabs from "@storefront-ui/root/packages/vue/src/components/organisms/AwTabs/AwTabs.vue";

export default defineComponent({
  name: "CustomerService",

  components: {
    AwTabs,
  },
});
</script>

<style lang="scss" scoped>
p,
.sub_title,
.sub_title_content {
  font-family: "Source Sans Pro";
  font-style: normal;
  font-weight: 400;
  color: #3c3c3c;
}

p {
  font-size: 16px;
  line-height: 22px;
  align-items: center;
  display: flex;
}

.sub_title {
  left: 572px;
  top: 376px;
  font-size: 24px;
  line-height: 32px;
}

.sub_title_content {
  left: 572px;
  top: 424px;
  font-size: 16px;
  line-height: 22px;
  display: flex;
  align-items: center;
}
</style>
