export const actions = {
    async nuxtServerInit({ commit }, { app }){
        console.log('SERVER INIT')
    },

    nuxtClientInit({ commit }, context){
        console.log('CLIENT INIT')

        try {
            let items = localStorage.getItem('buttons')
            if(!items || items == 'null') items = '[]'
            commit('buttons/SetButtons', JSON.parse(items))
        }catch(err){ console.log(err) }
    }
}