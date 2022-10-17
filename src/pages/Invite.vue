<template>
  <div class="bg-blue-400 h-screen">
    <div class="flex flex-col justify-center items-center h-screen px-4">
      <h1>
        Invite code
      </h1>
      <div class="mt-4 c-card">
        <p class="text-black">
          Naam:
        </p>
        <input name="name" v-model="name" />
        <div class="mt-4">
          <p class="text-black">
            Groepscode:
          </p>
          <input class="text-gray-400 lowercase" name="groupcode" v-model="invite" :disabled="groupcode !== false" />
        </div>
        <p class="text-red-500" v-if="e">
          {{ e }}
        </p>
        <div class="mt-4">
          <button @click="joinGroup()" class="c-button c-button--green w-full cursor-pointer font-bold" type="submit">
            Join
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import router from "../routes";
const firebase = require('../firebaseConfig.js');

export default {
  data() {
    let params = new URLSearchParams(window.location.search)
    return {
      invite: params.get('key') ?? '',
      name: '',
      e: '',
      userid: '',
      groupcode: !!params.get('key')
    }
  },

  created() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.name = user.displayName
        this.userid = user.uid

        if(this.invite) {
          const groupRef = doc(firebase.db, "groups", this.invite)
          const groupSnap = await getDoc(groupRef)
          if (groupSnap.exists()) {
            if (groupSnap.data().users) {
              const users = groupSnap.data().users
              for (let i=0; i<users.length;i++) {
                if(user.uid === users[i]) {
                  await router.push('/?group='+this.invite)
                }
              }
            }
          }
        }
      }
    })
  },

  methods: {
    joinGroup: async function () {
      const groupRef = doc(firebase.db, "groups", this.invite)
      const groupSnap = await getDoc(groupRef)
      const params = new URLSearchParams(window.location.search)

      this.e = ''
      if (!this.name) {
        return this.e = 'Vul je naam eerst in'
      }
      if (!this.invite) {
        return this.e = 'Je hebt geen groepscode'
      }
      if (!groupSnap.exists()) {
        return this.e = 'De groep '+this.invite+' bestaat niet'
      }

      await updateDoc(groupRef, {
        users: arrayUnion(this.userid)
      })

      if(!params.get('key')) {
        await router.push('/invite?key=' + this.invite)
      }

      await router.push('/?group=' + this.invite)
    }
  }
}
</script>