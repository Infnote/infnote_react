import React, { Component } from 'react'
import Storage from '../../blockchain/storage'
import { Blockchain, Block } from '../../blockchain'

class BlockchainView extends Component {
    constructor(props) {
        super(props)
        this.chain = new Blockchain("1BWJrzQBjWJ1JTBRXYrWRAU9dYdJJ2GXDM")
        this.keys = Storage.getAllBlockchainIds()
    }

    render() {
        let blockchainKeys = this.keys.map(id => <div key={id}>{id}</div>)

        return (
            <div>This is a list view for blockchains
                {blockchainKeys}
                this chain with id {this.chain.id} has {this.chain.count} blocks
            </div>
        )
    }
}

export default BlockchainView;