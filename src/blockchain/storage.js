class Storage {
    static saveBlock(block, chainID) {
        let index = chainID + '+' + block['height'].toString()
        return localStorage.setItem(index, block.toJSON())
    }

    static getBlock(height, chainID) {
        let index = chainID + '+' + height.toString()
        return localStorage.getItem(index)
    }

    static getChainCount(chainID) {
        let index = chainID
        if (localStorage.getItem(index) == null)
            return 0
        return parseInt(localStorage.getItem(index))
    }

    static updateChainCount(chainID, height) {
        let index = chainID
        return localStorage.setItem(index, height.toString())
    }
}

export default Storage