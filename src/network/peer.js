import Message from '../protocol/message'
import {Info} from '../protocol/behaviors'
import {log} from '../utils'

class Peer {
    constructor(url) {
        this.url = url
        this.socket = null
    }

    connect(handleMessage, handleClose, handleConnection) {
        //try {
        this.socket = new WebSocket(this.url)
        //}
        // catch(err) {
        //     log.info( err)
        // }

        // init socket
        this.socket.onopen = () => {
            let url = this.socket.url
            log.info( url + ' is connected.')
            let info = Info.create()
            let message = new Message('info', info.toDict())
            this.socket.send(message.toJSON())
            log.info('sent message to ' + url + ':\n' + message.toJSON())
            handleConnection(this)
        }
        this.socket.onerror = (err) => {
            let url = this.socket.url
            log.info('got socket error from ' + url + ':\n' + JSON.stringify(err))
        }
        this.socket.onclose = () => {
            let url = this.socket.url
            log.info( url + ' is closed.')
            handleClose(this)
            // retry mechanism to be done
        }
        this.socket.onmessage = (data) => {
            let url = this.socket.url
            log.info('received message from ' + url + ':\n' + data.data)
            let messages = handleMessage(data.data, url)
            if (messages.length > 0){
                for (var i in messages){
                    this.socket.send(messages[i].toJSON())
                    log.info('sent message to ' + url + ':\n' + messages[i].toJSON())
                }
            }
        }
    }

    send(data) {
        let url = this.socket.url
        this.socket.send(data)
        log.info('sent message to ' + url + ':\n' + data)
    }

    close() {
        this.socket.close(1000);
    }
}

export default Peer