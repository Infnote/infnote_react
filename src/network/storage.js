import url from 'url'

class Storage {
    static savePeers(peers) {
        let index = 'peers'
        return localStorage.setItem(index, JSON.stringify(peers))
    }

    static getPeers() {
        let index = 'peers'
        let result = localStorage.getItem(index)
        if (result == null)
            return []
        return JSON.parse(localStorage.getItem(index))
    }

    static addPeer(peer) {
        var result = Storage.getPeers()
        let parserPeer = url.parse(peer)
        var flag = true
        for (var i in result){
            let parser = url.parse(result[i])
            if (parser.hostname === parserPeer.hostname && parser.port === parserPeer.port)
                flag = false
        }
        if (flag){
            result.push(peer)
            Storage.savePeers(result)
        }
    }

    static migrate() {
        localStorage.setItem('migrated', 'true')
    }

    static isMigrated() {
        return localStorage.getItem('migrated') !== null
    }
}

export default Storage