import Keycloak from 'keycloak-js';

export default class KeycloakService {
  constructor() {
    this.cookieName = 'Keycloak_Auth';
    this.config = {
      url: 'http://localhost:8080/auth',
      realm: 'master',
      clientId: 'iris-app',
      onLoad: 'login-required'
    };

    this.keycloak = new Keycloak(this.config);
  }

  init(successCallback, failureCallback) {
    this.keycloak.init({ flow: 'implicit', checkLoginIframe: false }).then((authenticated) => {
      if (!authenticated) {
        console.log('Not Authenticated');
        if (failureCallback) failureCallback();
      } else {
        console.log('Authenticated');
        this.setCookieValue(this.cookieName, this.keycloak.token);
        if (successCallback) successCallback();
      }
    }).catch((error) => {
      console.log('Authentication failed due to:', error);
      if (failureCallback) failureCallback(error);
    });
  }

  authenticateLogin() {
    this.keycloak.login({ redirectUri: window.location.origin });
  }

  isAuthenticated() {
    return this.getCookieValue(this.cookieName) !== false;
  }

  setCookieValue(cookieName, value) {
    const date = new Date();
    const daysToExpire = 1;
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    document.cookie = `${cookieName}=${value}; expires=${date.toGMTString()}; path=/`;
  }

  getCookieValue(cookieName) {
    const match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
    return match ? match[2] : false;
  }

  parseToken(token) {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((char) => {
      return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  }

  getCurrentUsername() {
    const token = this.getCookieValue(this.cookieName);
    if (!token) return null;

    const parsedToken = this.parseToken(token);
    return parsedToken ? parsedToken.preferred_username : null;
  }
}
