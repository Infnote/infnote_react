class Storage {
    static saveBlock(block, chainID) {
        let index = chainID + '+' + block['height'].toString()
        return localStorage.setItem(index, block.toJSON())
    }

    static getBlock(height, chainID) {
        let index = chainID + '+' + height.toString()
        return localStorage.getItem(index)
    }

    static getNextBlock(height, chainID) {
        if (height >= this.getChainCount(chainID)) return false;

        return this.getBlock(height+1, chainID)
    }

    static getPreviousBlock(height, chainID) {
        if (height === 0) return false;

        return this.getBlock(height-1, chainID)
    }

    static getAllBlocks(chainID, order="DESC") {
        let blocksCount = this.getChainCount(chainID)
        let blocks = []
        for (let i = 0; i < blocksCount; i++) {
            blocks.unshift(this.getBlock(i, chainID))
        }
        if (order === "ASC") {
            blocks.sort()
        }
        return blocks
    }

    // TODO: this should be renamed to getBlocksCount
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

    static getAllBlockchainIds() {
        let keys = Object.keys(localStorage)
        // look for genesis block, ie. key with the "{chainId+0}" pattern
        let regex = /[a-zA-Z0-9]+(\+0){1}/gm

        return keys.filter(key => regex.test(key))
            .map(key => key.slice(0, key.length-2))
    }
}

export default Storage