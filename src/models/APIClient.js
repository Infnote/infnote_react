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
        // this.client.defaults.headers.common['Content-Type'] = 'application/json'
        // this.cookies = new Cookies()

        // const token = this.loadToken()
        // if (token) {
        //     this.client.defaults.headers.common['Authorization'] = token
        // }

        // Store.subscribe(() => {
        //     const url = Store.getState().saveSettingEvent
        //     console.log(url)
        //     if (url) {
        //         this.client = axios.create({
        //             baseURL: url,
        //         })
        //         console.log('change the URL')
        //         //this.update(1, true)
        //     }
        // })
    }

    // clearToken() {
    //     this.cookies.remove('token')
    // }

    // loadToken() {
    //     return this.cookies.get('token')
    // }

    // authorize(email, password) {
    //     return this.client.post('/api-token-auth/', {
    //         email: email,
    //         password: password,
    //     }).then(response => {
    //         const token = 'JWT ' + response.data.token
    //         this.cookies.set('token', token, { path: '/', maxAge: 60 * 60 * 24 * 30 })
    //         this.client.defaults.headers.common['Authorization'] = token
    //         return this.client.get('/user/')
    //     })
    // }

    // register(user) {
    //     return this.client.post('/user/create/', user)
    // }

    // user() {
    //     if (this.loadToken()) {
    //         return this.client.get('/user/')
    //     }
    //     return null
    // }

    // posts(category = '/', page = 1) {
    //     let url = '/post/list/?category=' + category + '&page=' + page
    //     return this.client.get(url)
    // }

    // retrievePost(id) {
    //     return this.client.get('/post/' + id)
    // }

    // retrieveReplies(id, page = 1) {
    //     return this.client.get('/post/' + id + '/replies/?page=' + page)
    // }

    // sendPost(post) {
    //     return this.client.post('/post/', post)
    // }

    // categories() {
    //     return this.client.get('/category/list/')
    // }

    // coins(value) {
    //     return this.client.get('/wallet/coins/?value=' + value)
    // }

}

export default APIClient