<template>
  <div>
    <div
      class="highlighted"
      v-if="route.fullPath === '/default/checkout/payment'"
    >
      <h1>Order Review</h1>
      <!-- <h1>{{user}}</h1> -->
      <!-- <h1>{{shipping}}</h1> -->
      <!-- <h1>{{billing}}</h1> -->
      
      <!-- <p>{{ userbilling }}</p> -->
      <!-- <p>{{ usershipping }}</p> -->

      <AwProperty
        :name="$t('Personal detail')"
        :value="user"
        class="sf-property--full-width sf-property--large property"
      />
      <AwProperty
        :name="$t('shipping detail')"
        :value="shipping"
        class="sf-property--full-width sf-property--large property"
      />
      <AwProperty
        :name="$t('billing detail')"
        :value="billing"
        class="sf-property--full-width sf-property--large property"
      />
      <AwProperty
        :name="$t('Payment method')"
        :value="selectedMethod"
        class="sf-property--full-width sf-property--large property"
      />
      <billingAddresses />

      <BillingStep />
      <ShippingStep />
    </div>

    <div
      class="highlighted"
      v-if="route.fullPath !== '/default/checkout/payment'"
    >
      <AwHeading
        :level="3"
        :title="$t('Totals')"
        class="sf-heading--left sf-heading--no-underline title"
      />
    </div>
    <div
      class="highlighted"
      v-if="route.fullPath !== '/default/checkout/payment'"
    >
      <AwProperty
        :name="$t('Products')"
        :value="totalItems"
        class="sf-property--full-width sf-property--large property"
      />
      <AwProperty
        :name="$t('Subtotal')"
        :value="$fc(totals.subtotal)"
        :class="['sf-property--full-width', 'sf-property--large property']"
      />
      <AwProperty
        v-if="hasDiscounts"
        :name="$t('Discount')"
        :value="$fc(discountsAmount)"
        class="sf-property--full-width sf-property--small property"
      />
      <AwProperty
        v-if="selectedShippingMethod"
        :name="$t('Shipping')"
        :value="$fc(getShippingMethodPrice(selectedShippingMethod))"
        class="sf-property--full-width sf-property--large property"
      />

      <AwProperty
        :name="$t('Total')"
        :value="$fc(totals.total)"
        class="sf-property--full-width sf-property--large property-total"
      />
    </div>
    <CouponCode class="highlighted" />
    <div class="highlighted">
      <AwCharacteristic
        v-for="characteristic in characteristics"
        :key="characteristic.title"
        :title="characteristic.title"
        :description="characteristic.description"
        :icon="characteristic.icon"
        class="characteristic"
      />
    </div>
  </div>
</template>
<script>
import AwHeading from "@storefront-ui/root/packages/vue/src/components/atoms/AwHeading/AwHeading.vue";
import AwProperty from "@storefront-ui/root/packages/vue/src/components/atoms/AwProperty/AwProperty.vue";
import AwCharacteristic from "@storefront-ui/root/packages/vue/src/components/molecules/AwCharacteristic/AwCharacteristic.vue";

import {
  computed,
  ref,
  defineComponent,
  useRoute,
} from "@nuxtjs/composition-api";
import { useCart, cartGetters } from "@vue-storefront/magento";
import getShippingMethodPrice from "~/helpers/checkout/getShippingMethodPrice";
import CouponCode from "../../components/CouponCode.vue";

// import UserAccount from '../../pages/Checkout/UserAccount.vue'
// import billing from '../../pages/Checkout/Billing.vue'
// import UserBillingAddresses from '../../components/Checkout/UserBillingAddresses.vue'
// import { form } from '../../pages/Checkout/UserAccount.vue';

import { useUser, userGetters } from "@vue-storefront/magento";
import { useUserBilling, userBillingGetters } from "@vue-storefront/magento";
import { useUserShipping, userShippingGetters } from "@vue-storefront/magento";
import { selectedMethod } from "./VsfPaymentProvider.vue";
import { useBilling, useShipping } from "@vue-storefront/magento";
// import { email } from "vee-validate/dist/rules";
// import { userAddressesGetters } from '@vue-storefront/magento';
// import {
//   // useBilling,
//   // useShipping,
//   addressGetter,
// } from "@vue-storefront/magento";

// import { billingAddresses } from './UserBillingAddresses.vue'

// import { BillingStep } from '../../pages/Checkout/Billing.vue'
// import { ShippingStep } from '../../pages/Checkout/Shipping.vue'

const CHARACTERISTICS = [
  {
    title: "Safety",
    description: "It carefully packaged with a personal touch",
    icon: "safety",
  },
  {
    title: "Easy shipping",
    description: "You’ll receive dispatch confirmation and an arrival date",
    icon: "shipping",
  },
  {
    title: "Changed your mind?",
    description: "Rest assured, we offer free returns within 30 days",
    icon: "return",
  },
];

export default defineComponent({
  name: "CartPreview",

  components: {
    AwHeading,
    AwProperty,
    AwCharacteristic,
    CouponCode,
    // UserBillingAddresses,
    // UserAccount,
    // billing,
    // address,
    selectedMethod,

    // billingAddresses,

    // BillingStep,
    // ShippingStep
  },
  setup() {
    const { cart, removeItem, updateItemQty } = useCart();
    const user = useUser();
    const billing = useBilling();
    const shipping = useShipping();

    // console.log(shipping.shipping.value.firstname)

    const userbilling = useUserBilling();
    const usershipping = useUserShipping();

    const route = useRoute();

    const listIsHidden = ref(false);

    const products = computed(() => cartGetters.getItems(cart.value));
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const discounts = computed(() => cartGetters.getDiscounts(cart.value));
    const hasDiscounts = computed(() => discounts.value.length > 0);
    const discountsAmount = computed(
      () => -1 * discounts.value.reduce((a, el) => el.value + a, 0)
    );
    const selectedShippingMethod = computed(() =>
      cartGetters.getSelectedShippingMethod(cart.value)
    );

    // const personaldetail = computed(()=> form.value.firstname);
    // console.log(personaldetail)
    // const personaldetail = computed(()=> addressGetter);
    // console.log(personaldetail)
    // const userAddress = computed(() => ({
    //   firstName: userAddressesGetters.getFirstName,
    //   lastName: userAddressesGetters.getLastName,
    //   street: userAddressesGetters.getStreetName,
    //   streetNumber: userAddressesGetters.getApartmentNumber,
    //   postalCode: userAddressesGetters.getPostCode,
    //   city: userAddressesGetters.getCity,
    //   province: userAddressesGetters.getProvince,
    //   country: userAddressesGetters.getCountry,
    //   phone: userAddressesGetters.getPhone,
    // }));
    // console.log(userAddress)

    // const userDetail = computed(() => userGetters.getFirstName(user));
    // console.log(userDetail);
    // const shippingDetail = computed(() => userShippingGetters.getAddresses(shipping));
    // console.log(shippingDetail);
    // const billingDetail = computed(() => userBillingGetters.getAddresses(billing));
    // console.log(billingDetail);

    // const userDetail = {
    //   name:user.user.value.firstname + " " + user.user.value.lastname ,
    //   email:user.user.value.email
    // };
    // console.log(userDetail);
    // const shippingDetail = computed(() => shipping1);
    // console.log(shippingDetail);
    // const billingDetail = computed(() => billing1);
    // console.log(billingDetail);
    try{
      let fname = user.user.value.firstname
      let lname = user.user.value.lastname
      const shipDetail =  fname + " " + lname
      const email = user.user.value.email
      console.log(shipDetail)
      console.log(email)
    }
    catch(err){
      console.log("data is loading ......")
    }
    // console.log(user)
    // console.log(shipping)
    // console.log(billing)

    return {
      cart,
      discounts,
      discountsAmount,
      hasDiscounts,
      totalItems,
      listIsHidden,
      products,
      totals,
      removeItem,
      updateItemQty,
      cartGetters,
      getShippingMethodPrice,
      characteristics: CHARACTERISTICS,
      selectedShippingMethod,

      route,

      user,
      shipping,
      billing,

      userbilling,
      usershipping
    };
  },
});
</script>

<style lang="scss" scoped>
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-xl) var(--spacer-xl) 0;

  &:last-child {
    padding-bottom: var(--spacer-xl);
  }
}

.total-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacer-xl);
}

.property {
  margin-bottom: var(--spacer-base);
}

.property-total {
  margin-top: var(--spacer-xl);
  padding-top: var(--spacer-lg);
  font-size: var(--font-size-xl);
  border-top: var(--c-white) 1px solid;
  --property-name-font-weight: var(--font-weight--semibold);
  --property-name-color: var(--c-text);
}

.characteristic {
  &:not(:last-child) {
    margin-bottom: var(--spacer-base);
  }
}
</style>
