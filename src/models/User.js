import APIClient from './APIClient'
import Key from './Key'
import __ from '../utils/languages'
/* global Buffer */

var __currentUser

class User {
    static currentUser() {
        if (__currentUser) {
            return __currentUser
        }
        __currentUser = User.anonymous()
        return __currentUser
    }

    static setCurrentUser(user) {
        __currentUser = user
    }

    static updateCurrentUser(wif) {
        let key = Key.fromWIF(wif)
        let userID = key.toAddress()
        return User.getNickName(userID).then(response => {
            User.setCurrentUser({
                key,
                userID,
                nickname: response.data['nickname'],
                email: response.data['email']
            })
        })
    }

    static signUp(nickname, email) {
        let key = new Key()
        let userID = key.toAddress()
        let data = { email: email, nickname: nickname }
        let jsonString = JSON.stringify(data)
        let buffer = new Buffer(jsonString)
        let signature = key.sign(buffer)
        return APIClient.shared().client.post('/user/create/', {
            user_id: userID,
            nickname: nickname,
            email: email,
            signature: signature
        }).then(response => {
            User.setCurrentUser({
                key,
                userID,
                nickname: response.data['nickname'],
                email: response.data['email']
            })
            return key.toWIF()
        })
    }

    static logout() {
        User.setCurrentUser(User.anonymous())
    }

    static getNickName(userID) {
        return APIClient.shared().client.get('/user/id/' + userID + '/')
    }

    static anonymous() {
        let key = Key.fromWIF('Ky5DFuCVeiZ62gMcMMhedyHAo7VQDomX7JgMRp8xJ1HdtwqJJoq9')
        let userID = key.toAddress()
        return {
            key,
            userID,
            nickname: __('anonymous'),
            email: 'anonymous@infnote.com'
        }
    }
}

export default User