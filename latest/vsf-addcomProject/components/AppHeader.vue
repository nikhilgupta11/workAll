<template>
  <div>
    <AwHeader
      class="sf-header--has-mobile-search"
      :class="{ 'header-on-top': isSearchOpen, currentCategory }"
    >
      <template #logo>
        <HeaderLogo />
      </template>

      <!-- HeaderNavigation Section Start-->
      <template #navigation>
        <HeaderNavigationItem
          v-for="(category, index) in categoryTree"
          :key="index"
          v-e2e="'app-header-url_women'"
          class="nav-item"
          :label="category.label"
          :link="localePath(getAgnosticCatLink(category))"
          @mouseover.native="
            () => {
              currentCategory = category.label;
            }
          "
          @mouseleave.native="currentCategory = ''"
        >
          <AwMegaMenu
            :visible="currentCategory === category.label"
            :title="category.label"
            class="sf-mega-menu"
            :is-absolute="true"
            @close="currentCategory = ''"
          >
            <AwMegaMenuColumn class="categories-header">
              <AwList class="menu_item_category">
                <AwListItem
                  v-for="(subcat, childIndex) in category.items"
                  :key="childIndex"
                >
                  <AwMenuItem :label="subcat.label">
                    <template #label="{ label }">
                      <AwLink
                        :link="localePath(getAgnosticCatLink(subcat))"
                        @click.native="currentCategory = ''"
                      >
                        {{ label }}
                      </AwLink>
                    </template>
                  </AwMenuItem>
                </AwListItem>
              </AwList>
            </AwMegaMenuColumn>
            <AwMegaMenuColumn 
            class="subCategories-header"
              v-for="(subcategory, subIndex) in category.items"
              :key="subIndex"
              :title="subcategory.label"
            >
              <AwList>
                <AwListItem
                  v-for="(subcategoryChild, childIndex) in subcategory.items"
                  :key="childIndex"
                >
                  <AwMenuItem
                    :label="subcategoryChild.label"
                    class="menu_item_sub_category"
                  >
                    <template #label="{ label }">
                      <AwLink
                        :link="localePath(getAgnosticCatLink(subcategoryChild))"
                        @click.native="currentCategory = ''"
                      >
                        {{ label }}
                      </AwLink>
                    </template>
                  </AwMenuItem>
                </AwListItem>
              </AwList>
            </AwMegaMenuColumn>
          </AwMegaMenu>
        </HeaderNavigationItem>
      </template>

      <!-- HeaderNavigation Section End-->

      <template #aside>
        <div class="sf-header__switchers">
          <CurrencySelector class="smartphone-only" />
          <StoreSwitcher class="smartphone-only" />
        </div>
      </template>
      <template #header-icons="{ activeIcon }">
        <div class="sf-header__icons">
          <AwButton
            v-e2e="'app-header-account'"
            class="sf-button--pure sf-header__action"
            data-testid="accountIcon"
            aria-label="Account"
            @click="handleAccountClick"
          >
            <SvgImage
              :icon="accountIcon"
              :label="$t('Account')"
              width="1.25rem"
              height="1.25rem"
              :class="{
                'sf-header__icon is-active': activeIcon === 'account',
              }"
            />
          </AwButton>
          <AwButton
            class="sf-button--pure sf-header__action"
            data-testid="wishlistIcon"
            aria-label="Wishlist"
            @click="toggleWishlistSidebar"
          >
            <SvgImage
              :icon="wishlistHasProducts ? 'heart_fill' : 'heart'"
              :label="$t('Wishlist')"
              width="1.25rem"
              height="1.25rem"
              class="sf-header__icon"
              :class="{
                'sf-header__icon is-active': activeIcon === 'wishlist',
              }"
            />
            <AwBadge
              v-if="wishlistHasProducts"
              class="sf-badge--number cart-badge"
            >
              {{ wishlistItemsQty }}
            </AwBadge>
          </AwButton>
          <AwButton
            v-e2e="'app-header-cart'"
            class="sf-button--pure sf-header__action"
            aria-label="Toggle cart sidebar"
            @click="toggleCartSidebar"
          >
            <SvgImage
              icon="empty_cart"
              :label="$t('Cart')"
              width="20"
              height="20"
              class="sf-header__icon"
              :class="{
                'sf-header__icon is-active': activeIcon === 'cart',
              }"
            />
            <AwBadge v-if="cartTotalItems" class="sf-badge--number cart-badge">
              {{ cartTotalItems }}
            </AwBadge>
          </AwButton>
        </div>
      </template>
      <template #search>
        <SearchBar
          @SearchBar:toggle="isSearchOpen = $event"
          @SearchBar:result="result = $event"
        />
      </template>
    </AwHeader>

    <SearchResults
      v-if="isSearchOpen"
      :visible="isSearchOpen"
      :result="result"
    />
    <AwOverlay :visible="isSearchOpen" />
    <!-- <AwOverlay :visible="!!currentCategory" /> -->
  </div>
</template>

<script>
import AwOverlay from "@storefront-ui/root/packages/vue/src/components/atoms/AwOverlay/AwOverlay.vue";
import AwHeader from "@storefront-ui/root/packages/vue/src/components/organisms/AwHeader/AwHeader.vue";
import AwButton from "@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import AwBadge from "@storefront-ui/root/packages/vue/src/components/atoms/AwBadge/AwBadge.vue";
import AwMegaMenu from "@storefront-ui/root/packages/vue/src/components/organisms/AwMegaMenu/AwMegaMenu.vue";
import AwMenuItem from "@storefront-ui/root/packages/vue/src/components/molecules/AwMenuItem/AwMenuItem.vue";
import AwList from "@storefront-ui/root/packages/vue/src/components/organisms/AwList/AwList.vue";
import AwLink from "@storefront-ui/root/packages/vue/src/components/atoms/AwLink/AwLink.vue";

import {
  categoryGetters,
  useCart,
  useCategory,
  useUser,
  useWishlist,
} from "@vue-storefront/magento";
import {
  computed,
  ref,
  defineComponent,
  useRouter,
  useContext,
  onMounted,
  useFetch,
} from "@nuxtjs/composition-api";
import HeaderNavigationItem from "~/components/Header/Navigation/HeaderNavigationItem.vue";
import { useUiHelpers, useUiState } from "~/composables";
import CurrencySelector from "~/components/CurrencySelector.vue";
import HeaderLogo from "~/components/HeaderLogo.vue";
import SvgImage from "~/components/General/SvgImage.vue";
import StoreSwitcher from "~/components/StoreSwitcher.vue";

export default defineComponent({
  components: {
    HeaderNavigationItem,
    AwOverlay,
    AwHeader,
    AwButton,
    AwBadge,
    AwMegaMenu,
    AwMenuItem,
    AwList,
    AwLink,
    CurrencySelector,
    HeaderLogo,
    StoreSwitcher,
    SvgImage,
    SearchBar: () => import("~/components/Header/SearchBar/SearchBar.vue"),
    SearchResults: () =>
      import(
        /* webpackPrefetch: true */ "~/components/Header/SearchBar/SearchResults.vue"
      ),
  },
  setup() {
    const router = useRouter();
    const { app } = useContext();
    const { toggleCartSidebar, toggleWishlistSidebar, toggleLoginModal } =
      useUiState();
    const { setTermForUrl, getAgnosticCatLink } = useUiHelpers();
    const { isAuthenticated } = useUser();
    const { totalQuantity: cartTotalItems, loadTotalQty: loadCartTotalQty } =
      useCart();
    const {
      itemsCount: wishlistItemsQty,
      loadItemsCount: loadWishlistItemsCount,
    } = useWishlist("GlobalWishlist");

    const { categories: categoryList, search: categoriesListSearch } =
      useCategory("AppHeader:CategoryList");

    const isSearchOpen = ref(false);
    const result = ref(null);

    const currentCategory = ref("");

    const wishlistHasProducts = computed(() => wishlistItemsQty.value > 0);
    const accountIcon = computed(() =>
      isAuthenticated.value ? "profile_fill" : "profile"
    );
    const categoryTree = categoryGetters
      .getCategoryTree(categoryList.value?.[0])
      ?.items.filter((c) => c.count > 0);

    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        await router.push(`${app.localePath("/my-account")}`);
      } else {
        toggleLoginModal();
      }
    };

    useFetch(async () => {
      await categoriesListSearch({ pageSize: 20 });
    });

    onMounted(() => {
      if (app.$device.isDesktop) {
        loadCartTotalQty();
        loadWishlistItemsCount();
      }
    });

    return {
      accountIcon,
      cartTotalItems,
      categoryTree,
      getAgnosticCatLink,
      handleAccountClick,
      isAuthenticated,
      isSearchOpen,
      result,
      setTermForUrl,
      toggleCartSidebar,
      toggleWishlistSidebar,
      wishlistHasProducts,
      wishlistItemsQty,
      currentCategory,
    };
  },
});
</script>

<style lang="scss" scoped>
.sf-header {
  --header-padding: var(--spacer-sm);
  @include for-desktop {
    --header-padding: 0 var(--spacer-sm);
  }

  &__switchers {
    display: flex;
  }
}

.header-on-top {
  z-index: 2;
}

.nav-item {
  --header-navigation-item-margin: 0 var(--spacer-sm);
  font-size: 16px;
  line-height: 24px;
  top: 32px;
  font-family: Source Sans Pro;
  font-weight: 400;
  color: #3c3c3c;

  .sf-header-navigation-item__item--mobile {
    display: none;
  }
}

.cart-badge {
  position: absolute;
  color: #3c3c3c;
  bottom: 40%;
  left: 40%;
}
</style>
