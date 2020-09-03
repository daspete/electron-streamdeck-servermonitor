const defaultButtons = [
    { id: 0, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 1, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 2, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 3, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 4, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 5, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 6, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 7, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 8, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 9, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 10, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 11, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 12, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 13, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } },
    { id: 14, settings: { label: '', active: false, baseUrl: '', updateInterval: 10000 } }
]

export const actions = {
    async nuxtServerInit({ commit }, { app }){
        console.log('SERVER INIT')
    },

    nuxtClientInit({ commit }, context){
        console.log('CLIENT INIT')

        try {
            let items = localStorage.getItem('buttons')
            if(!items || items == 'null') items = JSON.stringify(defaultButtons)
            commit('buttons/SetButtons', JSON.parse(items))
        }catch(err){ console.log(err) }
    }
}