import APIClient from './APIClient'
import Key from './Key'

class User {
    static currentUser = {}

    static currentUserExist() {
        return (Object.keys(User.currentUser).length !== 0)
    }

    static updateCurrentUser(wif) {
        let key = Key.fromWIF(wif)
        let userID = key.toAddress()
        return User.getNickName(userID).then(response => {
            User.currentUser['key'] = key
            User.currentUser['userID'] = userID
            User.currentUser['nickname'] = response.data['nickname']
            User.currentUser['email'] = response.data['email']
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
            User.currentUser['key'] = key
            User.currentUser['userID'] = userID
            User.currentUser['nickname'] = response.data['nickname']
            User.currentUser['email'] = response.data['email']
            return key.toWIF()
        })
    }

    static logout() {
        if (User.currentUserExist())
            User.currentUser = {}
    }

    static getNickName(userID) {
        return APIClient.shared().client.get('/user/id/' + userID + '/')
    }
}

export default User