<template>
  <v-container fill-height>
    <v-layout class="align-center">
      <v-card width="100%" color="blue-grey lighten-5" class="d-flex flex-column">
        <v-card-title class="justify-center">Login using Facial Recognition</v-card-title>
        <v-card-actions class="justify-center">
          <form class="d-flex flex-column">
            <v-text-field
              v-model="login"
              label="E-mail"
              placeholder="Vul hier je e-mail adres in"
              outlined
              dense
            ></v-text-field>

            <v-text-field
              :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show3 ? 'text' : 'password'"
              name="input-10-2"
              label="Wachtwoord"
              placeholder="Vul hier je wachtwoord in"
              hint="At least 8 characters"
              value
              outlined
              dense
              class="input-group--focused"
              @click:append="show3 = !show3"
            ></v-text-field>
            <v-btn class="text-lowercase" rounded color="warning" dark>Klik hier om in te loggen</v-btn>
          </form>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      login: "",
      show1: false,
      show2: true,
      show3: false,
      show4: false,
      password: "Password",
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        emailMatch: () => "The email and password you entered dont match"
      }
    };
  }
};
</script>

<style scoped>
</style>