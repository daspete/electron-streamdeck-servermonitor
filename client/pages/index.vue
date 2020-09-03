<template>
    <div class="page h-screen w-screen grid grid-cols-5 grid-flow-row gap-1">
        <DeckButton v-for="button in $store.getters['buttons/Buttons']" :key="`deckbutton-${ button.id }`" :button="button" />
    </div>
</template>

<script>
const { ipcRenderer } = require('electron')

export default {

    mounted(){
        ipcRenderer.invoke('renderer.ready', this.$store.getters['buttons/Buttons'])
    },

    methods: {
        AddButton(){
            
            // this.$store.commit('buttons/AddButton', {
            //     id: Date.now(),
            //     settings: {
            //         buttonId: 0,
            //         testing: 1
            //     }
            // })
        }
    }
}
</script>

<style>

</style>