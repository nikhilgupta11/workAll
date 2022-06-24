<template>
  <AwTopBar class="topbar">
    <template #left>
      <AwButton class="sf-button--text" style="width: 82px; color: #037ee6">
        <router-link to="default/help">
          {{ $t("Help & FAQs") }}
        </router-link>
      </AwButton>
    </template>
    <template #center>
      <p>{{ $t("Download our application. ") }}</p>
      <AwButton class="topbar__button sf-button--text">
        {{ $t("Find out more") }}
      </AwButton>
    </template>
    <template #right>
     
      <CurrencySelector />
      <StoreSwitcher />
    </template>
  </AwTopBar>
</template>

<script>
import SvgImage from "~/components/General/SvgImage.vue";
import CurrencySelector from "./CurrencySelector";
import StoreSwitcher from "./StoreSwitcher";
import AwButton from "@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import AwTopBar from "@storefront-ui/root/packages/vue/src/components/organisms/AwTopBar/AwTopBar.vue";
export default {
  components: {
    CurrencySelector,
    AwButton,
    AwTopBar,
    SvgImage,
    StoreSwitcher,
  },
};
</script>
<style lang="scss" scoped>
.topbar {
  position: relative;
  z-index: 2;
  &__button {
    margin: 0 0 0 var(--spacer-xs);
  }
}
.sf-button--text {
  width: 92px;
  height: 22px;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  // font-family: Source Sans Pro;
  &:hover {
    color: rgb(20, 115, 223);
  }
}
p {
  width: 178px;
  height: 22px;
  left: 580px;
  top: 9px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  // font-family: Source Sans Pro;
}
.hide {
  visibility: hidden;
  margin-right: 5px;
}
.sf-button--pure {
  margin-right: 20px;
  &:hover .hide {
    visibility: visible;
  }
}
</style>