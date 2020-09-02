module.exports = {
    telemetry: false,

    globalName: 'DasPeTeElectronNuxt',

    mode: 'spa',

    server: {
        port: 3000,
        host: '127.0.0.1'
    },

    srcDir: 'client',

    components: true,

    modulesDir: ['./node_modules'],

    buildDir: 'nuxtbuild',

    generate: {
        dir: 'nuxtdist'
    },

    build: {
        splitChunks: {
            // layouts: true,
            pages: true,
            commons: true
        },

        loaders: {
            // scss: {
            //     data: `
            //         @import "@/assets/scss/variables.scss";
            //         @import "@/assets/scss/mixins.scss";
            //     `
            // },
            vue: {
                compilerOptions: {
                    preserveWhitespace: false
                }
            }
        },

        extend(config, { isClient }){
            if(isClient){
                config.target = 'electron-renderer'
            }
        }
    },

    head: {
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
        ],
        link: [
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap' }
        ],
    },

    plugins: [
        { src: '~plugins/nuxtClientInit', ssr: false }
    ],

    modules: [

    ],

    buildModules: [
        '@nuxtjs/tailwindcss',
    ]
}