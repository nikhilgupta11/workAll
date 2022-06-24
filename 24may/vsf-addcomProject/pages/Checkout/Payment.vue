<template>
  <div id="payment">
    <!-- <p>haloo</p> -->
    <AwHeading
      :level="5"
      title="Order Details"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <AwTable class="sf-table--bordered table desktop-only">
      <AwTableHeading class="table__row">
        <AwTableHeader class="table__header table__image">
          {{ $t('Item') }}
        </AwTableHeader>
        <AwTableHeader
          v-for="tableHeader in tableHeaders"
          :key="tableHeader"
          class="table__header"
          :class="{ table__description: tableHeader === 'Description' }"
        >
          {{ tableHeader }}
          
        </AwTableHeader>
      </AwTableHeading>
      <AwTableRow
        v-for="(product, index) in products"
        :key="index"
        class="table__row"
      >
        <AwTableData class="table__image">
           <nuxt-img
            :src="getMagentoImage(cartGetters.getItemImage(product))"
            :alt="cartGetters.getItemName(product)"
            :width="imageSizes.cartItem.width"
            :height="imageSizes.cartItem.height"
          /> 
           </AwTableData>
          
            

        <AwTableData class="table__data table__description table__data">
          <div class="product-title">
            {{ cartGetters.getItemName(product) }}
          </div>
          <div class="product-sku">
            {{ cartGetters.getItemSku(product) }}
          </div>
          
          <template
            v-if="getBundles(product).length > 0"
          >
            <p
              v-for="bundle in getBundles(product)"
              :key="bundle.label"
              class="detail-information"
            >
              {{ `${bundle.quantity}x ${bundle.label}` }}
            </p>

          </template>
        </AwTableData>
         <AwTableData>
          <h5 v-if="(getAttributes(product))&&(getAttributes(product))[0] && (getAttributes(product))[0].value_label">{{(getAttributes(product))[0].value_label}}</h5>
           
            </AwTableData>
             <AwTableData>
          <h5 v-if="(getAttributes(product))&&(getAttributes(product))[1] && (getAttributes(product))[1].value_label">{{(getAttributes(product))[1].value_label}}</h5>
           
            </AwTableData>
        <AwTableData class="table__data">
          {{ cartGetters.getItemQty(product) }}
        </AwTableData>
        <AwTableData class="table__data price">
          <AwPrice
            :regular="$fc(cartGetters.getItemPrice(product).regular)"
            :special="cartGetters.getItemPrice(product).special && $fc(cartGetters.getItemPrice(product).special)"
            class="product-price"
          />
        </AwTableData>
      </AwTableRow>
    </AwTable>
    <div class="summary">
      <div class="summary__group">
        <div class="summary__total">
          <AwProperty
            name="Subtotal"
            :value="$fc(totals.subtotal)"
            class="sf-property--full-width property"
          />
           <AwProperty
            name="Shipping"
            value="free"
            class="sf-property--full-width property"
          />
        
        </div>
       
       

        <AwDivider />

        <AwProperty
          name="Total price"
          :value="$fc(totals.total)"
          class="sf-property--full-width sf-property--large summary__property-total"
        />

         <!-- <VsfPaymentProvider
          @status="isPaymentReady = true"
        />  -->

        <AwCheckbox
          v-model="terms"
          v-e2e="'terms'"
          name="terms"
          class="summary__terms"
        >
          <template #label>
            <div class="sf-checkbox__label" >
              {{ $t('I agree to') }}
              <AwLink href="#">
                {{ $t('Terms and conditions') }}
              </AwLink>
            </div>
          </template>
        </AwCheckbox>

        <div class="summary__action">
          <AwButton
            v-e2e="'make-an-order'"
            class="summary__action-button"
            @click="processOrder"
          >
            {{ $t('CONFIRM AND PAY') }}
          </AwButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import AwHeading from '@storefront-ui/root/packages/vue/src/components/atoms/AwHeading/AwHeading.vue';
import AwTable from '@storefront-ui/root/packages/vue/src/components/organisms/AwTable/AwTable.vue';
import AwCheckbox from '@storefront-ui/root/packages/vue/src/components/molecules/AwCheckbox/AwCheckbox.vue';
import AwButton from '@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue';
import AwDivider from '@storefront-ui/root/packages/vue/src/components/atoms/AwDivider/AwDivider.vue';
import AwPrice from '@storefront-ui/root/packages/vue/src/components/atoms/AwPrice/AwPrice.vue';
import AwProperty from '@storefront-ui/root/packages/vue/src/components/atoms/AwProperty/AwProperty.vue'
import AwLink from '@storefront-ui/root/packages/vue/src/components/atoms/AwLink/AwLink.vue';
import { useVSFContext } from '@vue-storefront/core';
import {
  ref,
  computed,
  defineComponent,
  useRouter,
  useContext, onMounted,
} from '@nuxtjs/composition-api';
import {
  useMakeOrder,
  useCart,
  cartGetters,
} from '@vue-storefront/magento';
import getShippingMethodPrice from '~/helpers/checkout/getShippingMethodPrice';
import { useImage } from '~/composables';
import { removeItem } from '~/helpers/asyncLocalStorage';
import { isPreviousStepValid } from '~/helpers/checkout/steps';

export default defineComponent({
  name: 'ReviewOrderAndPayment',
  components: {
    AwHeading,
    AwTable,
    AwCheckbox,
    AwButton,
    AwDivider,
    AwPrice,
    AwProperty,
    AwLink,
    VsfPaymentProvider: () => import('~/components/Checkout/VsfPaymentProvider.vue'),
  },
  setup() {
    const { cart, load, setCart } = useCart();
    const { order, make, loading } = useMakeOrder();
    const { $magento } = useVSFContext();
    const { app } = useContext();
    const router = useRouter();
    const isPaymentReady = ref(false);
    const terms = ref(false);
    const getAttributes = (product) => product.configurable_options || [];
    const getBundles = (product) => product.bundle_options?.map((b) => b.values).flat() || [];

    onMounted(async () => {
      const validStep = await isPreviousStepValid('billing');
      if (!validStep) {
        await router.push(app.localePath('/checkout/user-account'));
      }

      await load();
    });

    onMounted(async () => {
      const validStep = await isPreviousStepValid('billing');
      if (!validStep) {
        await router.push(app.localePath('/checkout/user-account'));
      }

      await load();
    });

    const processOrder = async () => {
      await make();
      setCart(null);
      $magento.config.state.setCartId();
      await load();
      await removeItem('checkout');
      // await router.push(`${app.localePath(`/checkout/thank-you?order=${order.value.order_number}`)}`);
      router.push(`${app.localePath(`/checkout/thank-you?`)}`)
    };

    const discounts = computed(() => cartGetters.getDiscounts(cart.value));
    const hasDiscounts = computed(() => discounts.value.length > 0);
    const discountsAmount = computed(() => -1 * discounts.value.reduce((a, el) => el.value + a, 0));

    const { getMagentoImage, imageSizes } = useImage();

    return {
      cart,
      cartGetters,
      discounts,
      hasDiscounts,
      discountsAmount,
      getShippingMethodPrice,
      isPaymentReady,
      loading,
      processOrder,
      products: computed(() => cartGetters.getItems(cart.value)),
      selectedShippingMethod: computed(() => cartGetters.getSelectedShippingMethod(cart.value)),
      tableHeaders: ['Description','color','size', 'Quantity','Amount',],
      terms,
      totals: computed(() => cartGetters.getTotals(cart.value)),
      getAttributes,
      getBundles,
      getMagentoImage,
      imageSizes,
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}

.table {
  margin: 0 0 var(--spacer-base) 0;

  &__row {
    justify-content: space-between;
  }

  @include for-desktop {
    &__header {
      text-align: center;

      &:last-child {
        text-align: right;
      }
    }
    &__data {
      text-align: center;
    }
    &__description {
      text-align: left;
      flex: 0 0 12rem;
    }
    &__image {
      --image-width: 5.125rem;
      text-align: left;
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}
.detail-information {
  margin: 0 !important;
  font-size: var(--font-size--sm);
}
.product-sku {
  color: var(--c-text-muted);
  font-size: var(--font-size--sm);
}

.price {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.product-price {
  --price-font-size: var(--font-size--base);
}

.summary {
  &__terms {
    margin: var(--spacer-base) 0 0 var(--spacer-sm);
  }

  &__total {
    margin: 0 0 var(--spacer-sm) 0;
    flex: 0 0 16.875rem;
  }

  &__action {
    @include for-desktop {
      display: flex;
      margin: var(--spacer-xl) 0 0 0;
    }
  }

  &__action-button {
    margin: 0;
    width: 100%;
    margin: var(--spacer-sm) 0 0 0;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
      width: auto;
    }

    &--secondary {
      @include for-desktop {
        text-align: right;
      }
    }
  }

  &__back-button {
    margin: var(--spacer-xl) 0 0 0;
    width: 100%;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
      width: auto;
    }
    color: var(--c-white);

    &:hover {
      color: var(--c-white);
    }
  }

  &__property-total {
    margin: var(--spacer-xl) 0 var(--spacer-sm) 0;
  }
}

.property {
  margin: 0 0 var(--spacer-sm) 0;

  &__name {
    color: var(--c-text-muted);
  }
}

.accordion {
  margin: 0 0 var(--spacer-xl) 0;

  &__item {
    display: flex;
    align-items: flex-start;
  }

  &__content {
    flex: 1;
  }

  &__edit {
    flex: unset;
  }
}

.content {
  margin: 0 0 var(--spacer-xl) 0;
  color: var(--c-text);

  &:last-child {
    margin: 0;
  }

  &__label {
    font-weight: var(--font-weight--normal);
  }
}
.summary__action-button{
  background-color: blue;
}
</style>
