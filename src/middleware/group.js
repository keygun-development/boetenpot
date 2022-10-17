import Cookies from "js-cookie";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function group({next, router}) {
    let params = new URLSearchParams(window.location.search)
    if (!Cookies.get('jwt')) {
        return router.push('/inloggen');
    }
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            if(params.get('key') || params.get('group')) {
                const groupRef = doc(db, "groups", params.get('key') || params.get('group'))
                const groupSnap = await getDoc(groupRef)
                let InGroup = false
                if (groupSnap.exists()) {
                    if (groupSnap.data().users) {
                        const users = groupSnap.data().users
                        for (let i=0; i<users.length;i++) {
                            if(user.uid === users[i]) {
                                InGroup = true
                            }
                        }
                    }
                }

                if(!InGroup) {
                    return router.push('/invite?key='+params.get('key') || params.get('group'));
                }
            } else {
                return router.push('/invite');
            }
        }
    })

    return next();
}