<template>
  <div class="bg-blue-400 h-screen">
    <div class="flex flex-col justify-center items-center h-screen">
      <h1>
        Boetenpot App
      </h1>
      <form class="mt-4 c-card">
        <p>
          Naam:
        </p>
        <input name="name" />
        <div class="mt-4">
          <p>
            Groepscode:
          </p>
          <input name="groupcode" />
        </div>
        <div class="mt-4">
          <input class="c-button c-button--blue w-full" type="submit" :value="'Join'" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {

}

</script>