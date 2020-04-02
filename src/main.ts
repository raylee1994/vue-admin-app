import Vue from 'vue';
import App from "./app.vue";

Vue.config.productionTip = false;

const str: string = "123";

new Vue({
    render: (h) => h(App),
}).$mount('#app');