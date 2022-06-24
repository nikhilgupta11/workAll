<template>
  <div id="cart">
   <!--  <p>{{products.length}}</p>
    <p v-if="cart.items && cart.items.length">{{cart.items.length}}</p>
    <p v-if="cart.items">{{cart.items}}</p> -->
    
    <AwSidebar
      v-e2e="'sidebar-cart'"
      :visible="isCartSidebarOpen"
      :title="$t('My Cart')"
      class="sf-sidebar--right"
      @close="toggleCartSidebar"
    >
      <template #circle-icon="{ close }">
        <div
          class="close-icon"
          @click="close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L17 17"
              stroke="#171717"
              stroke-width="2"
            />
            <path
              d="M17 1L1 17"
              stroke="#171717"
              stroke-width="2"
            />
          </svg>
        </div>
      </template>
      <transition
        name="sf-collapse-top"
        mode="out-in"
      >
        <div class="notifications">
          <AwNotification
            v-if="!loading"
            :visible="visible"
            title="Are you sure?"
            message="Are you sure you would like to remove this item from the shopping cart?"
            type="secondary"
          >
            <template #action>
              <div class="button-wrap">
                <AwButton
                  class="sf-button_remove_item"
                  @click="actionRemoveItem(tempProduct)"
                >
                  Yes
                </AwButton>
                <AwButton @click="visible = false">
                  Cancel
                </AwButton>
              </div>
            </template>
            <template #close>
              <div />
            </template>
          </AwNotification>
        </div>
      
      </transition>
      <template #content-top>
        <AwProperty
         
          class="sf-property--large cart-summary"
          :name="$t('Total items')"
          :value="totalItems"
        />
      </template>
      <AwLoader :loading="loading">
        <transition
          name="sf-fade"
          mode="out-in"
        >
          <div
            v-if="totalItems"
            key="my-cart"
            class="my-cart"
          >
            <div class="collected-product-list" :key="testCart">
              <transition-group
                name="sf-fade"
                tag="div"
                
              >
                <AwCollectedProduct
                  v-for="product in products"
                  :key="cartGetters.getItemSku(product)"
                  :image="cartGetters.getItemImage(product)"
                  :title="cartGetters.getItemName(product)"
                  :regular-price="
                    $fc(cartGetters.getItemPrice(product).regular)
                  "
                  :special-price="
                    cartGetters.productHasSpecialPrice(product)
                      ? getItemPrice(product).special &&
                        $fc(cartGetters.getItemPrice(product).special)
                      : ''
                  "
                  :link="
                    localePath(
                      `/p/${cartGetters.getItemSku(product)}${cartGetters.getSlug(
                        product
                      )}`
                    )
                  "
                  class="collected-product"
                  @input="delayedUpdateItemQty({ product, quantity: $event })"
                  @click:remove="sendToRemove({ product })"
                >
                  <template #input>
                    <div
                      v-if="isInStock(product)"
                      class="sf-collected-product__quantity-wrapper"
                    >
                      <AwQuantitySelector
                        :disabled="loading"
                        :qty="cartGetters.getItemQty(product)"
                        class="sf-collected-product__quantity-selector"
                        @input="delayedUpdateItemQty({ product, quantity: $event })"
                      />
                    </div>
                    <AwBadge
                      v-else
                      class="color-danger sf-badge__absolute"
                    >
                      <template #default>
                        <span>{{ $t('Out of stock') }}</span>
                      </template>
                    </AwBadge>
                  </template>
                  <template #configuration>
                    <div v-if="getAttributes(product).length > 0">
                      <AwProperty
                        v-for="(attr, index) in getAttributes(product)"
                        :key="index"
                        :name="attr.option_label"
                        :value="attr.value_label"
                      />
                    </div>
                    <div v-if="getBundles(product).length > 0">
                      <AwProperty
                        v-for="(bundle, i) in getBundles(product)"
                        :key="i"
                        :name="`${bundle.quantity}x`"
                        :value="bundle.label"
                      />
                    </div>
                    <div v-else />
                  </template>
                </AwCollectedProduct>
              </transition-group>
            </div>
          </div>
          <div
            v-else
            key="empty-cart"
            class="empty-cart"
          >
            <div class="empty-cart__banner">
              <nuxt-img
            src="/icons/cart.png"
            class="before-results__picture"
            alt="cart"
            width="250"
            height="180" 
          />
              <AwHeading
                title="Your cart is empty"
                :level="2"
                class="empty-cart__heading"
                :description="
                  $t(
                    'Looks like you haven’t added any items to the bag yet. Start shopping to fill it in.'
                  )
                "
              />
            </div>
          </div>
        </transition>
      </AwLoader>
      <template #content-bottom>
        <transition name="sf-fade">
          <div >
            <div v-if="totalItems">
            <AwProperty
              :name="$t('Total price')"
              class="
                sf-property sf-property--large
                my-cart__total-price
              "
            >
              <template #value>
                <div class="view">
                <AwPrice
                  :regular="$fc(totals.subtotal)"
                  :special="
                    totals.subtotal <= totals.special
                      ? ''
                      : $fc(totals.special)
                  "
                />
            
            <a @click="view">
              <AwButton
                class="view-cart sf-button--text"
                @click="toggleCartSidebar"
              >
                {{ $t('View cart') }}
              
              </AwButton></a>
                </div>
              </template>
            </AwProperty> 
            </div>
          
            <div v-if="totalItems"> 
              <a href=""  @click="clear(products)" class="clear">Clear Cart</a>
            </div>
            
            <div v-if="totalItems">
            
            <a @click="goToCheckout">
              <AwButton
                v-e2e="'go-to-checkout-btn'"
                class="sf-button--full-width check"
                @click="toggleCartSidebar"
              >
                {{ $t('Go to checkout') }}
              </AwButton>
            </a>
          </div>
          <div v-else>
            <AwButton
              class="sf-button--full-width color-secondary"
              @click="toggleCartSidebar"
            >
              {{ $t('Go back shopping') }}
            </AwButton>
          </div>
          </div>
        </transition>
      </template>
    </AwSidebar>
  </div>
</template>
<script>
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import AwLoader from '@storefront-ui/root/packages/vue/src/components/atoms/AwLoader/AwLoader.vue';
import AwNotification from '@storefront-ui/root/packages/vue/src/components/molecules/AwNotification/AwNotification.vue';
import AwSidebar from '@storefront-ui/root/packages/vue/src/components/organisms/AwSidebar/AwSidebar.vue';
import AwHeading from '@storefront-ui/root/packages/vue/src/components/atoms/AwHeading/AwHeading.vue';
import AwButton from '@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue';
import AwProperty from '@storefront-ui/root/packages/vue/src/components/atoms/AwProperty/AwProperty.vue';
import AwPrice from '@storefront-ui/root/packages/vue/src/components/atoms/AwPrice/AwPrice.vue';
import AwCollectedProduct from '@storefront-ui/root/packages/vue/src/components/organisms/AwCollectedProduct/AwCollectedProduct.vue';
import AwQuantitySelector from '@storefront-ui/root/packages/vue/src/components/atoms/AwQuantitySelector/AwQuantitySelector.vue';
import AwBadge from '@storefront-ui/root/packages/vue/src/components/atoms/AwBadge/AwBadge.vue';
import AwIcon from '@storefront-ui/root/packages/vue/src/components/atoms/AwIcon/AwIcon.vue';
import {
  computed,
  defineComponent,
  ref,
  useRouter,
  useContext, onMounted,
} from '@nuxtjs/composition-api';
import {
  useCart,
  useUser,
  cartGetters,
  useExternalCheckout,
} from '@vue-storefront/magento';
import _debounce from 'lodash.debounce';
import { useUiState, useUiNotification } from '~/composables';
import stockStatusEnum from '~/enums/stockStatusEnum';
import CouponCode from './CouponCode.vue';
import SvgImage from '~/components/General/SvgImage.vue';

export default defineComponent({
  name: 'CartSidebar',
  components: {
    AwIcon,
    AwLoader,
    AwNotification,
    AwSidebar,
    AwButton,
    AwHeading,
    AwProperty,
    AwPrice,
    AwCollectedProduct,
    AwQuantitySelector,
    AwBadge,
    CouponCode,
    SvgImage,
  },
  setup() {
    const testCart = ref(false)
    const { initializeCheckout } = useExternalCheckout();
    const { isCartSidebarOpen, toggleCartSidebar } = useUiState();
    const router = useRouter();
    const { app } = useContext();
    const {
      cart,
      removeItem,
      updateItemQty,
      load: loadCart,
      loading,
    } = useCart();

    const { isAuthenticated } = useUser();
    const { send: sendNotification, notifications } = useUiNotification();

    const products = computed(() => cartGetters
      .getItems(cart.value)
      .filter(Boolean)
      .map((item) => ({ ...item, product: { ...item.product, ...item.configured_variant } })));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const getAttributes = (product) => product.configurable_options || [];
    const getBundles = (product) => product.bundle_options?.map((b) => b.values).flat() || [];
    const visible = ref(false);
    const tempProduct = ref();

    onMounted(() => {
      if (cart.value === null) {
        loadCart();
      }
    });
   
   const clear = async (prod) => {
     products.value=[];
     prod.forEach(async(item, index) => {
          console.log(index)
         await actionRemoveItem(item);
         
      })

      testCart.value = !testCart.value;
      
      // const redirectUl = await initializeCheckout({ baseUrl: '/checkout/user-account' });
      // await router.push(`${app.localePath(redirectUl)}`);
      // console.log(products.value.length)
      // console.log('redirect ')
   }
    
    const goToCheckout = async () => {
      const redirectUrl = await initializeCheckout({ baseUrl: '/checkout/user-account' });
      await router.push(`${app.localePath(redirectUrl)}`);
    };
    const view = async () => {
      const redirectUrl = await initializeCheckout({ baseUrl: '/default/cart' });
      await router.push(`${app.localePath(redirectUrl)}`);
    };


    const sendToRemove = ({ product }) => {
      if (notifications.value.length > 0) {
        notifications.value[0].dismiss();
      }

      visible.value = true;
      tempProduct.value = product;
    };

    const actionRemoveItem = async (product) => {
      await removeItem({ product });
      visible.value = false;

      sendNotification({
        id: Symbol('product_removed'),
        message: `${cartGetters.getItemName(
          product,
        )} has been successfully removed from your cart.`,
        type: 'success',
        icon: 'check',
        persist: false,
        title: 'Product removed',
      });
    };
    const delayedUpdateItemQty = _debounce((params) => updateItemQty(params), 1000);
    const isInStock = (product) => cartGetters.getStockStatus(product) === stockStatusEnum.inStock;

    return {
      sendToRemove,
      actionRemoveItem,
      loading,
      isAuthenticated,
      products,
      removeItem,
      delayedUpdateItemQty,
      isCartSidebarOpen,
      notifications,
      visible,
      tempProduct,
      toggleCartSidebar,
      goToCheckout,
      view,
      totals,
      cart,
      clear,
      totalItems,
      cartGetters,
      getAttributes,
      getBundles,
      isInStock,
      testCart
    };
  },
});
</script>

<style lang="scss" scoped>
#cart {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  @include for-desktop {
    & > * {
      --sidebar-bottom-padding: var(--spacer-base);
      --sidebar-content-padding: var(--spacer-base);
    }
  }
}
@include for-mobile {
  .close-icon {
    display: none;
  }
}

.close-icon {
  position: fixed;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.notifications {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
  .sf-notification {
    padding: 20px;
    .button-wrap {
      margin-top: 15px;
      display: flex;
      column-gap: 15px;
    }
  }
}
.check{
  background-color: #037EE6;
}
.cart-summary {
  margin-top: var(--spacer-xl);
}

.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__total-items {
    margin: 0;
  }

  &__total-price {
    --price-font-size: var(--font-size--xl);
    --price-font-weight: var(--font-weight--medium);
    margin: 0 0 var(--spacer-base) 0;
  }
}
.empty-cart__image{
 color: #037EE6;
 margin-left: -120px;
//  background-color: blue;
}

.empty-cart {
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-color: #037EE6;
  --heading-title-font-weight: 600, semibold;
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  height: 100%;

  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  &__heading {
    padding: 1rem;
    width: 397px;
  }

  &__image {
    --image-width: 16rem;
    margin: 0 0 var(--spacer-2xl) 7.5rem;
  }

  @include for-desktop {
    --heading-title-font-size: var(--font-size--xl);
    --heading-title-margin: 0 0 var(--spacer-sm) 0;
  }
}
.view-cart{
  color: #037EE6;
  background-color: white;
  // float: right;
  margin-left: 99px;
  padding: 0;
  margin-top: 5px;
}

.collected-product-list {
  flex: 1;
}

.collected-product {
  margin: 0 0 var(--spacer-sm) 0;

  &__properties {
    margin: var(--spacer-xs) 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 2;

    &:first-child {
      margin-bottom: 8px;
    }
  }

  &__actions {
    transition: opacity 150ms ease-in-out;
  }

  &__save,
  &__compare {
    --button-padding: 0;

    &:focus {
      --cp-save-opacity: 1;
      --cp-compare-opacity: 1;
    }
  }

  &__save {
    opacity: var(--cp-save-opacity, 0);
  }

  &__compare {
    opacity: var(--cp-compare-opacity, 0);
  }

  &:hover {
    --cp-save-opacity: 1;
    --cp-compare-opacity: 1;
    @include for-desktop {
      .collected-product__properties {
        display: none;
      }
    }
  }
  .sf-badge__absolute {
    position: absolute;
    left: 0;
  }
}
.sf-property{
  height: 26px;
}
.view{
  display: flex;
  
}
.para{
  margin-left:70px;
  font-weight:400;
  color: #037EE6;
}
</style>
