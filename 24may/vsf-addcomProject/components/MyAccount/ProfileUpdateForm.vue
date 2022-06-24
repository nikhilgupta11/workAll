<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form
      class="form"
      @submit.prevent="handleSubmit(submitForm(reset))"
    >
      <div class="form__horizontal profile">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2"
          class="form__element"
        >
          <AwInput
            v-model="form.firstname"
            name="firstName"
            :label="$t('First Name')"
            @input="changeDisable()"
            
            required
            :valid="!errors[0]"
            :error-message="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2"
          class="form__element"
        >
          <AwInput
            v-model="form.lastname"
            name="lastName"
            :label="$t('Last Name')"
            required
            :valid="!errors[0]"
            :error-message="$t(errors[0])"
             @input="changeDisable()"
          />
        </ValidationProvider>
      </div>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|email"
        class="form__element profile"
      >
        <AwInput
          v-model="form.email"
          type="email"
          name="email"
          :label="$t('Your e-mail')"
          required
          :valid="!errors[0]"
          :error-message="$t(errors[0])"
           @input="changeDisable()"
        />
      </ValidationProvider>
      <AwModal
        :visible="requirePassword"
        :title="$t('Attention!')"
        cross
        persistent
        @close="requirePassword = false"
      >
        {{ $t('Please type your current password to change your email address.') }}
        <AwInput
          v-model="currentPassword"
          type="password"
          name="currentPassword"
          :label="$t('Current Password')"
          required
          class="form__element"
          style="margin-top: 10px"
          @keypress.enter="handleSubmit(submitForm(reset))"
        />
        <AwButton
          class="form__button"
          @click="handleSubmit(submitForm(reset))"
        >
          {{ $t('Save Changes') }}
        </AwButton>
      </AwModal>
      <div 
        v-if="requirePassword"
        class="smartphone-only"
      >
        {{ $t('Please type your current password to change your email address.') }}
        <AwInput
          v-model="currentPassword"
          type="password"
          name="currentPassword"
          :label="$t('Current Password')"
          required
          class="form__element"
          style="margin-top: 10px"
          @keypress.enter="handleSubmit(submitForm(reset))"
        />
        <AwButton
          class="form__button"
          @click="handleSubmit(submitForm(reset))"
          
        >
          {{ $t('Save Changes') }}
        </AwButton>
      </div>

      <AwButton v-if="!requirePassword" class="form__button .color-primary. sf-button "
       :class="$route.fullPath == '/default/checkout/user-account'? 'is-disabled--button':''"
       @click="changeDisable()">

        {{ $t('Save Changes') }}
      </AwButton>
    </form>
  </ValidationObserver>
</template>

<script>
import { defineComponent, ref, route } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { email } from 'vee-validate/dist/rules';
import { useUser, userGetters } from '@vue-storefront/magento';

import AwInput from "@storefront-ui/root/packages/vue/src/components/atoms/AwInput/AwInput.vue";
import AwButton from "@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import AwModal from "@storefront-ui/root/packages/vue/src/components/molecules/AwModal/AwModal.vue";


import { useUiNotification } from '~/composables';

extend('email', {
  ...email,
  message: 'The email field must be a valid email',
});

export default defineComponent({
  name: 'ProfileUpdateForm',
  components: {
    AwInput,
    AwButton,
    AwModal,
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const { user } = useUser();
    const currentPassword = ref('');
    const requirePassword = ref(false);
    const resetForm = () => ({
      firstname: userGetters.getFirstName(user.value),
      lastname: userGetters.getLastName(user.value),
      email: userGetters.getEmailAddress(user.value),
    });
    const {
      send: sendNotification,
    } = useUiNotification();

    const form = ref(resetForm());
    const changeDisable = () => {
    document.querySelector(".form__button").classList.remove("is-disabled--button")
     document.querySelector(".form__button").classList.add("check")
}

    const submitForm = (resetValidationFn) => () => {
      const onComplete = () => {
        form.value = resetForm();
        requirePassword.value = false;
        currentPassword.value = '';
        sendNotification({
          id: Symbol('user_updated'),
          message: 'The user account data was successfully updated!',
          type: 'success',
          icon: 'check',
          persist: false,
          title: 'User Account',
        });
        resetValidationFn();
      };

      const onError = () => {
        form.value = resetForm();
        requirePassword.value = false;
        currentPassword.value = '';
      };

      if (
        userGetters.getEmailAddress(user.value) !== form.value.email
        && !requirePassword.value
      ) {
        requirePassword.value = true;
      } else {
        if (currentPassword.value) {
          form.value.password = currentPassword.value;
        }

        emit('submit', { form, onComplete, onError });
      }
    };

    return {
      requirePassword,
      currentPassword,
      form,
      submitForm,
      changeDisable,
      route 
    };
  },
});
</script>
<style lang='scss' scoped>
.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }
  &__button {
    display: block;
    width: 100%;
    @include for-desktop {
      width: 17.5rem;
    }
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-2xl);
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
