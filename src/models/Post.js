import APIClient from './APIClient'
import User from './User'

class Post {
    // static getMap() {
    //     return {id: 'id', replyTo: 'reply_to', lastReply: 'last_reply', user: 'user', replies: 'replies', title: 'title', content: 'content', dateSubmitted: 'date_submitted', nsfw: 'nsfw', signature: 'signature', blockTime: 'block_time', blockHeight: 'block_height'}
    // }

    static getMembers() {
        return ['title', 'content', 'data_submitted', 'reply_to', 'user_id', 'nsfw', 'signature']
    }

    static submit(title, content) {
        let data = { 
            title: title, 
            content: content,
            date_submitted: Math.floor(Date.now()/1000),
            reply_to: null,
            nsfw: false
        }
        
        let jsonString = JSON.stringify(data, Object.keys(data).sort())
        let buffer = new Buffer(jsonString)
        let key = User.currentUser()['key']
        data['signature'] = key.sign(buffer)
        data['user_id'] = key.toAddress()
        return APIClient.shared().client.post('/post/', data)
    }

    constructor(props) {
        if (props) {
            Post.getMembers().forEach(name => this[name] = props[name])
        }
        let members = Post.getMembers().reduce(
            (result, name) => {
                result[name] = { writable: false }
                return result
            }, {}
        )
        Object.defineProperties(this, members)
        Object.seal(this)
    }
}

export default Post