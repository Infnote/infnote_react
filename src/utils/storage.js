import SETTINGS from './settings'
import { Languages } from './languages'

class Storage {
    static getValue(index) {
        let result = localStorage.getItem(index)
        return result
    }

    static setValue(index, value) {
        localStorage.setItem(index, value)
    }

    static removeItem(index){
        localStorage.removeItem(index)
    }
    
    static migrate(){
        if (Storage.getValue('apiAddress') == null)
            Storage.setValue('apiAddress', SETTINGS.apiAddress)
        if (Storage.getValue('chainAddress') == null)
            Storage.setValue('chainAddress', SETTINGS.chainAddress)
        if (Storage.getValue('language') == null)
        {
            let language = navigator.language || navigator.userLanguage
            if ((language !== 'en-US') && (language !== 'zh-CN'))
                language = SETTINGS.defaultLanguage
            Storage.setValue('language', language)
        }
        Languages.index = Storage.getValue('language')
    }
}

export default Storage