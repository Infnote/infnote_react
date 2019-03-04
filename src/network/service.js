import { Peer, Peers } from '../network'
import { handleJSONData, BroadcastBlock, Message, BroadcastService } from '../protocol'
import { log } from '../utils'

class Service {
    handleClose = (peer) => {
        for (var i in this.peers)
            if (this.peers[i] === peer) {
                this.peers.splice(i, 1)
                return
            }
    }

    handleConnection = (peer) => {
        this.peers.push(peer)
    }

    handleBroadcast = (broadcast) => {
        this.broadcastBlock(broadcast.blockObject, broadcast.address, broadcast.messageID)
    }

    addPeers(urls) {
        for (var i in urls) {
            let peer = new Peer(urls[i])
            peer.connect(handleJSONData, this.handleClose, this.handleConnection)
        }
    }

    constructor() {
        this.peers = []
        this.addPeers(Peers.getPeers())
        BroadcastService.shared().handler = this.handleBroadcast
    }

    broadcastBlock(block, notBroadcastAddress, messageID) {
        for (var i in this.peers)
            if (this.peers[i].url !== notBroadcastAddress) {
                try {
                    let data = BroadcastBlock.create(block).toDict()
                    let message = new Message('broadcast:block', data, messageID)
                    this.peers[i].send(message.toJSON())
                }
                catch (err) {
                    log.info('failed to broadcast the block to ' + this.peers[i].url + ' due to ' + err)
                }
            }
    }

    getAllCurrentPeers() {
        var urls = []
        for (var i in this.peers)
            urls.push(this.peers[i].url)
        return urls
    }
}

export default Service