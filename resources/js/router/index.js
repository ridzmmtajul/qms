import { createRouter, createWebHashHistory } from "vue-router";
import store from '@/store'

import Login from '../views/auth/Login.vue';
import PageNotFound from '../components/layouts/PageNotFound.vue';
import App from '../views/App.vue';
import Home from '../components/layouts/Home.vue';
import Accounts from '../views/users/Account.vue';
import Roles from '../views/libraries/Role.vue';
import UpdatePassword from "../components/users/UpdatePassword.vue";

const routes = [
    {
        path: '/:pathMatch(.*)*',
        name: 'page-not-found',
        component: PageNotFound
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            middleware: "guest"
        }
    },
    {
        path: '/update-password',
        name: 'update-password',
        component: UpdatePassword
    },
    {
        path: '/home',
        name: 'app',
        component: App,
        children: [
            {
                path: '/',
                name: 'home',
                component: Home
            },
            {
                path: '/users',
                name: 'users',
                component: Accounts
            },
            {
                path: '/roles',
                name: 'roles',
                component: Roles
            },
        ]
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.middleware == "guest") {
        if (store.state.auth.authenticated) {
            if(store.state.auth.password_reset){
                next({ name: "update-password" })
            }else{
                next({ name: "home" })
            }
        }
        next()
    } else {
        if (store.state.auth.authenticated) {
            next()
        } else {
            next({ name: "login" })
        }
    }
})

export default router;