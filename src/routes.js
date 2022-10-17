//Import vue essentials
import {createRouter, createWebHistory} from "vue-router";

//Import middlewares
import auth from "./middleware/auth"
import notAuth from "@/middleware/notAuth";
import group from "@/middleware/group";

//Import pages
import Invite from "./pages/Invite";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Group from "./pages/Group";

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'font-bold',
    routes: [
        {
            path: '/:catchAll(.*)',
            component: NotFound,
            meta: { title: '404' }
        },
        {
            path: '/invite',
            component: Invite,
            meta: {
                title: 'Invite',
                middleware: auth
            }
        },
        {
            path: '/inloggen',
            component: Login,
            meta: {
                title: 'Inloggen',
                middleware: notAuth
            }
        },
        {
            path: '/',
            component: Group,
            meta: {
                title: 'Groep',
                middleware: group
            }
        }
    ]
})

function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    if (!subsequentMiddleware) return context.next;

    return (...parameters) => {
        context.next(...parameters);
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({ ...context, next: nextMiddleware });
    };
}

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware) ?
            to.meta.middleware :
            [to.meta.middleware];

        const context = {
            from,
            next,
            router,
            to
        };
        const nextMiddleware = nextFactory(context, middleware, 1);

        return middleware[0]({ ...context, next: nextMiddleware() });
    }
    return next();
});

export default router;
