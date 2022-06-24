<template>
  <div id="help">
    <AwBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <AwContentPages
      v-e2e="'help-content-pages'"
      :title="$t('Help')"
      class="help"
      :active="activePage"
      @click:change="changeActivePage"
    >
      <AwContentPage :title="$t('About us')">
        <AboutUs />
      </AwContentPage>

      <AwContentPage :title="$t('Customer Service')">
        <CustomerService />
      </AwContentPage>

      <AwContentPage :title="$t('Store Locator')">
        <StoreLocator />
      </AwContentPage>

      <AwContentPage :title="$t('Delivery Details')">
        <Delivery />
      </AwContentPage>

      <AwContentPage :title="$t('Return Policy')">
        <ReturnPolicy />
      </AwContentPage>

      <SfContentPage :title="$t('Privacy Policy')">
        <PrivacyPolicy />
      </SfContentPage>

      <AwContentPage :title="$t('Size Guide')">
        <SizeGuide />
      </AwContentPage>
      <AwContentPage :title="$t('Contact Us')">
        <ContactForm />
      </AwContentPage>
    </AwContentPages>
  </div>
</template>
<script>
import AwBreadcrumbs from "@storefront-ui/root/packages/vue/src/components/atoms/AwBreadcrumbs/AwBreadcrumbs.vue";
import AwContentPages from "@storefront-ui/root/packages/vue/src/components/organisms/AwContentPages/AwContentPages.vue";
import {
  useRoute,
  useRouter,
  useContext,
  computed,
  onBeforeUnmount,
  defineComponent,
  ref,
} from "@nuxtjs/composition-api";
import {
  mapMobileObserver,
  unMapMobileObserver,
} from "@storefront-ui/vue/src/utilities/mobile-observer.js";

import CustomerService from "./Help/CustomerService.vue";
import ContactForm from "./ContactForm.vue";
import AboutUs from "./Help/AboutUs.vue";
import Delivery from "./Help/Delivery.vue";
import PrivacyPolicy from "./Help/PrivacyPolicy.vue";
import ReturnPolicy from "./Help/ReturnPolicy.vue";
import SizeGuide from "./Help/SizeGuide.vue";
import StoreLocator from "./Help/StoreLocator.vue";

export default defineComponent({
  name: "Help",

  components: {
    AwContentPages,
    CustomerService,
    AwBreadcrumbs,
    ContactForm,
    AboutUs,
    Delivery,
    PrivacyPolicy,
    ReturnPolicy,
    SizeGuide,
    StoreLocator,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { localePath, app } = useContext();
    const isMobile = computed(() => mapMobileObserver().isMobile.get());

    const breadcrumbs = ref([
      {
        text: app.i18n.t("Home"),
        link: "/default",
      },
      {
        text: app.i18n.t("Help"),
        link: "#",
      },
    ]);

    const activePage = computed(() => {
      const { pageName } = route.value.params;
      if (pageName) {
        return (pageName.charAt(0).toUpperCase() + pageName.slice(1)).replace(
          "-",
          " "
        );
      }

      if (!isMobile.value) {
        return app.i18n.t("About us");
      }
      return " ";
    });

    const changeActivePage = async (title) => {
      const slugifiedTitle = (title || "").toLowerCase().replace(" ", "-");

      const transformedPath = `/help/${slugifiedTitle}`;
      await router.push(`${localePath(transformedPath)}`);
    };

    onBeforeUnmount(() => {
      unMapMobileObserver();
    });

    return {
      changeActivePage,
      activePage,
      breadcrumbs,
    };
  },
});
</script>

<style lang="scss" scoped>
#help {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.help {
  @include for-mobile {
    --content-pages-sidebar-category-title-font-weight: var(
      --font-weight--normal
    );
    --content-pages-sidebar-category-title-margin: var(--spacer-sm)
      var(--spacer-sm) var(--spacer-sm) var(--spacer-sm);
  }
  @include for-desktop {
    --content-pages-sidebar-category-title-margin: var(--spacer-xl) 0 0 0;
  }
}
.breadcrumbs {
  margin: var(--spacer-base) 0 var(--spacer-lg);
  display: flex;
  align-items: center;
}

.breadcrumbs .sf-breadcrumbs__list-item a {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #3c3c3c;
}
.sf-content-pages {
  height: auto;
}
::v-deep .sf-content-pages__content {
  height: auto;
}
.sf-content-pages__content {
  height: auto;
}
</style>
