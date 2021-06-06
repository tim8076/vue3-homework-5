
import signIn from './views/signIn.js'
import dashBoard from './views/dashboard.js'
import front from './views/front.js'

const routes = [
    { path: '/', component: front },
    { path: '/signIn', component: signIn },
    { path: '/dashBoard', component: dashBoard },
]
const router = VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})

const app = Vue.createApp({})

//loading
app.component('loading',VueLoading);

//表單驗證
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
});

// vue router
app.use(router)
app.mount('#app')

