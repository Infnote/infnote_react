// import axios from 'axios'
import APIClient from './APIClient'

class Note {
    static getMap() {
        return {id: 'id', replyTo: 'reply_to', lastReply: 'last_reply', user: 'user', replies: 'replies', title: 'title', content: 'content', dateSubmitted: 'date_submitted', nsfw: 'nsfw', signature: 'signature', blockTime: 'block_time', blockHeight: 'block_height'}
    }

    static getMembers() {
        return ['id', 'replyTo', 'lastReply', 'user', 'replies', 'title', 'content', 'dateSubmitted', 'nsfw', 'signature', 'blockTime', 'blockHeight']
    }

    static fetch(page=1, size=10) {
        return APIClient.shared().client.get('/post/list/', {
            params: {
                page: page,
                size: size
            }
        }).then(response => {
            return response.data.results.map(obj => new Note(obj))
        })
    }

    constructor(props) {
        if (props) {
            let map = Note.getMap()
            Note.getMembers().forEach(name => this[name] = props[map[name]] )
        }
        let members = Note.getMembers().reduce(
            (result, name) => {
                result[name] = { writable: false }
                return result
            }, {}
        )
        Object.defineProperties(this, members)
        Object.seal(this)
    }
}

export default Note