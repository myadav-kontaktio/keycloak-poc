import Keycloak from "keycloak-js";

export const CookieName = "Keycloak_Auth";
export const Config = {
    url: 'http://localhost:8080/auth', 
    realm: 'master',                   
    clientId: 'iris-app',              
    onLoad: 'login-required',          
};
