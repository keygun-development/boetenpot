<template>
  <div class="bg-blue-400 h-screen">
    <div class="flex flex-col justify-center items-center h-screen">
      <h1>
        Boetepot App
      </h1>
      <p class="text-center">
        Log eerst in met je google account om verder te gaan
      </p>
      <img @click="signIn()"
           src="../assets/images/google.png"
           class="rounded-full p-4 bg-white w-4/12 mt-4 shadow-lg hover:shadow-inner"
      />
    </div>
  </div>
</template>

<script>

import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import store from "../store";
import router from "../routes";
import {setDoc, doc, getDoc} from "firebase/firestore";
const firebase = require('../firebaseConfig.js');

export default {
  methods: {
    signIn: async function () {
      const auth = getAuth();
      signInWithPopup(auth, firebase.provider)
          .then(result => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            store().dispatch('login', token)
                .then(async () => {
                  const userRef = doc(firebase.db, "users", result.user.uid)
                  const userSnap = getDoc(userRef)
                  const userdata = (await userSnap).data()

                  for(let i=0; i<userdata.length; i++) {
                    if(result.user.uid === userdata[i].id) {
                      let params = new URLSearchParams(window.location.search)
                      params.get('redirect_to') ? router.push(params.get('redirect_to')) : router.push('/')
                    }
                  }

                  setDoc(doc(firebase.db, "users", result.user.uid), {
                    id: result.user.uid,
                    name: result.user.displayName,
                    email: result.user.email
                  })
                  let params = new URLSearchParams(window.location.search)
                  params.get('redirect_to') ? router.push(params.get('redirect_to')) : router.push('/')
                })
          })
          .catch(err => {
            console.log(err)
          })
    },
  }
}
</script>