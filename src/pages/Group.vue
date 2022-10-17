<template>
  <div class="h-screen bg-orange-400">
    <div class="px-4 pt-4">
      <h1>
        Groep: {{ group }}
      </h1>
      <div class="grid grid-cols-2">

      </div>
      <p v-if="success" class="text-lime-400">
        {{ success }}
      </p>
      <input type="hidden" :value="origin+'/invite?key='+group" ref="copy" />
      <button class="c-button c-button--blue rounded-lg" @click="createInvite()">
        Invite link
      </button>
    </div>
  </div>
</template>

<script>

import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    let params = new URLSearchParams(window.location.search)
    return {
      user: {},
      group: params.get('group'),
      origin: window.location.origin,
      success: ''
    }
  },

  created() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user
      }
    })
    
  },

  methods: {
    createInvite: function () {
      navigator.clipboard.writeText(this.$refs.copy.value)
      this.success = 'Invite link is gekopierd naar je clipboard'
    }
  }
}

</script>