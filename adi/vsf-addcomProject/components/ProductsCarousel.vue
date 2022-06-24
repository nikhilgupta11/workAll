<template>
  <AwSection :title-heading="title" class="section">
    <AwLoader :class="{ loading }" :loading="loading">
      <AwCarousel
        data-cy="related-products-carousel"
        :settings="{ peek: 16, breakpoints: { 103: { peek: 0, perView: 2 } } }"
        class="carousel"
      >
        <AwCarouselItem
          v-for="(product, i) in mappedProducts"
          :key="i"
          class="carousel__item"
        >
          <AwProductCard
            :title="productGetters.getName(product)"
            :image-width="imageSizes.productCard.width"
            :image-height="imageSizes.productCard.height"
            :image="
              getMagentoImage(productGetters.getProductThumbnailImage(product))
            "
            :regular-price="$fc(productGetters.getPrice(product).regular)"
            :special-price="
              productGetters.getPrice(product).special &&
              $fc(productGetters.getPrice(product).special)
            "
            :score-rating="productGetters.getAverageRating(product)"
            :reviews-count="productGetters.getTotalReviews(product)"
            :show-add-to-cart-button="true"
            :is-added-to-cart="isInCart({ product })"
            :is-in-wishlist="isInWishlist({ product })"
            :wishlist-icon="isAuthenticated ? 'heart' : ''"
            :is-in-wishlist-icon="isAuthenticated ? 'heart_fill' : ''"
            :link=" 
              localePath(
                `/p/${productGetters.getProductSku(
                  product
                )}${productGetters.getSlug(product, product.categories[0])}`
              )
            "
            @click:wishlist="addItemToWishlist(product)"
            @click:add-to-cart="addItemToCart({ product, quantity: 1 })"
          >
            <template #image="imageSlotProps">
              <AwButton
                :link="imageSlotProps.link"
                class="sf-button--pure sf-product-card__link"
                data-testid="product-link"
                aria-label="Go To Product"
                v-on="$listeners"
              >
                <template v-if="Array.isArray(imageSlotProps.image)">
                  <nuxt-img
                    v-for="(picture, key) in imageSlotProps.image.slice(0, 2)"
                    :key="key"
                    class="sf-product-card__picture"
                    :src="picture"
                    :alt="imageSlotProps.title"
                    :width="imageSlotProps.imageWidth"
                    :height="imageSlotProps.imageHeight"
                  />
                </template>
                <nuxt-img
                  v-else
                  class="sf-product-card__image lol"
                  :src="imageSlotProps.image"
                  :alt="imageSlotProps.title"
                  :width="imageSlotProps.imageWidth"
                  :height="imageSlotProps.imageHeight"
                />
              </AwButton>
            </template>
          </AwProductCard>
        </AwCarouselItem>
        <template #prev="prevArrow">
          <AwButton
            aria-label="previous"
            class="sf-arrow"
            @click="prevArrow.go('prev')"
          >
            <SvgImage icon="arrow_left" width="24" height="24" />
          </AwButton>
        </template>
        <template #next="nextArrow">
          <AwButton
            aria-label="next"
            class="sf-arrow"
            @click="nextArrow.go('next')"
          >
            <SvgImage icon="arrow_right" width="24" height="24" />
          </AwButton>
        </template>
      </AwCarousel>
    </AwLoader>
  </AwSection>
</template>

<script>
import AwButton from "@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import AwCarousel from "@storefront-ui/root/packages/vue/src/components/organisms/AwCarousel/AwCarousel.vue";
import AwSection from "@storefront-ui/root/packages/vue/src/components/molecules/AwSection/AwSection.vue";
import AwLoader from "@storefront-ui/root/packages/vue/src/components/atoms/AwLoader/AwLoader.vue";
import AwProductCard from "@storefront-ui/root/packages/vue/src/components/organisms/AwProductCard/AwProductCard.vue";
import { productGetters, useUser, useWishlist } from "@vue-storefront/magento";
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { useAddToCart } from "~/helpers/cart/addToCart";
import { useImage } from "~/composables";
import SvgImage from "~/components/General/SvgImage.vue";

export default defineComponent({
  name: "ProductsCarousel",
  components: {
    AwCarousel,
    AwProductCard,
    AwSection,
    AwLoader,
    AwButton,
    SvgImage,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: "",
    },
    products: {
      type: Array,
      required: false,
      default: () => [],
    },
    loading: Boolean,
  },
  setup(props) {
    const { isAuthenticated } = useUser();
    const { isInWishlist, addItem, removeItem } = useWishlist("GlobalWishlist");
    const { addItemToCart, isInCart } = useAddToCart();

    const mappedProducts = computed(() =>
      props.products.map((product) => ({
        // @ts-ignore
        ...product,
        isInWishlist: isInWishlist({ product }),
      }))
    );

    const addItemToWishlist = async (product) => {
      await (isInWishlist({ product })
        ? removeItem({ product })
        : addItem({ product }));
    };

    const { getMagentoImage, imageSizes } = useImage();

    return {
      addItemToCart,
      addItemToWishlist,
      isAuthenticated,
      isInCart,
      isInWishlist,
      mappedProducts,
      productGetters,
      getMagentoImage,
      imageSizes,
    };
  },
});
</script>

<style lang="scss" scoped>
.section {
  margin-top: var(--spacer-base);
}

.carousel {
  margin: 0 calc(-1 * var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }

  &__item {
    margin: 1.9375rem 0 2.4375rem 0;
  }

  .sf-arrow {
    --button-color: var(--c-dark);

    &:hover {
      --button-color: var(--c-light);
    }
  }
}
</style>

