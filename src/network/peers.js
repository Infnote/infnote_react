import Storage from './storage'
import {SETTINGS} from '../utils'
import url from 'url'

class Peers {
    static migrate()
    {
        if (Storage.isMigrated() === false){
            Peers.addPeers(SETTINGS.peers)
        }
        Storage.migrate()
    }

    static savePeers(peers) {
        Storage.savePeers(peers)
    }

    static getPeers(count = 0) {
        if (count === 0)
            return Storage.getPeers()
        return Storage.getPeers().slice(0, count)
    }

    static getPeersCount() {
        return Storage.getPeers().length
    }

    // peers urls
    static addPeers(peers) {
        for (var i in peers){

            let parse = url.parse(peers[i])

            var port = parse.protocol === 'ws:'? 80: 443
            if (parse.port !== null)
                port = parse.port
            
            var path = '/'
            if (parse.path != null)
                path = parse.path
            
            let peer = parse.protocol + '//' + parse.hostname + ':' + port + path
            
            Storage.addPeer(peer)
        }
    }
}

export default Peers