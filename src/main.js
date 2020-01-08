import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;
new Vue({
    //render: h => h(ComponentTest)
    render(h) {
        return h("div", [h(App)]);
    }
}).$mount("#app");
