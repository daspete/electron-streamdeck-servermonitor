export const state = () => {
    return {
        buttons: []
    }
}

export const mutations = {
    SetButtons(state, buttons){
        state.buttons = buttons
        localStorage.setItem('buttons', JSON.stringify(state.buttons))
    },

    AddButton(state, button){
        state.buttons.push(button)
        localStorage.setItem('buttons', JSON.stringify(state.buttons))
    },

    UpdateButton(state, button){
        let currentButton = state.buttons.find((_button) => { return _button.id == button.id })
        currentButton.settings = button.settings
        localStorage.setItem('buttons', JSON.stringify(state.buttons))
    },

    RemoveButton(state, buttonId){
        state.buttons = state.buttons.filter((button) => { return button.id != buttonId })
        localStorage.setItem('buttons', JSON.stringify(state.buttons))
    }
}

export const getters = {
    Buttons(state){
        return state.buttons
    }
}

export const actions = {

}