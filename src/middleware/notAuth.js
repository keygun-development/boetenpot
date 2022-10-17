import Cookies from 'js-cookie'

export default function notAuth({ next, router }) {
    if (Cookies.get('jwt')) {
        return router.push({ path: '/' });
    }

    return next();
}
