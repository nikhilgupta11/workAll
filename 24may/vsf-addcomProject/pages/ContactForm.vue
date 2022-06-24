<template>
  <div class="contacts-content-form">
    <h2 style="text-align: center">Contact Us</h2>
    <ValidationObserver v-slot="{ handleSubmit }" key="log-in">
      <form class="contact-form" @submit.prevent="handleSubmit()">
        <ValidationProvider rules="required|alpha" v-slot="{ errors }">
          <input
            v-model="user"
            type="text"
            class="sf-input"
            placeholder="Your Name"
          />
          <span class="red">{{ errors[0] }}</span> </ValidationProvider
        ><br />
        <ValidationProvider rules="required|email" v-slot="{ errors }">
          <input
            v-model="email"
            class="sf-input"
            name="email"
            placeholder="Your E-mail Address"
          />
          <span class="red">{{ errors[0] }}</span> </ValidationProvider
        ><br />
        <ValidationProvider
          rules="required|numeric|min:10|max:10"
          v-slot="{ errors }"
        >
          <input
            v-model="mobile"
            class="sf-input"
            name="telephone"
            placeholder="Your Phone"
          />
          <span class="red">{{ errors[0] }}</span> </ValidationProvider
        ><br />
        <ValidationProvider rules="required|max:250" v-slot="{ errors }">
          <textarea class="sf-input" v-model="msg" placeholder="Your Message" />
          <!-- <label for="msg">Your Message</label> -->
          <span class="red">{{ errors[0] }}</span>
        </ValidationProvider>
        <AwButton class="color-secondary sf-button">
          {{ $t("Submit") }}
        </AwButton>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationProvider, extend, ValidationObserver } from "vee-validate";
import {
  required,
  email,
  alpha,
  numeric,
  min,
  max,
} from "vee-validate/dist/rules";

// import AwInput from "@storefront-ui/root/packages/vue/src/components/atoms/AwInput/AwInput.vue";
import AwButton from "@storefront-ui/root/packages/vue/src/components/atoms/AwButton/AwButton.vue";
import { defineComponent,ref } from "@nuxtjs/composition-api";
extend("required", {
  ...required,
  message: "This field is required",
});
extend("email", {
  ...email,
  message: "Invalid E-mail",
});
extend("alpha", {
  ...alpha,
  message: "Name should contain alphabetic characters only",
});
extend("numeric", {
  ...numeric,
  message: "Number should contain numeric value only",
});
extend("min", {
  ...min,
  message: "Mobile Number must be 10 digit only",
});
extend("max", {
  ...max,
  message: "Mobile Number must be 10 digit only",
});
export default defineComponent({
  name: "ContactUs",
  components: {
    // AwInput,
    ValidationProvider,
    AwButton,
    extend,
    ValidationObserver,
  },

  setup(){
    const user =ref('');
    const msg =ref('');
    const email =ref('');
    const mobile =ref('');

    return{
      msg,
      email,
      user,
      mobile,
    }
  },


});
</script>

<style lang="scss" scoped>
.contacts-content-form {
  width: 475px;
  padding: 0.5rem;
  margin-left: 100px;
}
.contact-form {
  margin-top: 50px;
  padding: 0.5rem;
}
.sf-button {
  margin-left: 170px;
  margin-top: 30px;
  background-color: rgb(49, 98, 190);
}
.sf-input {
  width: 475px;
  padding: 1rem;
  font-size: 1rem;
  border-top: 0.5rem rgb(3, 3, 3);
  border-left: 0.5rem rgb(3, 3, 3);
  border-right: 0.5rem rgb(3, 3, 3);
  border-bottom: 0.1rem solid rgb(3, 3, 3);
}
.red {
  color: red;
}
</style>
