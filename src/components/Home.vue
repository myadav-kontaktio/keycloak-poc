<template>
  <div class="mdWrapper">
    <h3>Keycloak - OIDC</h3>
    <h4>Vue JS - Implicit flow authentication</h4>
    <button class="btn-normal" @click="authenticateLogin">Login</button>
  </div>
</template>

<script>
import KeycloakService from '../services/KeycloakService';

export default {
  name: 'Home',
  data() {
    return {
      keycloakService: null,
    };
  },
  created() {
    this.keycloakService = new KeycloakService();
    this.initializeKeycloak();
  },
  methods: {
    initializeKeycloak() {
      this.keycloakService.keycloak.init({ flow: 'implicit', checkLoginIframe: false })
        .then(authenticated => {
          if (!authenticated) {
            console.log("Not Authenticated");
            return;
          }
          console.log("Authenticated");
          this.keycloakService.setCookieValue(this.keycloakService.cookieName, this.keycloakService.keycloak.token);
          this.$router.push({ name: 'AuthorisedPage' });
        })
        .catch(error => {
          console.log("Authentication failed due to:", error);
        });
    },
    authenticateLogin() {
      this.keycloakService.keycloak.login({ redirectUri: window.location.origin });
    }
  }
};
</script>
