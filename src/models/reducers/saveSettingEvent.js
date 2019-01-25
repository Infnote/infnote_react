const saveSettingEvent = (state = null, action) => {
    switch (action.type) {
    case 'SaveSetting':
        return action.url
    default:
        return state
    }
}

export default saveSettingEvent