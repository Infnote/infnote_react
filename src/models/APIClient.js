import axios from 'axios'
import {SETTINGS} from 'utils'
// import {Store} from 'models'

var instance = null

class APIClient {
    static shared(){
        if (instance === null)
            instance = new APIClient()
        return instance
    }

    static changeURL(url)
    {
        APIClient.shared().client = axios.create({
            baseURL: url,
        })
    }

    static getAPIAddress(){
        let result = localStorage.getItem('apiAddress')
        if (result === null)
            return SETTINGS.apiAddress
        else
            return result
    }

    constructor() {
        this.client = axios.create({
            baseURL: APIClient.getAPIAddress(),
        })
    }
}

export default APIClient