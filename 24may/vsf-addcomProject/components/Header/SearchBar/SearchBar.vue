<template>
  <AwSearchBar
    v-click-outside="closeSearch"
    :placeholder="$t('Search for items and promotions')"
    aria-label="Search"
    class="sf-header__search"
    :value="term"
    @input="handleSearch"
    :icon='{"icon":"search","size":"1.25rem","color":"#43464E"}'
    @keydown.enter="handleSearch($event)"
    @keydown.tab="showSearch"
    @keydown="showSearch"
    @focus="showSearch"
    @click="hideSearch"
    @keydown.esc="closeSearch"
  >
    <template #icon>
      <AwButton
        v-if="!!term"
        class="sf-search-bar__button sf-button--pure"
        aria-label="Close search"
        @click="closeSearch"
      >
        <span class="sf-search-bar__icon">
          <SvgImage
            icon="cross"
            :label="$t('Cancel')"
            width="20"
            height="20"
          />
        </span>
      </AWButton>
      <AwButton
        v-else
        class="sf-search-bar__button sf-button--pure"
        aria-label="Open search"
        @click="toggleSearch"
        @keydown.tab="hideSearch"
      >
        <span class="sf-search-bar__icon">
          <SvgImage
            icon="search"
            :label="$t('Search')"
            width="20"
            height="20"
          />
        </span>
      </AwButton>
    </template>
  </AwSearchBar>
</template>

<script>
import { SfButton, SfSearchBar } from '@storefront-ui/vue';
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { clickOutside } from '~/utilities/directives/click-outside/click-outside-directive.js';
import SvgImage from '~/components/General/SvgImage.vue';
import AwButton from '@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue';
import AwSearchBar from '@storefront-ui/root/packages/vue/src/components/molecules/AwSearchBar/AwSearchBar.vue';
import debounce from 'lodash.debounce';
import {
  categoryGetters,
  useCategorySearch,
  useFacet,
} from '@vue-storefront/magento';
import { watch, useRoute } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'SearchBar',
  components: {
    SfButton,
    SfSearchBar,
    AwButton,
    AwSearchBar,
    SvgImage,
  },
  directives: { clickOutside },
  props: {
    itemsPerPage: {
      type: Number,
      default: 12,
    },
    minTermLen: {
      type: Number,
      default: 3,
    },
  },
  setup({ itemsPerPage, minTermLen }, { emit }) {
    const term = ref('');
    const isSearchOpen = ref(false);
    const result = ref(null);

    const route = useRoute()

    const {
      result: searchResult,
      search: productsSearch,
    } = useFacet('AppHeader:Products');

    const {
      result: categories,
      search: categoriesSearch,
    } = useCategorySearch('AppHeader:Categories');

    const showSearch = () => {
      if (!isSearchOpen.value) {
        isSearchOpen.value = true;
        emit('SearchBar:toggle', true);
        if (document) {
          document.body.classList.add('no-scroll');
        }
      }
    };

    const hideSearch = () => {
      if (isSearchOpen.value) {
        isSearchOpen.value = false;
        emit('SearchBar:toggle', false);
        emit('SearchBar:result', {});
        if (document) {
          document.body.classList.remove('no-scroll');
        }
      }
    };

    const toggleSearch = () => {
      if (isSearchOpen.value) {
        hideSearch();
      } else {
        showSearch();
      }
    };

    const closeSearch = (event) => {
      if (document) {
        const searchResultsEl = document.getElementsByClassName('search');
        if (searchResultsEl && searchResultsEl[0] && !searchResultsEl[0].contains(event.target)) {
          hideSearch();
          term.value = '';
        }
      } else {
        hideSearch();
        term.value = '';
      }
    };

    const handleSearch = debounce(async (paramValue) => {
      term.value = !paramValue.target ? paramValue : paramValue.target.value;
      if (term.value.length < minTermLen) return;

      await Promise.all([
        productsSearch({
          itemsPerPage,
          term: term.value,
        }),
        categoriesSearch({ filters: { name: { match: `${term.value}` } } }),
      ]);

      result.value = {
        products: searchResult.value?.data?.items,
        categories: (categories?.value ?? [])
          .map((element) => categoryGetters.getCategoryTree(element)),
      };
      let searchResultArray = []
      for (var i=0; i < result.value.products.length; i++) {
        // console.log(result.value.products[i].name)
        var match_var = RegExp(term.value, "ig");
        if (result.value.products[i].name.match(match_var)!==null){
         console.log(result.value.products[i].name.match(term.value))
         searchResultArray.push(result.value.products[i]);
        }
      } 
      // console.log(result.value);
      console.log('productstest')
      console.log(result.value.products);
      console.log(searchResultArray)
      result.value.products = searchResultArray;
      emit('SearchBar:result', result.value);
    }, 1000);

    watch(route, () => {
      hideSearch();
      term.value = '';
    });

    return {
      closeSearch,
      showSearch,
      hideSearch,
      toggleSearch,
      handleSearch,
      isSearchOpen,
      term,
    };
  },
});

</script>

<style lang="scss" scoped>
.sf-search-bar__button {
  position: relative;
  right: 20px;
  bottom: 0;
}
.sf-header__search
{
  color:#3C3C3C;
  border-bottom: 274px ;
}
</style>