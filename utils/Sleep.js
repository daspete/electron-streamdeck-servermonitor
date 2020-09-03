const Sleep = async (time) => {
    return new Promise((resolve) => {
        setTimeout(() => { resolve() }, time)
    })
}

module.exports = Sleep