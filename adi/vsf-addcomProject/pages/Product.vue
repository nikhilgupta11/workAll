<template>
  <div id="product">
    <AwLoader
      :class="{ 'loading--product': productDataIsLoading }"
      :loading="productDataIsLoading"
    >
      <div>
        <AwBreadcrumbs
          class="breadcrumbs desktop-only"
          :breadcrumbs="breadcrumbs"
        />
        <div class="product">
          <LazyHydrate when-idle>
            <AwLoader
              :class="{ 'loading--product-gallery': productLoading }"
              :loading="productLoading"
            >
              <AwGallery
                :images="productGallery"
                :enable-zoom="true"
                class="product__gallery"
              />
            </AwLoader>
          </LazyHydrate>
          <div class="product__info">
            <div class="product__header">
              <AwHeading
                :title="productGetters.getName(product)"
                :level="3"
                class="sf-heading--no-underline sf-heading--left"
              />
              <SvgImage
                icon="drag"
                width="40"
                height="40"
                class="product__drag-icon smartphone-only"
              />
            </div>
            <div class="product__price-and-rating">
              <AwPrice
                :regular="$fc(productPrice)"
                :special="productSpecialPrice && $fc(productSpecialPrice)"
              />
              <div>
                <div class="product__rating">
                  <AwRating :score="averageRating" :max="5" />
                  <a v-if="!!totalReviews" href="#" class="product__count">
                    ({{ totalReviews }})
                  </a>
                </div>
                <AwButton class="sf-button--text" @click="changeTab(2)">
                  {{ $t("Read all reviews") }}
                </AwButton>
                <!-- |
                <AwButton
                  class="sf-button--text"
                  @click="changeNewReview"
                >
                  Add a review
                </AwButton> -->
              </div>
            </div>
            <div>
              <HTMLContent
                v-if="productShortDescription"
                :content="productShortDescription"
                tag="p"
                class="product__description desktop-only"
              />
              <AwButton class="sf-button--text desktop-only product__guide">
                {{ $t("Size guide") }}
              </AwButton>
              <template v-for="option in configurableOptions">
                <div
                  v-if="option.attribute_code === 'color'"
                  :key="option.uid"
                  class="product__colors desktop-only"
                >
                  <p class="product__color-label">{{ option.label }}:</p>
                  <AwColor
                    v-for="color in option.values"
                    :key="color.uid"
                    :color="productGetters.getSwatchData(color.swatch_data)"
                    :selected="
                      productConfiguration[option.attribute_uid] === color.uid
                    "
                    class="product__color"
                    @click="
                      () =>
                        updateProductConfiguration(
                          option.attribute_uid,
                          color.uid
                        )
                    "
                  />
                </div>
                <AwSelect
                  v-else
                  :key="option.uid"
                  :value="productConfiguration[option.attribute_uid]"
                  :label="option.label"
                  class="sf-select--underlined product__select-size"
                  :required="true"
                  @input="
                    ($event) =>
                      updateProductConfiguration(option.attribute_uid, $event)
                  "
                >
                  <AwSelectOption
                    v-for="attribute in option.values"
                    :key="attribute.uid"
                    :value="attribute.uid"
                  >
                    {{ attribute.label }}
                  </AwSelectOption>
                </AwSelect>
              </template>
              <template v-if="product.__typename === 'GroupedProduct'">
                <grouped-product-selector
                  :can-add-to-cart="canAddToCart"
                  @update-price="basePrice = $event"
                />
              </template>
              <template v-else-if="product.__typename === 'BundleProduct'">
                <BundleProductSelector
                  :can-add-to-cart="canAddToCart"
                  @update-price="basePrice = $event"
                />
              </template>
              <AwAddToCart
                v-else
                v-model="qty"
                v-e2e="'product_add-to-cart'"
                :disabled="loading || productLoading"
                class="product__add-to-cart"
                @click="addItem({ product, quantity: parseInt(qty) })"
              />
              <div class="wishlist">
              <div class="product__additional-actions">
                <AddToWishlist
                  :is-in-wishlist="isInWishlist"
                  :is-show="isAuthenticated"
                  @addToWishlist="addItemToWishlist({ product })"
                />
                </div>
                <div class="compare">
                <AwButton class="sf-button--text" @click="changeNewReview">
                Add to Compare
              </AwButton>
              </div>
              </div>
            </div>
            
              
            

            <LazyHydrate when-idle>
              <AwTabs
                id="tabs"
                :open-tab="openTab"
                class="product__tabs"
                @click:tab="changeTab"
              >
                <AwTab title="Description">
                  <HTMLContent
                    v-if="productDescription"
                    :content="productDescription"
                    tag="div"
                    class="product__description"
                  />
                  <!-- @TODO: Check Property in Configurable Products              -->
                  <!--              <AwProperty
                    v-for="(property, i) in properties"
                    :key="i"
                    :name="property.name"
                    :value="property.value"
                    class="product__property"
                  >
                    <template
                      v-if="property.name === 'Category'"
                      #value
                    >
                      <AwButton class="product__property__button sf-button--text">
                        {{ property.value }}
                      </AwButton>
                    </template>
                  </AwProperty>-->
                </AwTab>
                <AwTab title="Read reviews">
                  <div v-show="reviewsLoading">
                    <AwLoader />
                  </div>
                  <AwReview
                    v-for="review in reviews"
                    v-show="!reviewsLoading"
                    :key="reviewGetters.getReviewId(review)"
                    :author="reviewGetters.getReviewAuthor(review)"
                    :date="reviewGetters.getReviewDate(review)"
                    :message="reviewGetters.getReviewMessage(review)"
                    :max-rating="5"
                    :rating="reviewGetters.getReviewRating(review)"
                    :char-limit="250"
                    read-more-text="Read more"
                    hide-full-text="Read less"
                    class="product__review"
                  />

                  <!-- <div
                    v-show="!reviewsLoading"
                    id="addReview"
                  >
                    <ProductAddReviewForm
                      @add-review="successAddReview"
                    />
                  </div> -->
                  <div>
                    <AwPagination
                      :total="4"
                      :visible="4"
                      hasArrows
                      :current="1"
                      class="Pagignation"
                    />
                  </div>
                  <!-- <LazyHydrate on-interaction>
                    <AwPagination
                      v-if="!loading"
                      v-show="pagination.totalPages > 1"
                      class="products__pagination desktop-only"
                      :current="pagination.currentPage"
                      :total="pagination.totalPages"
                      :visible="5"
                    />
                  </LazyHydrate> -->
                </AwTab>
                <AwTab
                  title="Additional Information"
                  class="product__additional-info"
                >
                  <div class="product__additional-info">
                    <p class="product__additional-info__title">
                      {{ $t("Instruction1") }}
                    </p>
                    <p class="product__additional-info__paragraph">
                      {{ $t("Instruction2") }}
                    </p>
                    <p class="product__additional-info__paragraph">
                      {{ $t("Instruction3") }}
                    </p>
                  </div>
                </AwTab>
              </AwTabs>
            </LazyHydrate>
          </div>
        </div>
        <LazyHydrate when-visible>
          <RelatedProducts />
        </LazyHydrate>
        <LazyHydrate when-visible>
          <UpsellProducts />
        </LazyHydrate>
      </div>
    </AwLoader>
  </div>
</template>
<script>
import LazyHydrate from "vue-lazy-hydration";
// import {
//   AwAddToCart,
//   AwBreadcrumbs,
//   AwButton,
//   AwColor,
//   AwGallery,
//   AwHeading,
//   SfLoader,
//   AwPrice,
//   AwRating,
//   AwReview,
//   AwSelect,
//   AwTabs,
//   AwPagination,
// } from "../node_modules/@storefront-ui/root/packages/vue/src/components/";
import AwAddToCart from "../node_modules/@storefront-ui/root/packages/vue/src/components/molecules/AwAddToCart/AwAddToCart.vue";
import AwBreadcrumbs from "../node_modules/@storefront-ui/root/packages/vue/src/components/atoms/AwBreadcrumbs/AwBreadcrumbs.vue";
import AwButton from "../node_modules/@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import AwColor from "../node_modules/@storefront-ui/root/packages/vue/src/components/atoms/AwColor/AwColor.vue";
import AwGallery from "../node_modules/@storefront-ui/root/packages/vue/src/components/molecules/AwGallery/AwGallery.vue";
import AwHeading from "../node_modules/@storefront-ui/root/packages/vue/src/components/atoms/AwHeading/AwHeading.vue";
import AwPrice from "../node_modules/@storefront-ui/root/packages/vue/src/components/atoms/AwPrice/AwPrice.vue";
import AwRating from "../node_modules/@storefront-ui/root/packages/vue/src/components/atoms/AwRating/AwRating.vue";
import AwReview from "../node_modules/@storefront-ui/root/packages/vue/src/components/molecules/AwReview/AwReview.vue";
import AwSelect from "../node_modules/@storefront-ui/root/packages/vue/src/components/molecules/AwSelect/AwSelect.vue";
import AwTabs from "../node_modules/@storefront-ui/root/packages/vue/src/components/organisms/AwTabs/AwTabs.vue";
import AwPagination from "../node_modules/@storefront-ui/root/packages/vue/src/components/molecules/AwPagination/AwPagination.vue";
import AwLoader from "../node_modules/@storefront-ui/root/packages/vue/src/components/atoms/AwLoader/AwLoader.vue";

import {
  useProduct,
  useCart,
  productGetters,
  useReview,
  reviewGetters,
  useUser,
  useWishlist,
} from "@vue-storefront/magento";
import { onSSR } from "@vue-storefront/core";
import {
  ref,
  computed,
  useContext,
  useRoute,
  useRouter,
  defineComponent,
} from "@nuxtjs/composition-api";
import { useCache, CacheTagPrefix } from "@vue-storefront/cache";
import { productData } from "~/helpers/product/productData";
import cacheControl from "~/helpers/cacheControl";
import BundleProductSelector from "~/components/Products/BundleProductSelector";
import GroupedProductSelector from "~/components/Products/GroupedProductSelector";
// import InstagramFeed from '~/components/InstagramFeed.vue';
// import MobileStoreBanner from '~/components/MobileStoreBanner.vue';
import ProductAddReviewForm from "~/components/ProductAddReviewForm.vue";
import UpsellProducts from "~/components/UpsellProducts";
import RelatedProducts from "~/components/RelatedProducts";
import HTMLContent from "~/components/HTMLContent";
import AddToWishlist from "~/components/AddToWishlist";
import SvgImage from "~/components/General/SvgImage.vue";

// import productDetailLayout from '../layouts/productDetailLayout.vue';

export default defineComponent({
  name: "ProductPage",
  // layout: "productDetailLayout",
  components: {
    BundleProductSelector,
    GroupedProductSelector,
    HTMLContent,
    // InstagramFeed,
    LazyHydrate,
    // MobileStoreBanner,
    ProductAddReviewForm,
    RelatedProducts,
    AwAddToCart,
    AwBreadcrumbs,
    AwButton,
    AwColor,
    AwGallery,
    AwHeading,
    AwLoader,
    AwPrice,
    AwRating,
    AwReview,
    AwSelect,
    AwTabs,
    AddToWishlist,
    SvgImage,
    UpsellProducts,
    AwPagination,
  },
  middleware: cacheControl({
    "max-age": 60,
    "stale-when-revalidate": 5,
  }),
  transition: "fade",
  setup() {
    const { addTags } = useCache();
    const qty = ref(1);
    const { product, id } = productData();
    const route = useRoute();
    const router = useRouter();
    const { search, loading: productLoading } = useProduct(`product-${id}`);
    const { addItem, loading } = useCart();
    const {
      reviews: productReviews,
      search: searchReviews,
      loading: reviewsLoading,
      addReview,
    } = useReview(`productReviews-${id}`);
    const { isAuthenticated } = useUser();
    const { addItem: addItemToWishlist, isInWishlist } =
      useWishlist("GlobalWishlist");
    const { error: nuxtError, app } = useContext();
    const basePrice = ref(0);
    const openTab = ref(1);
    const productDataIsLoading = computed(
      () => productLoading.value && !productGetters.getName(product.value)
    );
    const productShortDescription = computed(
      () => product.value.short_description?.html || ""
    );
    const productDescription = computed(
      () => product.value.description?.html || ""
    );
    const canAddToCart = computed(() => {
      // eslint-disable-next-line no-underscore-dangle
      if (product.value.__typename === "ConfigurableProduct") {
        return !!product.value.configurable_product_options_selection?.variant
          ?.uid;
      }
      const inStock = product.value.stock_status || "";
      const stockLeft =
        product.value.only_x_left_in_stock === null
          ? true
          : qty.value <= product.value.only_x_left_in_stock;
      return inStock && stockLeft;
    });
    const categories = computed(() =>
      productGetters.getCategoryIds(product.value)
    );
    const baseReviews = computed(() =>
      Array.isArray(productReviews.value)
        ? [...productReviews.value].shift()
        : productReviews.value
    );
    const reviews = computed(() => reviewGetters.getItems(baseReviews.value));
    const totalReviews = computed(() =>
      reviewGetters.getTotalReviews(baseReviews.value)
    );
    const averageRating = computed(() =>
      reviewGetters.getAverageRating(baseReviews.value)
    );
    const breadcrumbs = computed(() => {
      const productCategories = product.value.categories;
      return productGetters.getBreadcrumbs(
        product.value,
        Array.isArray(productCategories) ? [...productCategories].pop() : []
      );
    });
    const productGallery = computed(() =>
      productGetters.getGallery(product.value).map((img) => ({
        mobile: { url: img.small },
        desktop: { url: img.normal },
        big: { url: img.big },
        // eslint-disable-next-line no-underscore-dangle
        alt: product.value._name || product.value.name,
      }))
    );

    const configurableOptions = computed(
      () => product.value.configurable_options
    );
    const productConfiguration = ref(Object.entries(route.value.query));
    const productTypedPrice = computed(() => {
      // eslint-disable-next-line no-underscore-dangle
      switch (product.value.__typename) {
        case "BundleProduct":
          return basePrice.value;
        case "GroupedProduct":
          return basePrice.value;
        default:
          return 0;
      }
    });
    const productPrice = computed(
      () =>
        productTypedPrice.value ||
        productGetters.getPrice(product.value).regular
    );
    const productSpecialPrice = computed(() => {
      // eslint-disable-next-line no-underscore-dangle
      switch (product.value.__typename) {
        case "SimpleProduct":
        default:
          return productGetters.getPrice(product.value).special;
      }
    });

    const changeTab = (tabNumber, callback) => {
      document.querySelector("#tabs").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      openTab.value = tabNumber;
      if (callback && typeof callback === "function") callback();
    };
    const changeNewReview = () => {
      changeTab(2, () => {
        setTimeout(
          () =>
            document.querySelector("#addReview").scrollIntoView({
              behavior: "smooth",
              block: "end",
            }),
          500
        );
      });
    };
    const successAddReview = async (reviewData) => {
      await addReview(reviewData);
      document.querySelector("#tabs").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };

    const updateProductConfiguration = async (label, value) => {
      productConfiguration.value.push([label, value]);

      await router.push({
        path: `${app.localePath(route.value.fullPath)}`,
        query: {
          ...Object.fromEntries(productConfiguration.value),
        },
      });
    };

    onSSR(async () => {
      const baseSearchQuery = {
        filter: {
          sku: {
            eq: id,
          },
        },
        ...(productConfiguration.value.length > 0
          ? {
              configurations: productConfiguration.value.map(
                (config) => config[1]
              ),
            }
          : {}),
      };

      await search({
        queryType: "DETAIL",
        ...baseSearchQuery,
      });

      if (product?.value?.length === 0) nuxtError({ statusCode: 404 });

      await searchReviews(baseSearchQuery);

      const tags = [
        {
          prefix: CacheTagPrefix.View,
          value: `product-${route.value.params.id}`,
        },
      ];
      const productTags = {
        prefix: CacheTagPrefix.Product,
        value: product.value.uid,
      };

      const categoriesTags = categories.value.map((catId) => ({
        prefix: CacheTagPrefix.Category,
        value: catId,
      }));
      addTags(tags.concat(productTags, categoriesTags));
    });

    return {
      addItem,
      addItemToWishlist,
      averageRating,
      basePrice,
      breadcrumbs,
      canAddToCart,
      categories,
      changeNewReview,
      changeTab,
      configurableOptions,
      isAuthenticated,
      isInWishlist: computed(() => isInWishlist({ product: product.value })),
      loading,
      openTab,
      product,
      productConfiguration: computed(() =>
        Object.fromEntries(productConfiguration.value)
      ),
      productDataIsLoading,
      productDescription,
      productGallery,
      productGetters,
      productLoading,
      productPrice,
      productReviews,
      productShortDescription,
      productSpecialPrice,
      qty,
      reviewGetters,
      reviews,
      reviewsLoading,
      successAddReview,
      totalReviews,
      updateProductConfiguration,
    };
  },
});
</script>
<style lang="scss" scoped>
#product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
}

.product-loader {
  height: 38px;
  margin: var(--spacer-base) auto var(--spacer-lg);
}

.product {
  @include for-desktop {
    display: flex;
  }

  &__info {
    margin: var(--spacer-sm) auto;
    @include for-desktop {
      margin: 0;
      max-width: 32.625rem;
      padding-left: var(--spacer-lg);
      width: 100%;
    }
  }

  &__header {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      margin: 0 auto;
    }
  }

  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
    color: var(--c-text-disabled);
  }

  &__price-and-rating {
    margin: 0 var(--spacer-sm) var(--spacer-base);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }

  &__rating {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: var(--spacer-xs) 0 var(--spacer-xs);
  }

  &__count {
    @include font(
      --count-font,
      var(--font-weight--normal),
      var(--font-size--sm),
      1.4,
      var(--font-family--secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }

  &__description {
    @include font(
      --product-description-font,
      var(--font-weight--light),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
  }

  &__select-size {
    margin: 0 var(--spacer-sm);
    @include for-desktop {
      margin: 0;
    }
  }

  &__colors {
    @include font(
      --product-color-font,
      var(--font-weight--normal),
      var(--font-size--lg),
      1.6,
      var(--font-family--secondary)
    );
    display: flex;
    align-items: center;
    margin-top: var(--spacer-xl);
  }

  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }

  &__color {
    margin: 0 var(--spacer-2xs);
  }

  &__add-to-cart {
    margin: var(--spacer-base) var(--spacer-sm) 0;
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }

  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }

  &__compare {
    margin-top: 0;
  }

  &__tabs {
    --tabs-title-z-index: 0;
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    --tabs-title-font-size: var(--font-size--lg);
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }

  &__property {
    margin: var(--spacer-base) 0;

    &__button {
      --button-font-size: var(--font-size--base);
    }
  }

  &__review {
    padding-bottom: 24px;
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
  }

  &__additional-info {
    color: var(--c-link);
    @include font(
      --additional-info-font,
      var(--font-weight--light),
      var(--font-size--sm),
      1.6,
      var(--font-family--primary)
    );

    &__title {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      margin: 0 0 var(--spacer-sm);

      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }

    &__paragraph {
      margin: 0;
    }
  }

  &__additional-actions {
    display: flex;
    justify-content: flex-start;
    margin: 0 var(--spacer-sm);
    @include for-desktop {
      margin: 0;
    }
  }

  &__gallery {
    flex: 1;
  }
}

.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}

@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

.loading {
  &--product {
    padding: var(--spacer-3xl) auto;
    @include for-desktop {
      padding-top: 3.75rem;
      padding-bottom: 3.75rem;
    }
  }

  &--product-gallery {
    padding: var(--spacer-3xl) auto;
    @include for-desktop {
      padding-top: 3.75rem;
      padding-bottom: 3.75rem;
    }
  }
}
</style>

<style lang=scss>
.carousel .sf-arrow[data-v-bdde9382] {
  --button-color: #282828;
  width: 70px;
  height: 40px;
}
.sf-carousel__carousel {
  --button-color: #282828;
  width: 70px;
  height: 40px;
}

.latter_compare {
  /* outline: dotted; */
  .sf-button--text {
    align-items: center;
    color: #037ee6;
    float: right;
    margin-right: 5px;
  }
}

/* .product__price-and-rating {
    .sf-button--text {
          color: #037EE6;
    }
}

.product__guide[data-v-03500634] {
  .sf-button--text {
    color: #037EE6;
  }
}

.product__additional-actions {
  color: #037EE6;
} */

.sf-button--text {
  color: #037ee6;
}

.sf-add-to-cart__button {
  background: #037ee6;
}

/* .sf-rating__icon--negative {
  color:#037EE6 !important;
} */

.sf-rating__icon {
  --icon-size: 0.875rem;
  --icon-color: #037ee6;
  --icon-color-negative: var(--c-gray-variant);
}

/* .sf-rating {
    display: flex;
    --icon-color: #037EE6;
    --icon-color-negative: var(--c-gray-variant);
    --icon-size: 0.875rem;
} */

.sf-review__icon {
  --icon-size: 1.5rem;
  --icon-color: #037ee6;
}

.sf-circle-icon {
  --icon-color: var(--c-white);
  --button-padding: 0;
  --icon-size: 1.5rem;
  --button-size: 3.25rem;
  --button-background: #037ee6;
  --button-border-radius: 100%;
  position: var(--circle-icon-position, relative);
}

.sf-circle-icon:hover {
  --icon-color: var(--c-white);
  --button-padding: 0;
  --icon-size: 1.5rem;
  --button-size: 3.25rem;
  --button-background: #037ee6;
  --button-border-radius: 100%;
  position: var(--circle-icon-position, relative);
  --button-box-shadow: #037ee6;
}

.sf-icon svg .sf-icon img {
  position: absolute;
  left: 40.91%;
  right: 40.91%;
  top: 36.36%;
  bottom: 36.36%;

  /* Secondary Color Dark Version 1 */

  background: #3c3c3c;
  transform: matrix(-1, 0, 0, 1, 0, 0);
}

.sf-button.color-primary {
  --button-background: #037ee6;
}
.sf-button.color-primary:hover {
  --button-background: #037ee6;
}
.wishlist{
  display: flex;
  .compare{
    margin-top: 20px;
    margin-left: 230px;
  }
}
</style>
