import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//import apolloclient and vueapollo
import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

Vue.config.productionTip = false;
// define const apolloClient to set graphql api url
const apolloClient = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});
//add vueApollo plugin to global method
Vue.use(VueApollo);
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

new Vue({
  router,
  store,
  render: h => h(App),
  apolloProvider
}).$mount("#app");
