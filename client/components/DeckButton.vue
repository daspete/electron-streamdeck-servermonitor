<template>
    <div :class="ButtonClasses">
        <canvas class="buttoncanvas" ref="canvas"></canvas>
        <div class="w-full h-full flex justify-center content-center items-center flex-wrap text-center">
            <div v-if="!showEdit">
                <div>{{ button.settings.label }}</div>

                <div>
                    <button :class="`px-2 py-1 bg-${ button.settings.active ? 'red' : 'green' }-600 text-white`" @click="ToggleActive">{{ !button.settings.active ? 'ACTIVATE': 'DEACTIVATE' }}</button>
                </div>

                <div class="mt-2">
                    <button class="px-2 py-1 bg-green-600 text-white" @click="EditButton">EDIT</button>
                </div>
            </div>
            <div v-if="showEdit">
                <div class="mt-2">
                    <div>Label <input v-model="currentButton.settings.label" /></div>
                    <div>Status Url <input v-model="currentButton.settings.baseUrl" /></div>
                    <div>UpdateInterval <input v-model="currentButton.settings.updateInterval" type="number" /></div>
                    <button class="px-2 py-1 bg-green-600 text-white" @click="SaveButton">SAVE</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron')

export default {
    props: { 
        button: { type: Object, default: () => { return {} } }
    },

    data(){
        return {
            showEdit: false,
            currentButton: null,
            buttonData: null
        }
    },

    computed: {
        ButtonClasses(){
            return {
                'm-1': true,
                'p-2': true,
                'shadow': true,
                'hover:shadow-lg': true,
                'cursor-pointer': true,
                'rounded-lg': true,
                'relative': true,
                'bg-teal-400': this.button.settings.active == true,
                'bg-gray-400': this.button.settings.active == false,

            }
        },


        UpdateInterval: {
            get(){
                return this.button.settings.updateInterval
            },
            set(value){
                let button = JSON.parse(JSON.stringify(this.button))
                button.settings.updateInterval = value

                this.UpdateButton(button)
            }
        }
    },

    mounted(){
        ipcRenderer.on(`button.data.update.${ this.button.id }`, (event, data) => {
            this.buttonData = data
            this.UpdateCanvas()
        })
    },

    methods: {
        RGBAtoRGB(r, g, b, a, r2, g2, b2){
            var r3 = Math.round(((1 - a) * r2) + (a * r))
            var g3 = Math.round(((1 - a) * g2) + (a * g))
            var b3 = Math.round(((1 - a) * b2) + (a * b))

            return [r3, g3, b3]
        },

        UpdateCanvas(){
            if(!this.buttonData) return
            if(this.buttonData.error) return

            let canvas = this.$refs.canvas
            canvas.width = 72
            canvas.height = 72
            let context = canvas.getContext('2d')

            let memoryPercent = this.buttonData.processes[0].memoryPercent
            let cpuPercent = this.buttonData.processes[0].cpu

            let memoryColor = '#00ff00'
            if(memoryPercent > 50) memoryColor = '#ff9900'
            if(memoryPercent > 80) memoryColor = '#ff0000'

            let cpuColor = '#009900'
            if(cpuPercent > 50) cpuColor = '#ff6600'
            if(cpuPercent > 80) cpuColor = '#990000'

            this.DrawProgressCircle(context, memoryPercent, 32, 4, memoryColor)
            this.DrawProgressCircle(context, cpuPercent, 26, 4, cpuColor)


            context.font = '8px Rubik'
            context.fillStyle = 'white'
            context.textAlign = 'center'
            context.fillText(`CPU: ${ Math.round(cpuPercent) }%`, 36, 30)
            context.fillText(`MEM: ${ Math.round(memoryPercent) }%`, 36, 40)

            let imageData = []

            for(let y = 0; y < 72; y++){
                for(let x = 0; x < 72; x++){
                    let pixel = context.getImageData(x, y, 1, 1).data
                    console.log(pixel[3])
                    pixel = this.RGBAtoRGB(pixel[0], pixel[1], pixel[2], pixel[3] / 255, 0, 0, 0)

                    imageData.push(pixel[0])
                    imageData.push(pixel[1])
                    imageData.push(pixel[2])
                }   
            }

            ipcRenderer.invoke(`button.image.update.${ this.button.id }`, imageData)
        },

        DrawProgressCircle(context, percent = 0, radius = 30, thickness = 5, progressColor = '#00ff00', circleColor = '#fff'){
            context.lineCap = 'round'

            let onePercent = 360 * 0.01
            let degrees = percent * onePercent

            context.beginPath()
            context.arc(36, 36, radius, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360))
            context.strokeStyle = circleColor
            context.lineWidth = `${ thickness }`
            context.stroke()

            context.beginPath()
            context.strokeStyle = progressColor
            context.lineWidth = `${ thickness }`
            context.arc(36, 36, radius, (Math.PI/180) * 270, (Math.PI/180) * (270 + degrees))
            context.stroke()
        },

        EditButton(){
            this.currentButton = JSON.parse(JSON.stringify(this.button))
            this.showEdit = true
        },

        SaveButton(){
            this.UpdateButton(this.currentButton)
            this.showEdit = false
        },

        UpdateButton(button){
            this.$store.commit('buttons/UpdateButton', button)
            ipcRenderer.invoke(`button.settings.update.${ button.id }`, button)
        },

        ToggleActive(){
            let button = JSON.parse(JSON.stringify(this.button))
            button.settings.active = !button.settings.active

            this.UpdateButton(button)
        }
    }
}
</script>

<style>
.buttoncanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 72px;
    height: 72px;
    display: none;
}
</style>