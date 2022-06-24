<template>
  <div id="home">
    <AwHero class="hero">
      <AwHeroItem
        v-for="(hero, i) in heroes"
        :key="i"
        :title="hero.title"
        :subtitle="hero.subtitle"
        :button-text="hero.buttonText"
        :background="hero.background"
        :image="hero.image"
        :class="hero.className"
      />
      <template #prev="prevArrow">
        <AwButton
          aria-label="previous" 
          class="hero__arrow"
          @click="prevArrow.go('prev')"
        >
          <SvgImage icon="arrow_left" width="24" height="24" />
        </AwButton>
      </template>
      <template #next="nextArrow">
        <AwButton
          aria-label="next"
          class="hero__arrow"
          @click="nextArrow.go('next')"
        >
          <SvgImage icon="arrow_right" width="24" height="24" />
        </AwButton>
      </template>
    </AwHero>
<template>
<popular-categories/>
</template>
    
    <LazyHydrate when-visible>
      <AwBannerGrid :banner-grid="1" class="banner-grid">
        <template v-for="item in banners" #[item.slot]>
          <AwBanner
            :key="item.slot"
            :title="item.title"
            :subtitle="item.subtitle"
            :description="item.description"
            :button-text="item.buttonText"
            :image="item.image"
            :class="item.class"
          /> 
        </template>
      </AwBannerGrid>
    </LazyHydrate>
    <LazyHydrate when-visible>
      <ProductsCarousel
        :products="newProducts"
        :loading="newProductsLoading"
        :title="$t('Match it with')"
      />
    </LazyHydrate>

    <LazyHydrate when-visible>
        <AwCallToAction
          :title="$t('Subscribe to Newsletters')"
          :button-text="$t('Subscribe')"
          :description="
            $t(
              'Be aware of upcoming sales and events. Receive gifts and special offers!'
            )
          "
          :image="require('static/homepage/banner1.jpg')"
          class="call-to-action"
          style="font-size: 30px"
        />
    </LazyHydrate>
    <template>

  <AwInput
    value=""
    name="email"
    placeholder="Your Email"
    type="text"
    class="sf-input--outline"
    style="
            position: relative;
            width: 300px;
            top: 0%;
            height:53px;
            font-size: 12px;
            color: #43464e;
            background-color: white;
            margin-left: 710px; 
            margin-top: 235px;
            margin-bottom: 150px;
          "
  />
</template>
    <LazyHydrate when-visible>
      <InstagramFeed />
    </LazyHydrate>

    <LazyHydrate when-visible>
      <MobileStoreBanner />
    </LazyHydrate>

    
  </div>
</template>
<script type="module">

import AwCallToAction from "@storefront-ui/root/packages/vue/src/components/molecules/AwCallToAction/AwCallToAction.vue";
import AwBanner from "@storefront-ui/root/packages/vue/src/components/molecules/AwBanner/AwBanner.vue";
import AwBannerGrid from "@storefront-ui/root/packages/vue/src/components/organisms/AwBannerGrid/AwBannerGrid.vue"
import AwButton from "@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import AwHero from "@storefront-ui/root/packages/vue/src/components/organisms/AwHero/AwHero.vue";
import PopularCategories from '../components/PopularCategories.vue';
import AwInput from "@storefront-ui/root/packages/vue/src/components/atoms/AwInput/AwInput.vue";
import { onSSR } from "@vue-storefront/core";
import LazyHydrate from "vue-lazy-hydration";
import { useCache, CacheTagPrefix } from "@vue-storefront/cache";
import MobileStoreBanner from "~/components/MobileStoreBanner.vue";
import InstagramFeed from "~/components/InstagramFeed.vue";
import ProductsCarousel from "~/components/ProductsCarousel.vue";
import SvgImage from "~/components/General/SvgImage.vue";
import {
  computed,
  defineComponent,
  ref,
  useContext,
} from "@nuxtjs/composition-api";
import {
useProduct,
productGetters,
} from '@vue-storefront/magento';

export default defineComponent({
  name: "HomePage",
  components: {
    InstagramFeed,
    LazyHydrate,
    MobileStoreBanner,
    ProductsCarousel,
    SvgImage,
    AwCallToAction,

    AwHero,
    AwBanner,
    AwBannerGrid,
    AwButton,
    AwInput,
    PopularCategories,

  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const { addTags } = useCache();
    const { app } = useContext();
    const year = new Date().getFullYear();

    const {
      products: newProductsResult,
      search: newProductsSearch,
      loading: newProductsLoading,
    } = useProduct("newProducts");
    const heroes = ref([
      {
        title: app.i18n.t("Colorful summer dresses are already in store"),
        subtitle: app.i18n.t("SUMMER COLLECTION {year}", { year }),
        buttonText: app.i18n.t("Learn more"),
        background: "#eceff1",
        image: {
          mobile:
            "https://cdn.shopify.com/s/files/1/0407/1902/4288/files/bannerB_328x224.jpg",
          desktop:
            require('../static/homepage/hero.png'),
        },
        link: "/c/women/women-clothing-shirts",
      },
      {
        title: app.i18n.t("Colorful summer dresses are already in store"),
        subtitle: app.i18n.t("SUMMER COLLECTION {year}", { year }),
        buttonText: app.i18n.t("Learn more"),
        background: "#fce4ec",
        image: {
          mobile:
            "https://cdn.shopify.com/s/files/1/0407/1902/4288/files/bannerH_328x224.jpg",
          desktop:
            require('../static/homepage/hero.png'),
        },
        link: "/c/women/women-clothing-dresses",
      },
      {
        title: app.i18n.t("Colorful summer dresses are already in store"),
        subtitle: app.i18n.t("SUMMER COLLECTION {year}", { year }),
        buttonText: app.i18n.t("Learn more"),
        background: "#efebe9",
        image: {
          mobile:
            "https://cdn.shopify.com/s/files/1/0407/1902/4288/files/bannerA_328x224.jpg",
          desktop:
            require('../static/homepage/hero.png'),
        },
        link: "/c/women/women-shoes-sandals",
        className:
          "sf-hero-item--position-bg-top-left sf-hero-item--align-left",
      },
    ]);
    const banners = ref([
      {
        slot: "banner-A",
        subtitle: app.i18n.t("Dresses"),
        title: app.i18n.t("Business & Finance"),
        description: app.i18n.t(
          "Find stunning women's cocktail dresses and party dresses. Stand out in lace and metallic cocktail dresses from all your favorite brands."
        ),
        buttonText: app.i18n.t("Shop now"),
        image: {
          mobile:
            require('../static/homepage/1.jpg'),
          desktop:
            require('../static/homepage/1.jpg'),
        },
        class: "sf-banner--slim desktop-only",
        link: "/c/women/women-clothing-skirts",
      },
      {
        slot: "banner-B",
        subtitle: app.i18n.t("Dresses"),
        title: app.i18n.t("Business & Finance"),
        description: app.i18n.t(
          "Find stunning women's cocktail dresses and party dresses. Stand out in lace and metallic cocktail dresses from all your favorite brands."
        ),
        buttonText: app.i18n.t("Shop now"),
        image: {
          mobile:
             require('../static/homepage/2.jpg'),
          desktop:
             require('../static/homepage/2.jpg'),
        },
        class: "sf-banner--slim banner-central desktop-only",
        link: "/c/women/women-clothing-dresses",
      },
      {
        slot: "banner-C",
        subtitle: app.i18n.t("T-Shirts"),
        title: app.i18n.t("The Office Life"),
        image: {
          mobile:
            require('../static/homepage/3.jpg'),
          desktop:
            require('../static/homepage/3.jpg'),
        },
        class: "sf-banner--slim banner__tshirt",
        link: "/c/women/women-clothing-shirts",
      },
      {
        slot: "banner-D",
        subtitle: app.i18n.t("Summer Sandals"),
        title: app.i18n.t("Eco Friendly Environment"),
        image: {
          mobile:
           require('../static/homepage/4.jpg'), 
          desktop:
           require('../static/homepage/4.jpg'),
        },
        class: "sf-banner--slim",
        link: "/c/women/women-shoes-sandals",
      },
    ]);

    // @ts-ignore
    const newProducts = computed(() =>
      productGetters.getFiltered(newProductsResult.value?.items, {
        master: true,
      })
    );

    onSSR(async () => {
      await newProductsSearch({
        pageSize: 10,
        currentPage: 1,
        sort: {
          position: "ASC",
        },
      });

      addTags([{ prefix: CacheTagPrefix.View, value: "home" }]);
    });

    return {
      banners,
      heroes,
      newProducts,
      newProductsLoading,
      productGetters,
    };
  },
});
</script>

<style lang="scss" scoped>
.article-meta h4 a {
  color: #111111;
  font-weight: 600;
  font-size: 20px;
}

.article-meta {
  margin-top: 10px;
}

.article-item__meta-item:not(:last-child)::after {
  display: inline-block;
  content: "";
  width: 5px;
  height: 5px;
  margin: -1px 10px 0 10px;
  border-radius: 100%;
  background: rgba(0, 0, 0, 0.4);
  vertical-align: middle;
}

#home {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    max-width: 1240px;
    padding: 0;
    margin: 0 auto;
  }
}

.hero {
  margin: var(--spacer-xl) auto var(--spacer-lg);
  --hero-item-background-position: center;

  ::v-deep .sf-link:hover {
    color: var(--c-white);
  }

  @include for-desktop {
    margin: var(--spacer-xl) auto var(--spacer-2xl);
  }

  &__arrow {
    --button-height: 2.75rem;
    --button-width: 2.75rem;
    --button-padding: 0 var(--spacer-xs);
    --button-background: transparent;
    --button-color: var(--c-dark);
    display: flex;
    align-content: center;
    justify-content: center;

    &:hover {
      --button-background: transparent;
      --button-box-shadow-opacity: 0;
    }
  }

  .sf-hero-item {
    &:nth-child(even) {
      --hero-item-background-position: left;
      @include for-mobile {
        --hero-item-background-position: 30%;
        --hero-item-wrapper-text-align: right;
        --hero-item-subtitle-width: 100%;
        --hero-item-title-width: 100%;
        --hero-item-wrapper-padding: var(--spacer-sm) var(--spacer-sm)
          var(--spacer-sm) var(--spacer-2xl);
      }
    }
  }
}

::v-deep .sf-hero__controls {
  --hero-controls-display: none;
}

.banner-grid {
  --banner-container-width: 50%;
  margin: var(--spacer-xl) 0;

  ::v-deep .sf-link:hover {
    color: var(--c-white);
  }

  @include for-desktop {
    margin: var(--spacer-2xl) 0;
    ::v-deep .sf-link {
      --button-width: auto;
    }
  }
}

.banner {
  &__tshirt {
    background-position: left;
  }

  &-central {
    @include for-desktop {
      --banner-container-flex: 0 0 70%;
    }
  }
}

.similar-products {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacer-2xs);
  --heading-padding: 0;
  border-bottom: 1px var(--c-light) solid;
  @include for-desktop {
    border-bottom: 0;
    justify-content: center;
    padding-bottom: 0;
  }
}

.call-to-action {
  width: 1240px;

  position: absolute;
  background-position: right;
  margin: var(--spacer-xs) 0;
  @include for-desktop {
    margin: var(--spacer-l) 0 var(--spacer-2xl) 0;
  }
}

.carousel {
  margin: 0 calc(-1 * var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }

  &__item {
    margin: 1.375rem 0 2.5rem 0;
    @include for-desktop {
      margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
    }

    &__product {
      --product-card-add-button-transform: translate3d(0, 30%, 0);
    }
  }
}
</style>

<style lang=scss>
.sf-footer {
    border-top: var(--spacer-xs) solid #037ee6;
    padding-bottom: 0;
    margin-top: var(--spacer-2xl);
}
/* .sf-button {
    --button-box-shadow-opacity: 0.25;
    --button-background: blue;
}
.sf-button:hover {
    --button-box-shadow-opacity: 0.25;
    --button-background: blue;
} */
</style>