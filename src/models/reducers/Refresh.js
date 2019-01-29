const refresh = (state = null, action) => {
    switch (action.type) {
    case 'refresh':
        return true
    default:
        return state
    }
}

export default refresh