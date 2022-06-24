<template>
  <AwModal
    v-e2e="'login-modal'"
    :visible="isLoginModalOpen"
    class="modal"
    @close="closeModal"
  >
    <h4 class="signin">
      {{
        isLogin ? "Sign In" : isForgotten ? "Reset Password" : "Register Here"
      }}
    </h4>
    <template #modal-bar>
      <AwBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="barTitle"
        @click:close="closeModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <AwLoader :class="{ loader: loading }" :loading="loading" class="login-loader">
      <div v-if="isLogin">
        <ValidationObserver v-slot="{ handleSubmit, invalid }" key="log-in">
          <form class="form" @submit.prevent="handleSubmit(handleLogin)">
            <ValidationProvider v-slot="{ errors }" rules="required|email">
              <label class="text-uppercase">Your email</label>
              <AwInput
                v-model="form.username"
                v-e2e="'login-modal-email'"
                :error-message="errorMessage"
                @blur="handleBlur()"
                @focus="handleFocus()"
                name="email"
                class="form__element"
              >
                <template #error-message="{ errorMessage }">
                  <div>
                    <p v-if="setShowError">{{ errors[0] }}</p>
                  </div>
                </template>
              </AwInput>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" rules="required">
              <label class="text-uppercase">Password</label>
              <AwInput
                v-model="form.password"
                v-e2e="'login-modal-password'"
                :valid="!errors[0]"
                :error-message="$t(errors[0])"
                name="password"
                type="password"
                has-show-password
                class="form__element"
              />
            </ValidationProvider>
            <vue-recaptcha
              ref="recaptcha"
              :sitekey="sitekey"
              class="g-recaptcha"
              @verify="onVerify"
              :load-recaptcha-script="true"
            />
            <div v-if="error.login">
              {{ $t(error.login) }}
            </div>
            <AwButton
              v-e2e="'login-modal-submit'"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="invalid"
            >
                <div>{{ $t("Login") }}</div>
            </AwButton>
          </form>
        </ValidationObserver>
        <div class="action">
          <AwButton class="sf-button--text" @click="setIsForgottenValue(true)">
            {{ $t("Forgotten password?") }}
          </AwButton>
        </div>
        <div class="bottom">
          <p class="bottom__paragraph">
            {{ $t("No account") }}
          </p>
          <AwButton class="sf-button--text" @click="setIsLoginValue(false)">
            {{ $t("Register today") }}
          </AwButton>
        </div>
      </div>
      <div v-else-if="isForgotten">
        <p>{{ $t("Forgot Password") }}</p>
        <ValidationObserver v-slot="{ handleSubmit }" key="log-in">
          <form class="form" @submit.prevent="handleSubmit(handleForgotten)">
            <ValidationProvider v-slot="{ errors }" rules="required|email">
              <AwInput
                v-model="form.username"
                v-e2e="'forgot-modal-email'"
                :valid="!errors[0]"
                :error-message="$t(errors[0])"
                name="email"
                :label="$t('Forgot Password Modal Email')"
                class="form__element"
              />
            </ValidationProvider>
            <recaptcha v-if="isRecaptchaEnabled" />
            <div v-if="forgotPasswordError.request">
              {{
                $t(
                  "It was not possible to request a new password, please check the entered email address."
                )
              }}
            </div>
            <AwButton
              v-e2e="'forgot-modal-submit'"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="forgotPasswordLoading"
            >
              <AwLoader
                :class="{ loader: forgotPasswordLoading }"
                :loading="forgotPasswordLoading"
              >
                <div>{{ $t("Reset Password") }}</div>
              </AwLoader>
            </AwButton>
          </form>
        </ValidationObserver>
      </div>
      <div v-else-if="isThankYouAfterForgotten" class="thank-you">
        <i18n
          tag="p"
          class="thank-you__paragraph"
          path="forgotPasswordConfirmation"
        >
          <span class="thank-you__paragraph--bold">{{ userEmail }}</span>
        </i18n>
        <p class="thank-you__paragraph">
          {{ $t("Thank You Inbox") }}
        </p>
      </div>
      <div v-else class="form">
        <ValidationObserver v-slot="{ handleSubmit, invalid }" key="sign-up">
          <form
            class="form"
            autocomplete="off"
            @submit.prevent="handleSubmit(handleRegister)"
          >
            <ValidationProvider v-slot="{ errors }" rules="required|email">
              <label class="text-uppercase">Your Email</label>
              <AwInput
                v-model="form.email"
                type="text"
                v-e2e="'login-modal-email'"
                name="email"
                :error-message="errorMessage"
                @blur="handleBlur()"
                @focus="handleFocus()"
                
                class="form__element"
              >
                <template #error-message="{ errorMessage }">
                  <div>
                    <p v-if="setShowError">{{ errors[0] }}</p>
                  </div>
                </template>
              </AwInput>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" rules="required|alpha">
              <label class="text-uppercase">First Name</label>
              <AwInput
                v-model="form.firstName"
                v-e2e="'login-modal-firstName'"
                :valid="!errors[0]"
                :error-message="$t(errors[0])"
                name="first-name"
                
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" rules="required|alpha">
              <label class="text-uppercase">Last Name</label>
              <AwInput
                v-model="form.lastName"
                v-e2e="'login-modal-lastName'"
                :valid="!errors[0]"
                :error-message="$t(errors[0])"
                name="last-name"
                
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" rules="required|password">
              <label class="text-uppercase">Password</label>
              <AwInput
                v-model="form.password"
                v-e2e="'login-modal-password'"
                :valid="!errors[0]"
                :error-message="$t(errors[0])"
                name="password"
                
                type="password"
                has-show-password
                class="form__element"
              />
            </ValidationProvider>
            <AwCheckbox
              v-model="isSubscribed"
              v-e2e="'sign-up-newsletter'"
              :label="$t('Sign Up for Newsletter')"
              name="signupNewsletter"
              class="form__element"
            />
            <ValidationProvider
              v-slot="{ errors }"
              :rules="{ required: { allowFalse: false } }"
            >
              <AwCheckbox
                v-model="createAccount"
                v-e2e="'login-modal-create-account'"
                :valid="!errors[0]"
                :error-message="$t(errors[0])"
                name="create-account"
                :label="$t('I want to create an account')"
                class="form__element"
              />
            </ValidationProvider>
            <recaptcha v-if="isRecaptchaEnabled" />
            <div v-if="error.register">
              {{ $t(error.register) }}
            </div>
            <AwButton
              v-e2e="'login-modal-submit'"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="loading || !createAccount || invalid"
            >
              <AwLoader :class="{ loader: loading }" :loading="loading">
                <div>{{ $t("Create an account") }}</div>
              </AwLoader>
            </AwButton>
          </form>
        </ValidationObserver>
        <div class="action">
          {{ $t("or") }}
          <AwButton
            v-e2e="'login-modal-login-to-your-account'"
            class="sf-button--text"
            @click="setIsLoginValue(true)"
          >
            {{ $t("login in to your account") }}
          </AwButton>
        </div>
      </div>
      </AwLoader>
    </transition>
  </AwModal>
</template>
<script>
import {
  ref,
  watch,
  reactive,
  defineComponent,
  computed,
  useContext,
} from "@nuxtjs/composition-api";
import AwModal from "@storefront-ui/root/packages/vue/src/components/molecules/AwModal/AwModal.vue";
import AwBar from "@storefront-ui/root/packages/vue/src/components/molecules/AwBar/AwBar.vue";
import AwInput from "@storefront-ui/root/packages/vue/src/components/atoms/AwInput/AwInput.vue";
import AwCheckbox from "@storefront-ui/root/packages/vue/src/components/molecules/AwCheckbox/AwCheckbox.vue";
import AwButton from "@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import AwLoader from "@storefront-ui/root/packages/vue/src/components/atoms/AwLoader/AwLoader.vue";

import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import { required, email, alpha } from "vee-validate/dist/rules";
import {
  useUser,
  useForgotPassword,
  useWishlist,
  useCart,
} from "@vue-storefront/magento";
import { useUiState } from "~/composables";
import {
  customerPasswordRegExp,
  invalidPasswordMsg,
} from "~/helpers/customer/regex";
import { VueRecaptcha } from "vue-recaptcha";

extend("email", {
  ...email,
  message: "Invalid email",
});

extend("required", {
  ...required,
  message: "This field is required",
});
extend("alpha", {
  ...alpha,
  message: "Please enter only character",
});

extend("password", {
  message: invalidPasswordMsg,
  validate: (value) => customerPasswordRegExp.test(value),
});

export default defineComponent({
  name: "LoginModal",
  components: {
    AwModal,
    AwInput,
    AwButton,
    AwCheckbox,
    AwLoader,
    ValidationProvider,
    ValidationObserver,
    AwBar,
    VueRecaptcha,
  },
  data() {
    return {
      showError: true,
      disabled: true,
    };
  },
  computed: {
    setShowError() {
      return this.showError;
    },
    isDisabled() {
      if (!form.username == "" && !form.password == "") this.disabled = "false";
    },
  },
  methods: {
    handleBlur() {
      this.showError = !this.showError;
    },
    handleFocus() {
      this.showError = false;
    },
  },
  setup() {
    const { isLoginModalOpen, toggleLoginModal } = useUiState();
    const isSubscribed = ref(false);
    const form = ref({});
    const isLogin = ref(true);
    const createAccount = ref(false);
    const rememberMe = ref(false);
    const isForgotten = ref(false);
    const isThankYouAfterForgotten = ref(false);
    const userEmail = ref("");
    const sitekey = ref("6LeOaIMfAAAAANi5IpB6gvEn4wx_axuz0_0VaK2V");
    const { $recaptcha, $config } = useContext();
    const isRecaptchaEnabled = ref(
      typeof $recaptcha !== "undefined" && $config.isRecaptcha
    );

    const { register, login, loading, error: userError } = useUser();

    const { load: loadCart } = useCart();
    const { loadItemsCount } = useWishlist("GlobalWishlist");
    const {
      request,
      error: forgotPasswordError,
      loading: forgotPasswordLoading,
    } = useForgotPassword();

    const barTitle = computed(() => {
      if (isLogin.value) {
        return "Sign in";
      }
      if (isForgotten.value || isThankYouAfterForgotten.value) {
        return "Reset Password";
      }
      return "Register";
    });

    const error = reactive({
      login: null,
      register: null,
    });

    const resetErrorValues = () => {
      error.login = null;
      error.register = null;
    };

    watch(isLoginModalOpen, () => {
      if (isLoginModalOpen) {
        form.value = {};
        resetErrorValues();
      }
    });

    const setIsLoginValue = (value) => {
      resetErrorValues();
      isLogin.value = value;
    };

    const setIsForgottenValue = (value) => {
      resetErrorValues();
      isForgotten.value = value;
      isLogin.value = !value;
      isThankYouAfterForgotten.value = value;
    };

    const closeModal = () => {
      setIsForgottenValue(false);
      setIsLoginValue(true);
      toggleLoginModal();
    };

    const handleForm = (fn) => async () => {
      resetErrorValues();

      if (isRecaptchaEnabled.value) {
        $recaptcha.init();
      }

      if (isRecaptchaEnabled.value) {
        const recaptchaToken = await $recaptcha.getResponse();
        form.value.recaptchaInstance = $recaptcha;

        await fn({
          user: {
            ...form.value,
            is_subscribed: isSubscribed.value,
            recaptchaToken,
          },
        });
      } else {
        await fn({
          user: {
            ...form.value,
            is_subscribed: isSubscribed.value,
          },
        });
      }

      const hasUserErrors = userError.value.register || userError.value.login;
      if (hasUserErrors) {
        error.login = userError.value.login?.message;
        error.register = userError.value.register?.message;
        return;
      }
      toggleLoginModal();

      if (isRecaptchaEnabled.value) {
        // reset recaptcha
        $recaptcha.reset();
      }
    };

    const handleRegister = async () => handleForm(register)();

    const handleLogin = async () => {
      await handleForm(login)();
      await Promise.all([loadItemsCount("GlobalWishlist"), loadCart()]);
    };

    const handleForgotten = async () => {
      userEmail.value = form.value.username;

      if (isRecaptchaEnabled.value) {
        $recaptcha.init();
      }

      if (isRecaptchaEnabled.value) {
        const recaptchaToken = await $recaptcha.getResponse();

        await request({ email: userEmail.value, recaptchaToken });
      } else {
        await request({ email: userEmail.value });
      }

      if (!forgotPasswordError.value.request) {
        isThankYouAfterForgotten.value = true;
        isForgotten.value = false;
      }

      if (isRecaptchaEnabled.value) {
        // reset recaptcha
        $recaptcha.reset();
      }
    };

    const onEvent = () => {
      // when you need a reCAPTCHA challenge
      this.$refs.recaptcha.execute();
    };

    const onVerify = (response) => {
      console.log("Verify: " + response);
    };

    return {
      barTitle,
      closeModal,
      createAccount,
      error,
      forgotPasswordError,
      forgotPasswordLoading,
      form,
      handleForgotten,
      handleLogin,
      handleRegister,
      isForgotten,
      isLogin,
      isLoginModalOpen,
      isSubscribed,
      isThankYouAfterForgotten,
      loading,
      rememberMe,
      setIsForgottenValue,
      setIsLoginValue,
      userEmail,
      userError,
      isRecaptchaEnabled,
      onEvent,
      onVerify,
      sitekey,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal {
  --modal-index: 3;
  --overlay-z-index: 3;
}

.form {
  margin-top: var(--spacer-sm);

  &__element {
    margin: 0 0 var(--spacer-sm) 0;
  }
}

.action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--secondary);

  & > * {
    margin: 0 0 0 var(--spacer-xs);
  }
}

.action {
  margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
}

.checkbox {
  margin-bottom: var(--spacer-2xl);
}

.bottom {
  text-align: center;
  margin-bottom: var(--spacer-lg);
  font-size: var(--h3-font-size);
  font-weight: var(--font-weight--semibold);
  font-family: var(--font-family--secondary);

  &__paragraph {
    color: var(--c-primary);
    margin: 0 0 var(--spacer-base) 0;
    @include for-desktop {
      margin: 0;
    }
  }
}
.thank-you {
  &__paragraph {
    &--bold {
      font-weight: var(--font-weight--semibold);
    }
  }
}

.g-recaptcha {
  display: flex;
  justify-content: center;
  margin-bottom: 2px;
}
</style>
<style lang="scss">
.sf-modal__container {
  border-radius: 20px;
  background-color: #faf8f3;
}
.signin {
  text-align: center;
  color: rgb(57, 57, 218);
  font-size: 27px;
}
.sf-button {
  font-size: 18px;
}
.sf-input input {
  //outline: solid rgb(57, 57, 218);
  border-block-style: initial;
  border-radius: 3px;
  border:1px black solid;
  margin: 0px;
}
.login-loader {
  margin-top: 20px;
  margin-bottom: 50px;
}
</style>
