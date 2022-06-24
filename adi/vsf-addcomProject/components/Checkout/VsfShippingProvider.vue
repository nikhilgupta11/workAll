<template>
  <div class="shipping-provider">
    <AwHeading
      :level="3"
      :title="$t('Shipping method')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form">
      <AwLoader :loading="isLoading">
        <div v-if="errorUseGetShippingMethods.load">
          {{
            $t(
              "There was some error while trying to fetch shipping methods. We are sorry, please try with a different shipping details."
            )
          }}
        </div>
        <div v-else-if="errorShippingProvider.save">
          {{
            $t(
              "There was some error while trying to select this shipping method. We are sorry, please try with a different shipping method."
            )
          }}
        </div>
        <div v-else-if="shippingMethods && shippingMethods.length === 0">
          {{
            $t(
              "There are no shipping methods available for this country. We are sorry, please try with a different country."
            )
          }}
        </div>
      </AwLoader>

      <div class="info">
        <div class="dcc">
          <AwRadio
            class="sf-radio--transparent"
            name="Shipping"
            value="store"
            label="Pickup in the store"
            details="Delivery from 4-6 business days"
            description=""
            :disabled="false"
            selected=""
            :required="false"
          />
       
          <button
            class="accordion"
            :class="{ active: showCategoryA }"
            :aria-disabled="false"
            :link="null"
            @click="showCategoryA = !showCategoryA"
            type="link"
          >
            info
          </button>
          
          <!-- <span
                
                  ><button
                    class="accordion"
                    :class="{ active: showCategoryA }"
                    @click="showCategoryA = !showCategoryA"
                  >
                    info
                  </button>
                </span> -->
          <ul class="category-list" v-show="showCategoryA">
            <li>
              <p>
                A paragraph is a series of related sentences developing a
                central idea, called the topic. Try to think about paragraphs in
                terms of thematic unity: a paragraph is a sentence or a group of
                sentences that supports one central, unified idea. Paragraphs
                add one idea at a time to your broader argument.
              </p>
            </li>
          </ul>
        </div>

        <AwRadio
          class="sf-radio--transparent"
          name="Shipping"
          value="store"
          label="Delivery at home "
          details="Delivery within 24 hours"
          description=""
          :disabled="false"
          selected=""
          :required="false"
        />
        <div>
          <button
            class="accordion"
            :class="{ active: showCategoryB }"
            :aria-disabled="false"
            :link="null"
            @click="showCategoryB = !showCategoryB"
            type="link"
          >
            info
          </button>
          <ul class="category-list" v-show="showCategoryB">
               <p>
                A paragraph is a series of related sentences developing a
                central idea, called the topic. Try to think about paragraphs in
                terms of thematic unity: a paragraph is a sentence or a group of
                sentences that supports one central, unified idea. Paragraphs
                add one idea at a time to your broader argument.
              </p>
          </ul>
        </div>
        <AwRadio
          class="sf-radio--transparent"
          name="Shipping"
          value="store"
          label="Paczkomaty InPost"
          details="Novelty ! from now ."
          description=""
          :disabled="false"
          selected=""
          :required="false"
        />

          <button
            class="accordion"
            :class="{ active: showCategoryC }"
            :aria-disabled="false"
            :link="null"
            @click="showCategoryC = !showCategoryC"
            type="link"
          >
            info
          </button>
        <ul class="category-list" v-show="showCategoryC">
          <p>
            A paragraph is a series of related sentences developing a central
            idea, called the topic. Try to think about paragraphs in terms of
            thematic unity: a paragraph is a sentence or a group of sentences
            that supports one central, unified idea. Paragraphs add one idea at
            a time to your broader argument.
          </p>
        </ul>

        <AwRadio
          class="sf-radio--transparent"
          name="Shipping"
          value="store"
          label="48 hours Coffee"
          details="Delivery within 48 hours"
          description=""
          :disabled="false"
          selected=""
          :required="false"
        />

           <button
            class="accordion"
            :class="{ active: showCategoryD }"
            :aria-disabled="false"
            :link="null"
            @click="showCategoryD = !showCategoryD"
            type="link"
          >
            info
          </button>
        <ul class="category-list" v-show="showCategoryD">
          <p>
            A paragraph is a series of related sentences developing a central
            idea, called the topic. Try to think about paragraphs in terms of
            thematic unity: a paragraph is a sentence or a group of sentences
            that supports one central, unified idea. Paragraphs add one idea at
            a time to your broader argument.
          </p>
        </ul>

        <AwRadio
          class="sf-radio--transparent"
          name="Shipping"
          value="store"
          label="Urgent24h "
          details="Delivery within 24 hours"
          description=""
          :disabled="false"
          selected=""
          :required="false"
        />

        <button
          class="accordion"
          :class="{ active: showCategoryE }"
          @click="showCategoryE = !showCategoryE"
        >
          Info
        </button>
        <ul class="category-list" v-show="showCategoryE">
          <p>Aditya</p>
        </ul>

        <AwRadio
          v-for="(method, index) in shippingMethods"
          :key="index"
          v-e2e="'shipping-method-label'"
          :label="method.method_title"
          :value="method.method_code"
          :selected="
            selectedShippingMethod && selectedShippingMethod.method_code
          "
          name="shippingMethod"
          :description="method.carrier_title"
          class="form__radio shipping"
          @input="selectShippingMethod(method)"
        >
          <template #label>
            <div class="sf-radio__label shipping__label">
              <div>{{ method.carrier_title }}</div>
              <div v-if="method && (method.amount || method.price_incl_tax)">
                {{ $fc(getShippingMethodPrice(method)) }}
              </div>
            </div>
          </template>
          <template #description>
            <div class="sf-radio__description shipping__description">
              <div class="shipping__info">
                {{ method.method_title }}
              </div>
            </div>
          </template>
        </AwRadio>
      </div>
      <div class="form__action">
        <AwButton
          v-e2e="'continue-to-billing'"
          class="form__action-button"
          type="button"
          @click="$router.push(`${localePath('/checkout/billing')}`)"
        >
          {{ $t("Go To Shiping") }}
        </AwButton>
      </div>
    </div>
  </div>
</template>

<script>
import {
  useCart,
  useShippingProvider,
  cartGetters,
  useGetShippingMethods,
} from "@vue-storefront/magento";
import AwHeading from "@storefront-ui/root/packages/vue/src/components/atoms/AwHeading/AwHeading.vue";
import AwButton from "@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import AwRadio from "@storefront-ui/root/packages/vue/src/components/molecules/AwRadio/AwRadio.vue";
import AwLoader from "@storefront-ui/root/packages/vue/src/components/atoms/AwLoader/AwLoader.vue";

import { computed, defineComponent } from "@nuxtjs/composition-api";
import getShippingMethodPrice from "~/helpers/checkout/getShippingMethodPrice";

export default defineComponent({
  name: "VsfShippingProvider",
  components: {
    AwHeading,
    AwButton,
    AwRadio,
    AwLoader,
  },
  setup() {
    const {
      result: shippingMethods,
      loading: loadingShippingMethods,
      error: errorUseGetShippingMethods,
    } = useGetShippingMethods();
    const { cart } = useCart();
    const {
      state,
      save: saveShippingProvider,
      error: errorShippingProvider,
      loading: loadingShippingProvider,
      setState,
    } = useShippingProvider();
    const selectedShippingMethod = computed(() => state.value);
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const isLoading = computed(
      () => loadingShippingMethods.value || loadingShippingProvider.value
    );
    const isShippingMethodStepCompleted = computed(
      () => state.value?.method_code && !isLoading.value
    );
    /**
     * @TODO: Do not run the setShippingMethodsOnCart mutation on in-store pickup orders.
     * Instead, specify the pickup_location_code attribute in the setShippingAddressesOnCart mutation.
     */
    const selectShippingMethod = async (method) => {
      const shippingData = {
        carrier_code: method.carrier_code,
        method_code: method.method_code,
      };

      setState(shippingData);
      await saveShippingProvider({
        shippingMethod: shippingData,
      });
      var app = ref(false);
    };

    return {
      errorShippingProvider,
      errorUseGetShippingMethods,
      getShippingMethodPrice,
      isLoading,
      isShippingMethodStepCompleted,
      loadingShippingProvider,
      selectedShippingMethod,
      selectShippingMethod,
      shippingMethods,
      state,
      totals,
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  --heading-title-font-weight: var(--font-weight--bold);
}

.shipping-provider {
  .sf-radio {
    &__label {
      display: flex;
      justify-content: space-between;
    }

    &__description {
      --radio-description-margin: 0;
      --radio-description-font-size: var(--font-xs);
    }
  }
}

.form {
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }

  &__action-button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: 25rem;
    }
  }

  &__radio-group {
    flex: 0 0 100%;
    margin: 0 0 var(--spacer-xl) 0;
    @include for-desktop {
      margin: 0 0 var(--spacer-2xl) 0;
    }
  }
}
</style>

<style lang=scss>
.sf-radio input:checked ~ .sf-radio__checkmark {
  box-sizing: border-box;
  width: 1.5rem;
  height: 1.5rem;
  border: solid #037ee6;
  border-width: 9px;
  border-radius: 100%;
  transition: border 0.25s cubic-bezier(1, 0.5, 0.8, 1);
  outline: #037ee6;
}
button.form__action-button.sf-button {
  background-color: #037ee6;
}

.ppp {
  margin-left: 645px;
  margin-top: -55px;
}
</style>
<style lang=scss>
.collapsible {
  collapsible {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: -18px;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
  }
}

.categoryBrowser ul {
  list-style-type: none;
}

.category-list > span {
  padding: 1em;
}

.category-list > span:hover {
  text-decoration: underline;
}

.accordion {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: -18px;
  text-align: left;
  border: none;
  outline: none;
  transition: 0.4s;
}

.active,
.accordion:hover {
  background-color: #ccc;
}

.accordion:after {
  content: "\02795"; /* Unicode character for "plus" sign (+) */

  color: #777;
  float: left;
  margin-left: 5px;
}

.active:after {
  content: "\2796"; /* Unicode character for "minus" sign (-) */
}

button.accordion {
  margin-left: 261px;
  margin-top: -54px;
}
/* .info{
  display: flex;
} */
</style>

<style lang=scss>
.dcc {
  display: flex;
  /* outline: dotted; */
}
button.accordion {
  width: 60px;
  margin-left: -75px;
  margin-top: 18px;
}
</style>