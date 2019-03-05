import React, { Component } from 'react'
import Storage from '../../blockchain/storage'
import { Blockchain, Block } from '../../blockchain'
import BlockchainView from './BlockchainView'

class BlockchainListView extends Component {
    constructor(props) {
        super(props)
        this.chain = new Blockchain("1BWJrzQBjWJ1JTBRXYrWRAU9dYdJJ2GXDM")
        this.keys = Storage.getAllBlockchainIds()
    }

    render() {
        let blockchains = this.keys.map(id => <BlockchainView key={id} chainID={id} />)

        return (
            <div>This is a list view for blockchains
                <div className="blockchainContainer">
                    {blockchains}
                </div>
            </div>
        )
    }
}

export default BlockchainListView;