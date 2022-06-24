<template>
  <div>
    <transition name="sf-collapse-top" mode="out-in">
      <div class="notifications">
        <AwNotification
          v-if="!loading"
          class="is-active sf-sidebar"
          :visible="visible"
          title="Are you sure?"
          message="Are you sure you would like to remove this item from the shopping cart?"
          type="secondary"
        >
          <template #action>
            <div class="button-wrap">
              <AwButton
                class="sf-button_remove_item check"
                @click="
                  actionRemoveItem(tempProduct);
                  editTxtBox();
                "
              >
                Yes
              </AwButton>
              <div @click="visible = false">
                <AwButton @click="editTxtBox()"> Cancel </AwButton>
              </div>
            </div>
          </template>
          <div />
        </AwNotification>
      </div>
    </transition>
    <transition name="sf-collapse-top" mode="out-in">
      <div class="msg notifications" v-if="msg">
        <h2 style="color: black; font: size 1.5rem">Enter your Message</h2>
        <textarea :cols="69" :rows="7" wrap="soft"> </textarea>
        <div />
        <template>
          <div class="button-wrap">
            <AwButton class="sf-button check"> Submit </AwButton>
            <div @click="msg = false">
              <AwButton @click="editTxtBox()"> Cancel </AwButton>
            </div>
          </div>
        </template>
      </div>
    </transition>
    <div id="cart">
      <AwLoader :loading="loading">
        <transition name="sf-fade" mode="out-in">
          <div v-if="totalItems" key="my-cart" class="my-cart cart-page">
            <div>
              <a href="" @click="clear()">
                <AwButton
                  v-e2e="'go-to-checkout-btn'"
                  class="sf-button check clear"
                >
                  {{ $t("Clear Cart") }}
                </AwButton></a
              >
            </div>
            <div class="collected-product-list" :key="cart.length">
              <transition-group name="sf-fade" tag="div">
                <div
                  v-for="product in products"
                  :key="cartGetters.getItemSku(product)"
                >
                  <AwCollectedProduct
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
                        `/p/${cartGetters.getItemSku(
                          product
                        )}${cartGetters.getSlug(product)}`
                      )
                    "
                    class="collected-product"
                    @input="delayedUpdateItemQty({ product, quantity: $event })"
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
                          @input="
                            delayedUpdateItemQty({ product, quantity: $event })
                          "
                        />
                      </div>

                      <AwBadge v-else class="color-danger sf-badge__absolute">
                        <template #default>
                          <span>{{ $t("Out of stock") }}</span>
                        </template>
                      </AwBadge>
                    </template>
                    <template>
                      <div>
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
                      </div>
                    </template>
                  </AwCollectedProduct>
                  <div class="extra">
                    <!-- <a href="#" @click="getModSlug(cartGetters.getItemSku(product),cartGetters.getSlug(product)) "><u>Edit</u></a> -->
                    <a
                      href="#"
                      @click="
                        sendToRemove({ product });
                        editTextBox();
                      "
                      style="float: right"
                      ><u>Remove from cart</u></a
                    ><br />

                    <div>
                      <p>
                        Usually arrives in 5-13 business days. A shipping
                        timeline specific to your destinttion can be viewed in
                        Checkout.
                      </p>
                    </div>
                  </div>
                </div>
              </transition-group>
            </div>
          </div>
          <div v-else key="empty-cart" class="empty-cart">
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

      <template>
        <div>
          <div class="highlighted">
            <AwHeading
              :level="3"
              :title="$t('Total')"
              class="sf-heading--left sf-heading--no-underline title"
            />
          </div>
          <div class="highlighted">
            <AwProperty
              :name="$t('Products')"
              :value="totalItems"
              class="sf-property--full-width sf-property--large property"
            />
            <AwProperty
              :name="$t('Subtotal')"
              :value="$fc(totals.subtotal)"
              :class="[
                'sf-property--full-width',
                'sf-property--large property',
              ]"
            />

            <AwProperty
              :name="$t('Shipping')"
              :value="$t('free')"
              class="sf-property--full-width sf-property--large property"
            />

            <AwProperty
              :name="$t('Total')"
              :value="$fc(totals.total)"
              class="sf-property--full-width sf-property--large property-total"
            />
          </div>
          <div class="highlighted">
            <a @click="goToCheckout">
              <AwButton
                v-e2e="'go-to-checkout-btn'"
                class="sf-button--full-width check"
              >
                {{ $t("Go to checkout") }}
              </AwButton>
            </a>
            <AwButton
              class="sf-button--full-width color-secondary"
              @click="goToShopping"
            >
              {{ $t("Go back shopping") }}
            </AwButton>
            <a
              href="#"
              style="margin-left: 77px"
              @click="
                sendToMsg();
                editTextBox();
              "
            >
              <u>Add message or gift wrap</u></a
            >
            <div class="mail">
              <SvgImage
                icon="mail "
                :label="$t('Mail')"
                width="20"
                height="20"
                class="mail__image"
              />
              <a href="#"> <u>send my basket to email</u></a>
            </div>
            <div class="list">
              <p>Helpful information:</p>
              <ul>
                <li>Questions? Chat with us or call 1.888.282.6060.</li>
                <li>
                  Shipping internationally? Choose your destination and
                  currency.
                </li>
                <li>Shipping methods and charges.</li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import AwLoader from "@storefront-ui/root/packages/vue/src/components/atoms/AwLoader/AwLoader.vue";
import AwNotification from "@storefront-ui/root/packages/vue/src/components/molecules/AwNotification/AwNotification.vue";
import AwSidebar from "@storefront-ui/root/packages/vue/src/components/organisms/AwSidebar/AwSidebar.vue";
import AwHeading from "@storefront-ui/root/packages/vue/src/components/atoms/AwHeading/AwHeading.vue";
import AwButton from "@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import AwProperty from "@storefront-ui/root/packages/vue/src/components/atoms/AwProperty/AwProperty.vue";
import AwPrice from "@storefront-ui/root/packages/vue/src/components/atoms/AwPrice/AwPrice.vue";
import AwCollectedProduct from "@storefront-ui/root/packages/vue/src/components/organisms/AwCollectedProduct/AwCollectedProduct.vue";
import AwQuantitySelector from "@storefront-ui/root/packages/vue/src/components/atoms/AwQuantitySelector/AwQuantitySelector.vue";
import AwBadge from "@storefront-ui/root/packages/vue/src/components/atoms/AwBadge/AwBadge.vue";
import AwIcon from "@storefront-ui/root/packages/vue/src/components/atoms/AwIcon/AwIcon.vue";
import AwCharacteristic from "@storefront-ui/root/packages/vue/src/components/molecules/AwCharacteristic/AwCharacteristic.vue";
import {
  computed,
  defineComponent,
  ref,
  useRouter,
  useContext,
  onMounted,
} from "@nuxtjs/composition-api";
import {
  useCart,
  useUser,
  cartGetters,
  useExternalCheckout,
} from "@vue-storefront/magento";
import _debounce from "lodash.debounce";
import getShippingMethodPrice from "~/helpers/checkout/getShippingMethodPrice";

import { useUiState, useUiNotification } from "~/composables";
import stockStatusEnum from "~/enums/stockStatusEnum";
// import CouponCode from './CouponCode.vue';
import SvgImage from "~/components/General/SvgImage.vue";

export default defineComponent({
  name: "CartSidebar",
  components: {
    AwCharacteristic,
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
    SvgImage,
  },
  setup() {
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
    const msg = ref(false);
    // const bgpopup=ref(false);
    const selectedShippingMethod = computed(() =>
      cartGetters.getSelectedShippingMethod(cart.value)
    );

    const products = computed(() =>
      cartGetters
        .getItems(cart.value)
        .filter(Boolean)
        .map((item) => ({
          ...item,
          product: { ...item.product, ...item.configured_variant },
        }))
    );
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const getAttributes = (product) => product.configurable_options || [];
    const getBundles = (product) =>
      product.bundle_options?.map((b) => b.values).flat() || [];
    const visible = ref(false);
    const tempProduct = ref();

    const getModSlug = (sku, slug) => {
      console.log(sku);
      console.log(slug);
      console.log(sku.match(/-/g).length);
      if (sku.match(/-/g).length > 1) {
        const index = sku.indexOf("-");
        const newSku = sku.slice(0, index);

        router.push(`${app.localePath(`/p/${newSku}${slug}`)}`);
      } else {
        router.push(`${app.localePath(`/p/${sku}${slug}`)}`);
      }
    };

    onMounted(() => {
      if (cart.value === null) {
        loadCart();
      }
    });

    const clear = async() => {
      visible.value = true;
     await products.value.forEach(async(item) => {
      await  actionRemoveItem(item);
      });
       products.value=[];
      console.log(products.value.length)
    };

    const goToCheckout = async () => {
      const redirectUrl = await initializeCheckout({
        baseUrl: "/checkout/user-account",
      });
      await router.push(`${app.localePath(redirectUrl)}`);
    };
    const goToShopping = async () => {
      const redirectUrl = await initializeCheckout({ baseUrl: "/home" });
      await router.push(`${app.localePath(redirectUrl)}`);
    };
    const sendToRemove = ({ product }) => {
      if (notifications.value.length > 0) {
        notifications.value[0].dismiss();
      }

      visible.value = true;
      tempProduct.value = product;
    };

    const sendToMsg = () => {
      msg.value = true;
    };
    const editTextBox = () => {
      console.log("adding class");
      document.body.classList.add("bg-popup");
    };
    const editTxtBox = () => {
      document.body.classList.remove("bg-popup");
    };

    const actionRemoveItem = async (product) => {
      await removeItem({ product });
      visible.value = false;

      sendNotification({
        id: Symbol("product_removed"),
        message: `${cartGetters.getItemName(
          product
        )} has been successfully removed from your cart.`,
        type: "success",
        icon: "check",
        persist: false,
        title: "Product removed",
        required: true,
      });
    };
    const delayedUpdateItemQty = _debounce(
      (params) => updateItemQty(params),
      1000
    );
    const isInStock = (product) =>
      cartGetters.getStockStatus(product) === stockStatusEnum.inStock;

    return {
      sendToRemove,
      clear,
      actionRemoveItem,
      loading,
      isAuthenticated,
      products,
      removeItem,
      delayedUpdateItemQty,
      isCartSidebarOpen,
      notifications,
      visible,
      msg,
      cart,
      editTextBox,
      editTxtBox,
      // bgpopup,
      sendToMsg,
      tempProduct,
      toggleCartSidebar,
      goToCheckout,
      goToShopping,
      totals,
      totalItems,
      selectedShippingMethod,
      getShippingMethodPrice,
      cartGetters,
      getAttributes,
      getBundles,
      isInStock,
      getModSlug,
    };
  },
});
</script>

<style lang="scss" scoped>
.highlighted {
  box-sizing: border-box;
  width: 452px;
  background-color: var(--c-light);
  padding: 26px;

  &:last-child {
    padding-bottom: var(--spacer-xl);
  }
}
.mail {
  // text-align: center;
  margin-left: 65px;
  margin-top: 20px;
  padding: 0.5rem;
  height: 18px;
  display: flex;
}
.total-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacer-xl);
}
.list {
  width: 400px;
  height: 146px;
  font-weight: 70;
  // padding: 1em;
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
.extra {
  margin-left: 400px;
  margin-top: -200px;
  width: 300px;
  float: left;
}
.sf-collected-product__quantity-selector
  .sf-collected-product__quantity-wrapper {
  height: 50px;
  width: 108px;
}

#cart {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  display: flex;
  &.notifictions {
    opacity: 0.6;
    background-color: white;
  }
}

p {
  width: 366px;
  height: 40px;
  margin-top: 65px;
  font-weight: 300, light;
}

.close-icon {
  position: fixed;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.notifications {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  overflow: hidden;
  .sf-notification {
    padding: 20px;
    .button-wrap {
      margin-top: 15px;
      display: flex;
      column-gap: 15px;
    }
  }
}
.msg {
  background-color: #3c3c3c;
  width: 600px;
  padding: 1rem;
  border-radius: 1rem;
  .button-wrap {
    margin-top: 15px;
    display: flex;
    column-gap: 15px;
  }
}

.check {
  background-color: #037ee6;
  margin: 0 0 20px 0;
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
.empty-cart__image {
  color: #037ee6;
  margin-left: -120px;
  background-color: blue;
}

.empty-cart {
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-color: #037ee6;
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

.collected-product-list {
  // display: flex;
  width: 700px;
  flex: 1;
}

.collected-product {
  margin: 0 0 var(--spacer-sm) 0;
  width: 700px;
  height: 203px;

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
    --cp-save-opacity: 0;
    --cp-compare-opacity: 0;
  }
  .sf-badge__absolute {
    position: absolute;
    left: 0;
  }
}
.sf-property {
  height: 26px;
}
.sf-collected-product:not(.nohover):hover {
  --collected-product-actions-display: flex;
  --collected-product-z-index: 1;
  --collected-product-remove-opacity: 1;
  --collected-product-configuration-display: flex;
}

.sf-collected-product {
  pointer-events: unset;
  .sf-button::before {
    content: unset !important;
  }
  &:hover {
    box-shadow: unset !important;
  }
}
</style>
