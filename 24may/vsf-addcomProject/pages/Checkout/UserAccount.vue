<template>
  <div class="user">
    <ValidationObserver v-slot="{ handleSubmit, reset, validate }">
      <AwButton
        v-e2e="'continue-to-shipping'"
        class="addd"
        type="submit"
        @click="handleAccountClick"
        v-if="!isAuthenticated"
      >
        {{ $t("Log Into Your Account") }}
      </AwButton>
      <div v-if="!isAuthenticated">
        <p>Or Fill the details below:</p>
      </div>
      <AwHeading
        v-e2e="'user-account-heading'"
        :level="3"
        :title="$t('Personal details')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <form
        novalidate
        @submit.prevent="validate().then(handleSubmit(handleFormSubmit(reset)))"
        v-if="!isAuthenticated"
      >
        <div class="form">
          <ValidationProvider
            v-slot="{ errors }"
            name="firstname"
            :rules="loginUserAccount ? '' : 'required|min:2'"
            slim
          >
            <AwInput
              v-model="form.firstname"
              v-e2e="'user-account-firstName'"
              label="First name"
              name="firstName"
              class="form__element form__element--half"
              :required="!loginUserAccount"
              :disabled="loginUserAccount"
              :valid="!errors[0]"
              :error-message="$t(errors[0])"
            />
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="lastname"
            :rules="loginUserAccount ? '' : 'required|min:2'"
            slim
          >
            <AwInput
              v-model="form.lastname"
              v-e2e="'user-account-lastName'"
              label="Last name"
              name="lastName"
              class="form__element form__element--half form__element--half-even"
              :required="!loginUserAccount"
              :disabled="loginUserAccount"
              :valid="!errors[0]"
              :error-message="$t(errors[0])"
            />
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="email"
            rules="email|required"
            slim
          >
            <AwInput
              v-model="form.email"
              v-e2e="'user-account-email'"
              label="E-mail"
              name="email"
              class="form__element form__element--half"
              required
              :valid="!errors[0]"
              :error-message="$t(errors[0])"
            />
            <ValidationProvider
              v-if="createUserAccount || loginUserAccount"
              v-slot="{ errors }"
              rules="required|min:8|password"
              slim
            >
              <AwInput
                v-model="form.password"
                v-e2e="'user-account-password'"
                name="password"
                label="Password"
                type="password"
                class="
                  form__element form__element--half form__element--half-even
                "
                required
                has-show-password
                :valid="!errors[0]"
                :error-message="$t(errors[0])"
              />
            </ValidationProvider>
            <div v-if="!isAuthenticated">
              <div>
                <p>Enjoy these perks with your free account !</p>
              </div>

              <div class="main">
                <div class="dev">
                  <div>
                    <SvgImage
                      icon="clock"
                      :label="$t('clock')"
                      width="20"
                      height="20"
                      class="clock_i"
                    />
                  </div>

                  <div>
                    <p>
                      Faster <br />
                      Delivery
                    </p>
                  </div>
                </div>

                <div class="dev">
                  <div>
                    <SvgImage
                      icon="credits"
                      :label="$t('credits')"
                      width="20"
                      height="20"
                      class="heart_i"
                    />
                  </div>

                  <div>
                    <p>
                      Earn credits with every <br />
                      purchase
                    </p>
                  </div>
                </div>
              </div>
              <div class="main">
                <div class="dev">
                  <div>
                    <SvgImage
                      icon="rewards"
                      :label="$t('rewards')"
                      width="20"
                      height="20"
                      class="clock_i"
                    />
                  </div>

                  <div>
                    <p>Full rewards program <br />Benefit</p>
                  </div>
                </div>

                <div class="dev">
                  <div>
                    <SvgImage
                      icon="heart"
                      :label="$t('heart')"
                      width="20"
                      height="20"
                      class="heart_i"
                    />
                  </div>

                  <div>
                    <p>Manage your<br />Wishlist</p>
                  </div>
                </div>
              </div>
            </div>
          </ValidationProvider>
          <AwCheckbox
            v-if="createUserAccount"
            v-model="form.is_subscribed"
            v-e2e="'sign-up-newsletter'"
            label="Sign Up for Newsletter"
            name="signupNewsletter"
            class="form__element"
          />
        </div>
        <AwCheckbox
          v-if="!isAuthenticated"
          v-model="createUserAccount"
          v-e2e="'create-account'"
          label="I want to Create  an account"
          name="createUserAccount"
          class="form__element"
          :disabled="loginUserAccount"
        />
        <recaptcha v-if="isRecaptchaEnabled" />
        <div></div>
        <div class="form">
          <div class="form__action">
            <AwButton
              v-e2e="'continue-to-shipping'"
              class="ffff"
              type="submit"
              :disabled="!canMoveForward"
            >
              {{ $t("Go to shipping") }}
            </AwButton>
          </div>
        </div>
      </form>
      <div class="demo">
        <MyProfile v-if="isAuthenticated" />
      </div>
      <div class="form" v-if="isAuthenticated">
        <div class="form__action">
          <AwButton
            v-e2e="'continue-to-shipping'"
            class="ffff"
            type="submit"
            :disabled="!canMoveForward"
            @click="$router.push('/default/checkout/shipping')"
          >
            {{ $t("Go to shipping") }}
          </AwButton>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import SvgImage from "~/components/General/SvgImage.vue";

import AwHeading from "@storefront-ui/root/packages/vue/src/components/atoms/AwHeading/AwHeading.vue";
import AwInput from "@storefront-ui/root/packages/vue/src/components/atoms/AwInput/AwInput.vue";
import AwButton from "@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import AwCheckbox from "@storefront-ui/root/packages/vue/src/components/molecules/AwCheckbox/AwCheckbox.vue";
import { onSSR } from "@vue-storefront/core";
// import ProfileUpdateForm from '../../components/MyAccount/ProfileUpdateForm.vue'
import MyProfile from "../../pages/MyAccount/MyProfile.vue";

import {
  ref,
  computed,
  defineComponent,
  useRouter,
  useContext,
  onMounted,
} from "@nuxtjs/composition-api";
import { useUser, useGuestUser } from "@vue-storefront/magento";
import { required, min, email } from "vee-validate/dist/rules";
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import { useUiNotification } from "~/composables";
import { getItem, mergeItem } from "~/helpers/asyncLocalStorage";
import {
  customerPasswordRegExp,
  invalidPasswordMsg,
} from "../../helpers/customer/regex";

import { useUiState } from "~/composables";

extend("required", {
  ...required,
  message: "This field is required",
});
extend("min", {
  ...min,
  message: "The field should have at least {length} characters",
});
extend("email", {
  ...email,
  message: "Invalid email",
});

extend("password", {
  message: invalidPasswordMsg,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  validate: (value) => customerPasswordRegExp.test(value),
});

export default defineComponent({
  name: "UserAccount",
  components: {
    AwHeading,
    AwInput,
    AwButton,
    AwCheckbox,
    ValidationProvider,
    ValidationObserver,
    SvgImage,
    //  ProfileUpdateForm
    MyProfile,
  },
  setup() {
    const router = useRouter();
    const { app, $recaptcha, $config } = useContext();
    const isRecaptchaEnabled = ref(
      typeof $recaptcha !== "undefined" && $config.isRecaptcha
    );

    const { toggleLoginModal } = useUiState();

    const {
      attachToCart,
      loading: loadingGuestUser,
      error: errorGuestUser,
    } = useGuestUser();

    const {
      load,
      loading: loadingUser,
      register,
      login,
      user,
      isAuthenticated,
      error: errorUser,
    } = useUser();

    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        await router.push(`${app.localePath("/my-account")}`);
      } else {
        toggleLoginModal();
      }
    };

    const { send: sendNotification } = useUiNotification();

    const isFormSubmitted = ref(false);
    const createUserAccount = ref(false);
    const loginUserAccount = ref(false);
    const loading = computed(() => loadingUser.value || loadingGuestUser.value);

    const canMoveForward = computed(() => !loading.value);
    const hasError = computed(
      () => errorUser.value.register || errorGuestUser.value.attachToCart
    );

    const form = ref({
      firstname: isAuthenticated.value ? user.value.firstname : "",
      lastname: isAuthenticated.value ? user.value.lastname : "",
      email: isAuthenticated.value ? user.value.email : "",
      password: "",
      is_subscribed: false,
    });

    const handleFormSubmit = (reset) => async () => {
      if (isRecaptchaEnabled.value) {
        $recaptcha.init();
      }

      if (!isAuthenticated.value) {
        if (isRecaptchaEnabled.value && createUserAccount.value) {
          const recaptchaToken = await $recaptcha.getResponse();
          form.value.recaptchaToken = recaptchaToken;
          form.value.recaptchaInstance = $recaptcha;
        }

        await (!createUserAccount.value
          ? attachToCart({ email: form.value.email })
          : register({ user: form.value }));
      }

      if (loginUserAccount.value) {
        const recaptchaParams = {};
        if (isRecaptchaEnabled.value) {
          recaptchaParams.recaptchaToken = await $recaptcha.getResponse();
        }

        await login({
          user: {
            username: form.value.email,
            password: form.value.password,
            ...recaptchaParams,
          },
        });
      }

      if (!hasError.value) {
        await mergeItem("checkout", { "user-account": form.value });
        await router.push(`${app.localePath("/checkout/shipping")}`);
        reset();
        isFormSubmitted.value = true;
      } else {
        sendNotification({
          id: Symbol("user_form_error"),
          message:
            "Something went wrong during form submission. Please try again later",
          type: "error",
          icon: "error",
          persist: false,
          title: "Error",
        });
      }

      if (isRecaptchaEnabled.value) {
        // reset recaptcha
        $recaptcha.reset();
      }
    };

    onSSR(async () => {
      await load();
      if (isAuthenticated.value) {
        form.value.firstname = user.value.firstname;
        form.value.lastname = user.value.lastname;
        form.value.email = user.value.email;
      }
    });

    onMounted(async () => {
      const checkout = await getItem("checkout");
      if (checkout && checkout["user-account"]) {
        const data = checkout["user-account"];
        // form.value.email = data.email;
        // form.value.firstname = data.firstname;
        // form.value.lastname = data.lastname;
      }
    });

    return {
      canMoveForward,
      createUserAccount,
      errorUser,
      form,
      handleFormSubmit,
      isAuthenticated,
      isFormSubmitted,
      loading,
      loginUserAccount,
      user,
      isRecaptchaEnabled,
      handleAccountClick,
      // saveChanges,
      // ProfileUpdateForm
      MyProfile,
    };
  },
});
</script>

<style lang="scss" scoped>
.form {
  --button-width: 100%;

  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);

    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      color: var(--c-text);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }

    ::v-deep .sf-select__label {
      left: initial;
    }
  }

  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    --button-width: auto;
  }

  &__element {
    margin: 0 0 var(--spacer-xl) 0;
    @include for-desktop {
      flex: 0 0 100%;
    }

    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }

      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
  }

  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }

  &__action-button {
    &--secondary {
      @include for-desktop {
        order: -1;
        text-align: left;
      }
    }

    &--add-address {
      width: 100%;
      margin: 0;
      @include for-desktop {
        margin: 0 0 var(--spacer-lg) 0;
        width: auto;
      }
    }
  }

  &__back-button {
    margin: var(--spacer-xl) 0 var(--spacer-sm);

    &:hover {
      color: var(--c-white);
    }

    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}

.shipping {
  &__label {
    display: flex;
    justify-content: space-between;
  }

  &__description {
    --radio-description-margin: 0;
    --radio-description-font-size: var(--font-xs);
  }
}

.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}

</style>

     
   

  