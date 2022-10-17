import Cookies from 'js-cookie'

export default function auth({ next, router }) {
    let params = new URLSearchParams(window.location.search)
    if (!Cookies.get('jwt')) {
        return router.push(params.get('key') ? '/inloggen?redirect_to=/invite?key='+params.get('key') : '/inloggen');
    }

    return next();
}
