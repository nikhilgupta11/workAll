<template>
  <AwSection
    :title-heading="$t('Share Your Look')"
    subtitle-heading="#YOURLOOK"
    class="title"
  >
    <div class="grid grid-images">

      <div class="grid__row">
        <div class="grid__col container">
          <nuxt-img
            v-if="isMobile"
            src="/homepage/imageAm.webp "
            alt="katherina_trn"
            loading="lazy"
            :width="163"
            :height="220"
          />
          <nuxt-img
            v-else
            src="/homepage/img1.png"
            class="img-opacity"
            alt="katherina_trn"
            loading="lazy"
            :width="470"
            :height="470"
            
          />
          <div class="middle">
            <div class="text">@instagram</div>
          </div>
        </div>

        <div class="grid__col small container">
          <nuxt-img
            v-if="isMobile"
            src="/homepage/imageBm.webp"
            alt="katherina_trn"
            loading="lazy"
            :width="162"
            :height="162"
          />
          <nuxt-img
            v-else
            src="/homepage/img2.png"
            class="img-opacity"
            alt="katherina_trn"
            loading="lazy"
            :width="470"
            :height="160"
          />
          <div class="middle">
            <div class="text">@instagram</div>
          </div>
      </div>
        </div>
        
      <div class="grid__row">
        <div class="grid__col small container">
          <nuxt-img
            v-if="isMobile"
            src="/homepage/imageCm.webp"
            alt="katherina_trn"
            loading="lazy"
            :width="163"
            :height="220"
          />
          <nuxt-img
            v-else
            class="img-opacity"
            src="/homepage/img3.png"
            alt="katherina_trn"
            loading="lazy"
            :width="470"
            :height="160"
          />
          <div class="middle">
            <div class="text">@instagram</div>
          </div>
        </div>
        <div class="grid__col container" >
          <nuxt-img
            v-if="isMobile"
            src="/homepage/imageDm.webp"
            alt="katherina_trn"
            loading="lazy"
            :width="162"
            :height="162"
          />
          <nuxt-img
            v-else
            class="img-opacity"
            src="/homepage/img4.png"
            alt="katherina_trn"
            loading="lazy"
            :width="470"
            :height="470"
          />
          <div class="middle">
            <div class="text">@instagram</div>
          </div>
        </div>

      </div>

    </div>

    </AwSection>
</template>
<script>
import AwSection from "@storefront-ui/root/packages/vue/src/components/molecules/AwSection/AwSection.vue";
import {
  mapMobileObserver,
  unMapMobileObserver,
} from "@storefront-ui/vue/src/utilities/mobile-observer.js";
import {
  computed,
  defineComponent,
  onBeforeUnmount,
} from "@nuxtjs/composition-api";

export default defineComponent({
  name: "InstagramFeed",
  components: {
    AwSection,
  },
  setup() {
    const isMobile = computed(() => mapMobileObserver().isMobile.get());

    onBeforeUnmount(() => {
      unMapMobileObserver();
    });

    return { isMobile };
  },
});
</script>
<style lang="scss" scoped>
.title {
  --heading-title-font-weight: var(--font-weight--semibold);
  --section-margin: var(--spacer-xl) 0;
  --section-content-margin: var(--spacer-xl) 0;
  --heading-title-font-size: var(--h2-font-size);
  @include for-desktop {
    --section-margin: var(--spacer-2xl) 0;
    --section-content-margin: var(--spacer-2xl) 0;
  }
}
.grid {
  display: flex;
  max-height: 20.625rem;
  width: 100%;
  justify-content: center;
  margin: 0;
  @include for-desktop {
    max-height: 40.625rem;
    max-width: 60rem;
    margin: 0 auto;
  }
  &__row {
    display: flex;
    flex-direction: column;
    & + & {
      margin-left: var(--spacer-xs);
      @include for-desktop {
        margin-left: var(--spacer-sm);
      }
    }
  }
  &__col {
    width: 10rem;
    height: 10rem;
    @include for-desktop {
      &.small {
        height: 10rem;
      }
      width: 29.375rem;
      height: 29.375rem;
    }
    & + & {
      margin-top: var(--spacer-xs);
      @include for-desktop {
        margin-top: var(--spacer-sm);
      }
    }
  }
}
.img-opacity:hover{
  opacity: 0.6;
}
.grid__col {
  background-color: #282828;
  
}
.container {
  position: relative;
  
}



.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}


.container:hover .middle {
  opacity: 0.6;
}

.text {
  
  color: #FFFFFF;
  font-size: 16px;
  padding: 16px 32px;
}
</style>
