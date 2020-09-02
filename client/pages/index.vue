<template>
    <div class="page">
        {{ $store.getters['buttons/Buttons'] }}
        <button type="button" @click="AddButton">Add Button</button>
        <!-- <AddButton /> -->
    </div>
</template>

<script>
const { ipcRenderer } = require('electron')

export default {
    methods: {
        AddButton(){
            // ipcRenderer.invoke('test-action', 1, 2, 3)
            this.$store.commit('buttons/AddButton', {
                id: Date.now(),
                settings: {
                    buttonId: 0,
                    testing: 1
                }
            })
        }
    }
}
</script>

<style>

</style>