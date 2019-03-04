import SETTINGS from '../utils/settings'
import {Blockchain, Block} from '../blockchain'
import {Peers} from '../network'
import Behavior from './behavior'
import Error from './errors'
import url from 'url'
import UAParser from 'ua-parser-js'

var messageIDs = {}

var bsInstance = null
export class BroadcastService {
    handler = null

    static shared() {
        if (bsInstance === null) {
            bsInstance = new BroadcastService()
        }
        return bsInstance
    }
}

class Info extends Behavior {
    static getMembers(){
        return ['version', 'peers', 'chains', 'platform', 'full_node']
    }

    static create() {
        var chains = {}
        for (var i in SETTINGS.chains){
            let blockchain = new Blockchain(SETTINGS.chains[i])
            chains[blockchain.id] = blockchain.count
        }
        var parser = new UAParser()
        return new Info({
            'version' : '1.1',
            'peers' : Peers.getPeersCount(),
            'chains' : chains,
            'platform' : parser.getBrowser(),
            'full_node' : false
        })
    }

    constructor(props) {
        super()
        if (props)
            Info.getMembers().forEach(name => this[name] = props[name])
    }

    toJSON() {
        return JSON.stringify(this.toDict())
    }

    toDict() {
        var dict = {}
        Info.getMembers().forEach(name => dict[name] = this[name])
        return dict       
    }

    validate() {
        if (this.version !== '1.1')
            return Error.incompatibleProtocolVersion("only accept v1.1 protocol")
        if (this.peers < 0)
            return Error.badRequestError("'peers' needs to be a non-negative number")
        return null
    }

    react() {
        var behaviors = []
        if (this.peers > 0)
            behaviors.push(new RequestPeers({'count':this.peers}))
        for (var i in Object.keys(this.chains)) {
            let key = Object.keys(this.chains)[i]
            let value = this.chains[key]
            if (SETTINGS.chains.includes(key) === false)
                continue
            let blockchain = new Blockchain(key)
            if (blockchain.count >= value)
                continue
            behaviors.push(new RequestBlocks({'chain_id':key, 'from':blockchain.count, 'to':value - 1}))
        }
        return behaviors
    }
}

class RequestPeers extends Behavior {
    static getMembers(){
        return ['count']
    }

    constructor(props) {
        super()
        if (props)
            RequestPeers.getMembers().forEach(name => this[name] = props[name])
    }

    toJSON() {
        return JSON.stringify(this.toDict())
    }

    toDict() {
        var dict = {}
        RequestPeers.getMembers().forEach(name => dict[name] = this[name])
        return dict       
    }

    validate() {
        if (this.count <= 0)
            return Error.badRequestError("'count' needs to be a non-negative number")
        return null
    }

    react() {
        var behaviors = []
        // TODO: maintain peers
        behaviors.push(new ResponsePeers({'peers': Peers.getPeers(this.count)}))
        return behaviors
    }
}

class ResponsePeers extends Behavior {
    static getMembers(){
        return ['peers']
    }

    constructor(props) {
        super()
        if (props)
            ResponsePeers.getMembers().forEach(name => this[name] = props[name])
    }

    toJSON() {
        return JSON.stringify(this.toDict())
    }

    toDict() {
        var dict = {}
        ResponsePeers.getMembers().forEach(name => dict[name] = this[name])
        return dict       
    }

    validate() {
        for (var key in this.peers) {
            let protocol = url.parse(this.peers[key]).protocol
            if ((protocol !== 'wss:') && (protocol !== 'ws:'))
                return Error.URLError("not a websocket URL")
        }
        return null
    }

    react() {
        var behaviors = []
        Peers.addPeers(this.peers)
        return behaviors
    }
}

class RequestBlocks extends Behavior {
    static getMembers(){
        return ['chain_id','from','to']
    }

    constructor(props) {
        super()
        if (props)
            RequestBlocks.getMembers().forEach(name => this[name] = props[name])
    }

    toJSON() {
        return JSON.stringify(this.toDict())
    }

    toDict() {
        var dict = {}
        RequestBlocks.getMembers().forEach(name => dict[name] = this[name])
        return dict       
    }

    validate() {
        if (SETTINGS.chains.includes(this.chain_id) === false)
            return Error.chainNotAcceptError(this.Chain_id)
        if (this.from > this.to)
            return Error.badRequestError("'from' must greater or equal 'to'")
        let blockchain = new Blockchain(this.chain_id)
        if (blockchain.count < this.from)
            return Error.badRequestError("request not existed blocks")
        return null
    }

    // Split blocks for every 100KB
    react() {
        var behaviors = []
        var blocks = []
        var size = 0
        let blockchain = new Blockchain(this.chain_id)
        for (var i = this.from; i <= this.to; i++) {
            let block = blockchain.getBlock(i)
            if (block == null)
                break

            if (size + block.size > 1024 * 100) {
                behaviors.push(new ResponseBlocks({'blocks':blocks}))
                blocks = []
                blocks.push(block.toDict())
                size = block.size
            } else {
                blocks.push(block.toDict())
                size += block.size
            }
        }
        if (blocks.length > 0)
            behaviors.push(new ResponseBlocks({'blocks':blocks}))
        return behaviors
    }
}

class ResponseBlocks extends Behavior {
    static getMembers(){
        return ['blocks']
    }

    constructor(props) {
        super()
        this.blockObjects = []
        if (props)
            ResponseBlocks.getMembers().forEach(name => this[name] = props[name])
    }

    toJSON() {
        return JSON.stringify(this.toDict())
    }

    toDict() {
        var dict = {}
        ResponseBlocks.getMembers().forEach(name => dict[name] = this[name])
        return dict       
    }

    validate() {
        for (var i in this.blocks) {
            let blockDict = this.blocks[i]
            let block = Block.fromDict(blockDict)
            if (SETTINGS.chains.includes(block.chainID) === false)
                return Error.chainNotAcceptError(block.chainID())
            let blockchain = new Blockchain(block.chainID)
            let err = blockchain.validateBlock(block)
            if (err != null)
                return Error.blockValidationError(err)
            this.blockObjects.push(block)
        }
        return null
    }

    react() {
        var behaviors = []
        for (var i in this.blockObjects) {
            let block = this.blockObjects[i]
            let blockchain = new Blockchain(block.chainID)
            blockchain.saveBlock(block)
        }
        return behaviors
    }
}

class BroadcastBlock extends Behavior {
    static getMembers(){
        return ['block']
    }

    static create(block)
    {
        return new BroadcastBlock({
            'block' : block.toDict()
        })
    }

    constructor(props, messageID, address) {
        super()
        this.blockObject = null
        this.messageID = messageID
        this.address = address
        if (props)
            BroadcastBlock.getMembers().forEach(name => this[name] = props[name])
    }

    toJSON() {
        return JSON.stringify(this.toDict())
    }

    toDict() {
        var dict = {}
        BroadcastBlock.getMembers().forEach(name => dict[name] = this[name])
        return dict       
    }

    validate() {
        if (messageIDs[this.messageID] === true)
        return Error.DuplicateBroadcastError(this.messageID)
        this.blockObject = Block.fromDict(this.block)
        if (SETTINGS.chains.includes(this.blockObject.chainID) === false)
            return Error.chainNotAcceptError(this.blockObject.chainID)
        let blockchain = new Blockchain(this.blockObject.chainID)
        let err = blockchain.validateBlock(this.blockObject)
        if (err != null)
            return Error.blockValidationError(err)
        return null
    }

    react() {
        var behaviors = []
        let blockchain = new Blockchain(this.blockObject.chainID)
        var result = blockchain.saveBlock(this.blockObject)
        if ((result === true) && (messageIDs[this.messageID] !== true) && (BroadcastService.shared().handler !== null)) {
            BroadcastService.shared().handler(this)
            messageIDs[this.messageID] = true
        }
        return behaviors
    }
}

export {Behavior, Info, RequestPeers, ResponsePeers, RequestBlocks, ResponseBlocks, BroadcastBlock}