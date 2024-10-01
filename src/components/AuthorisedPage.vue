<template>
  <div class="mdWrapper">
    <h3>Keycloak - OIDC</h3>
    <h4>Vue JS - Implicit flow authentication</h4>
    <h5>{{ username }}</h5>
  </div>
</template>

<script>
import KeycloakService from '../services/KeycloakService';

export default {
  name: 'AuthorisedPage',
  data() {
    return {
      username: '',
    };
  },
  created() {
    this.initializeKeycloak();
  },
  methods: {
    initializeKeycloak() {
      const keycloakService = new KeycloakService();
      const token = keycloakService.getCookieValue(keycloakService.cookieName);

      if (!token) {
        this.$router.push({ name: 'Home' });
      } else {
        const parsedToken = keycloakService.parseToken(token);
        this.username = parsedToken?.preferred_username || 'Unknown User';
      }
    }
  }
};
</script>
