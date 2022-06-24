<template>
  <AwTabs :open-tab="1">
    <AwTab data-cy="order-history-tab_my-orders" title="My orders">
      <div v-if="loading">
        <AwLoader />
      </div>
      <div v-else-if="currentOrder">
        <transition-group tag="div" name="fade" class="addresses-list">
          <div class="addresses" key="addesses">
            <h3>Order Details</h3>
            <h3></h3>
            <AwProperty
              :value="orderGetters.getId(currentOrder)"
              
              class="pricefont"
            />
            <AwLink href="">
              <AwAlert
                message="Order was send and received."
                type="info"
                class="info"
              />
            </AwLink>

            <p class="shippinga">Shipping Address</p>
            <p class="billinga">Billing Address</p>

            <div class="shippinga">
              <UserAddressDetails :address="getCurrentAddress" />
            </div>

            <div class="billingaddress">
              <UserAddressDetails :address="getDefaultBillingAddress" />
            </div>

            <div>
              <p class="shippinga">Shipping Details</p>
              <p class="billinga">Billing Details</p>
            </div>

            <div class="shippingdetails" >
              <!-- <UserAddressDetails :address="getCurrentAddress" /> -->
              <p style="margin-top: 20px">
                Demo !!!!!!!!!
                <!-- Zielinskiego 30 – 41, 53-345 <br />
                Wroclaw, Poland -->
              </p>
            </div>
            <div class="billingingdetails">
              <p style="margin-top: -20px">Demo !!!!!!!!!</p>
            </div>
            <div class="orderitems">
              <p style="margin-top: -20px">Ordered Items</p>
            </div>
          </div>
        </transition-group>

        <AwTable class="products">
          <!-- <AwTableData class="table__image">
                <nuxt-img
                  :src="getMagentoImage(orderGetters.getItemImage(item))"
                  :alt="orderGetters.getItemName(item)"
                  
                />
              </AwTableData>
             -->
            
          <AwTableHeading>
            <AwTableHeader class="oitem">
              {{ $t("Item") }}
            </AwTableHeader>
            <AwTableHeader class="odescription">
              {{ $t("Description") }}
            </AwTableHeader>
            <AwTableHeader class="ocolor">
              {{ $t("Color") }}
            </AwTableHeader>
            <AwTableHeader class="osize">
              {{ $t("Size") }}
            </AwTableHeader>
            <AwTableHeader class="oquantity">{{ $t("Quantity") }}</AwTableHeader>
            <AwTableHeader class="oamount">{{ $t("Amount") }}</AwTableHeader>
          </AwTableHeading>
          <AwTableRow
            v-for="(item, i) in orderGetters.getItems(currentOrder)"
            :key="i"
            class="tabledata"
          >
            <!-- <p>{{item}}</p> -->
            <!-- <AwTableData>
              <div class="product-img">
                {{productGetters.getIma}}
              </div>
            </AwTableData> -->

            <AwTableData
              class="name table__data table__description table__data"
            >
              <div class="product-title descriptionfor">
               <label> {{ orderGetters.getItemName(item) }}</label>
               <br>
                <label class="product-sku">{{ orderGetters.getItemSku(item) }}</label>
              </div>
               
              <div class="colorfor">
                <label> !!!!!</label>
              </div>
            </AwTableData>
            <AwTableData class="sizefor">!!!!!</AwTableData>

            <AwTableData class="qtyfor">{{
              orderGetters.getItemQty(item)
            }}</AwTableData>

            <AwTableData class="pricefor">{{
              $n(orderGetters.getItemPrice(item), "currency")
            }}</AwTableData>
          </AwTableRow>
        </AwTable>

        <AwProperty
          name="Subtotal"
          :value="$n(orderGetters.getPrice(currentOrder), 'currency')"
          class="sf-property--full-width property subtotal"
        />
        <AwProperty
          name="Shipping"
          :value="'Free'"
          class="sf-property--full-width property shipping"
        />
        <AwProperty
          name="Total Price"
          :value="$n(orderGetters.getPrice(currentOrder), 'currency')"
          class="sf-property--full-width property total "
        />
        <div class="back-button" style="margin-top:100px;">
          <div>
            <AwButton
              data-cy="order-history-btn_orders"
              class="go-back"
              @click="currentOrder = null"
              >
              GO BACK
            </AwButton>
            
          </div>
          <div>
            <AwButton
              data-cy="order-history-btn_orders"
              class="reviews"
              @click="currentOrder = null"
            >
              ADD REVIEWS
            </AwButton>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="message">
          {{ $t("Details and status orders") }}
        </p>
        <div v-if="orders.length === 0" class="no-orders">
          <p class="no-orders__title">
            {{ $t("You currently have no orders") }}
          </p>
          <AwButton
            data-cy="order-history-btn_start"
            class="no-orders__button"
            @click="$router.push('/')"
          >
            {{ $t("Start shopping") }}
          </AwButton>
        </div>
        <AwTable v-else class="orders">
          <AwTableHeading>
            <AwTableHeader
              v-for="tableHeader in tableHeaders"
              :key="tableHeader"
            >
              {{ tableHeader }}
            </AwTableHeader>
            <AwTableHeader class="orders__element--right" />
          </AwTableHeading>
          <AwTableRow v-for="order in orders" :key="orderGetters.getId(order)">
            <AwTableData>{{ orderGetters.getId(order) }}</AwTableData>
            <AwTableData>{{ orderGetters.getDate(order) }}</AwTableData>
            <!-- <AwTableData>{{ }}</AwTableData> -->
            <AwTableData>{{
              $n(orderGetters.getPrice(order), "currency")
            }}</AwTableData>
            <AwTableData>
              <span :class="getStatusTextClass(order)">{{
                orderGetters.getStatus(order)
              }}</span>
            </AwTableData>
            <AwTableData class="orders__view orders__element--right">
              <AwButton
                data-cy="order-history-btn_download"
                class="sf-button--text smartphone-only"
                @click="downloadOrder(order)"
              >
                {{ $t("Download") }}
              </AwButton>
              <AwButton
                data-cy="order-history-btn_view"
                class="sf-button--text desktop-only"
                @click="currentOrder = order"
              >
                {{ $t("View details") }}
              </AwButton>
            </AwTableData>
          </AwTableRow>
        </AwTable>
        <LazyHydrate on-interaction>
          <AwPagination
            v-if="!loading"
            v-show="pagination.totalPages > 1"
            class="products__pagination desktop-only"
            :current="pagination.currentPage"
            :total="pagination.totalPages"
            :visible="5"
          />
        </LazyHydrate>

        <div v-show="pagination.totalPages > 1" class="products__show-on-page">
          <span class="products__show-on-page__label">{{
            $t("Show on page")
          }}</span>
          <LazyHydrate on-interaction>
            <AwSelect
              :value="pagination.itemsPerPage.toString()"
              class="products__items-per-page"
              @input="th.changeItemsPerPage"
            >
              <AwSelectOption
                v-for="option in pagination.pageOptions"
                :key="option"
                :value="option"
                class="products__items-per-page__option"
              >
                {{ option }}
              </AwSelectOption>
            </AwSelect>
          </LazyHydrate>
        </div>
      </div>
    </AwTab>
    <AwTab data-cy="order-history-tab_returns" title="Returns">
      <p class="message">
        This feature is not implemented yet! Please take a look at
        <br />
        <AwLink class="message__link" href="#">
          https://github.com/vuestorefront/magento2/projects/5
        </AwLink>
        for our Roadmap!
      </p>
    </AwTab>
  </AwTabs>
</template>

<script>
import AwLoader from "@storefront-ui/root/packages/vue/src/components/atoms/AwLoader/AwLoader.vue";
import AwTabs from "@storefront-ui/root/packages/vue/src/components/organisms/AwTabs/AwTabs.vue";
import AwButton from "@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import AwProperty from "@storefront-ui/root/packages/vue/src/components/atoms/AwProperty/AwProperty.vue";
import AwPagination from "@storefront-ui/root/packages/vue/src/components/molecules/AwPagination/AwPagination.vue";
import AwSelect from "@storefront-ui/root/packages/vue/src/components/molecules/AwSelect/AwSelect.vue";
import AwTable from "@storefront-ui/root/packages/vue/src/components/organisms/AwTable/AwTable.vue";
import AwLink from "@storefront-ui/root/packages/vue/src/components/atoms/AwLink/AwLink.vue"
import AwHeading from "@storefront-ui/root/packages/vue/src/components/atoms/AwHeading/AwHeading.vue";
import UserAddressDetails from "~/components/UserAddressDetails.vue";
import AwAlert from "@storefront-ui/root/packages/vue/src/components/molecules/AwAlert/AwAlert.vue";

import {
  computed,
  defineComponent,
  ref,
  useRoute,
} from "@nuxtjs/composition-api";
import {
  useUserOrder,
  orderGetters,
  cartGetters,
  useMakeOrder,
  useCart,
  userAddressesGetters,
  useAddresses,
} from "@vue-storefront/magento";
import { AgnosticOrderStatus, onSSR } from "@vue-storefront/core";
import LazyHydrate from "vue-lazy-hydration";
import { useUiHelpers, useImage } from "~/composables";
import AwTableData from "@storefront-ui/root/packages/vue/src/components/organisms/AwTable/_internal/AwTableData.vue";

export default defineComponent({
  name: "PersonalDetails",
  components: {
    LazyHydrate,
    AwButton,
    AwLink,
    AwHeading,
    AwPagination,
    AwProperty,
    AwSelect,
    AwTable,
    AwTabs,
    AwLoader,
    UserAddressDetails,
    AwTableData,
    AwAlert,
  },
  setup() {
    const { addresses } = useAddresses();
    const userAddresses = computed(() =>
      userAddressesGetters.getAddresses(addresses.value)
    );

    const { orders, search, loading } = useUserOrder();
    const { cart, setCart } = useCart();
    const currentOrder = ref(null);
    const th = useUiHelpers();
    const route = useRoute();
    const {
      query: { page, itemsPerPage },
    } = route.value;
    const getAttributes = (product) => product.configurable_options || [];

    onSSR(async () => {
      await search({
        currentPage: Number.parseInt(page, 10) || 1,
        pageSize: Number.parseInt(itemsPerPage, 10) || 10,
      });
    });

    const tableHeaders = [
      "Order ID",
      "Payment date",
      "Payment Method",
      "Amount",
      "Status",
      "Download All"
    ];

    const getStatusTextClass = (order) => {
      const status = orderGetters.getStatus(order);
      switch (status) {
        case AgnosticOrderStatus.Open:
          return "text-warning";
        case AgnosticOrderStatus.Complete:
          return "text-success";
        default:
          return "";
      }
    };
    const hasSavedShippingAddress = computed(() => {
      if (!isAuthenticated.value || !userShipping.value) {
        return false;
      }
      const addresses = userShippingGetters.getAddresses(userShipping.value);
      return Boolean(addresses?.length);
    });
    const getCurrentAddress = computed(() => {
      console.log(userAddresses.value);
      console.log(orderGetters.getId(currentOrder.value));
      const obj = userAddresses.value.find(
        (data) => data.default_shipping === true
      );
      console.log(obj);
      return obj;
    });
    const getDefaultBillingAddress = computed(() => {
      console.log(userAddresses.value);
      console.log(orderGetters.getId(currentOrder.value));
      const obj = userAddresses.value.find(
        (data) => data.default_billing === true
      );
      console.log(obj);
      return obj;
    });
    const pagination = computed(() => orderGetters.getPagination(orders.value));
    const { getMagentoImage, imageSizes } = useImage();
    return {
      currentOrder,
      getStatusTextClass,
      loading,
      userAddressesGetters,
      userAddresses,
      orderGetters,
      cart,
      cartGetters,
      getAttributes,
      getMagentoImage,
      getCurrentAddress,
      getDefaultBillingAddress,
      imageSizes,
      products: computed(() => cartGetters.getItems(cart.value)),
      orders: computed(() => orderGetters.getItems(orders.value)),
      pagination,
      th,
      tableHeaders,
    };
  },
});
</script>

<style lang='scss' scoped>
.no-orders {
  &__title {
    margin: 0 0 var(--spacer-lg) 0;
    font: var(--font-weight--normal) var(--font-size--base) / 1.6
      var(--font-family--primary);
  }
  &__button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: 17, 5rem;
    }
  }
}
.orders {
  @include for-desktop {
    &__element {
      &--right {
        --table-column-flex: 0;
        text-align: right;
      }
    }
  }
}
.all-orders {
  --button-padding: var(--spacer-base) 0;
}
.message {
  margin: 0 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--primary);
  &__link {
    color: var(--c-primary);
    font-weight: var(--font-weight--medium);
    font-family: var(--font-family--primary);
    font-size: var(--font-size--base);
    text-decoration: none;
    &:hover {
      color: var(--c-text);
    }
  }
}
.product {
  &__properties {
    margin: var(--spacer-xl) 0 0 0;
  }
  &__property,
  &__action {
    font-size: var(--font-size--sm);
  }
  &__action {
    color: var(--c-gray-variant);
    font-size: var(--font-size--sm);
    margin: 0 0 var(--spacer-sm) 0;
    &:last-child {
      margin: 0;
    }
  }
  &__qty {
    color: var(--c-text);
  }
}
.products {
  --table-column-flex: 1;
  &__name {
    margin-right: var(--spacer-sm);
    @include for-desktop {
      --table-column-flex: 2;
    }
  }
}
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-sm);
  --property-value-font-size: var(--font-size--base);
  --property-name-font-size: var(--font-size--base);
  &:last-child {
    margin-bottom: 0;
  }
  ::v-deep .sf-property__name {
    white-space: nowrap;
  }
  ::v-deep .sf-property__value {
    text-align: right;
  }
  &--total {
    margin-bottom: var(--spacer-sm);
  }
  @include for-desktop {
    padding: var(--spacer-xl);
    --property-name-font-size: var(--font-size--lg);
    --property-name-font-weight: var(--font-weight--medium);
    --property-value-font-size: var(--font-size--lg);
    --property-value-font-weight: var(--font-weight--semibold);
  }
}

.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0;

  @include for-desktop {
    &__pagination {
      display: flex;
      justify-content: flex-start;
      margin: var(--spacer-xl) 0 0 0;
    }
  }

  &__show-on-page {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;

    &__label {
      font-family: var(--font-family--secondary);
      font-size: var(--font-size--sm);
    }
  }
}
.subtotal {
  margin-top: 30px;

}

.back-button{
display: flex;
justify-content: space-between;
margin-top: 30px;

}
.shipping{
margin-top: 30px;
padding-bottom: 20px;
border-bottom: 2px solid #037EE6;
}

.go-back{
width: 280px;
height: 50px;
}
.reviews{
width: 280px;
height: 50px;
margin-right: 150px;
background-color: #282828
}

.total{
  font-weight: 700,bold;
  font-size: 20px;
  line-height: 26px;
  margin-top: 30px;
}
.product-sku{
  margin-left: 30px;
}

</style>