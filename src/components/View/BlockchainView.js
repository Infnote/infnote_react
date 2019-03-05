import React, { Component } from 'react'
import { Blockchain, Block, Storage } from '../../blockchain'
import { BlockView } from '../Blockchain'

class BlockchainView extends Component {
    constructor(props) {
        super(props)
        this.chain = new Blockchain(this.props.chainID)

        // only get the genesis block for now
        // this.blockInfo = Storage.getBlock(0, this.chain.id)
        this.blocksInfo = Storage.getAllBlocks(this.props.chainID)
    }

    render() {
        let blocks = this.blocksInfo.map((blockInfo, index) => <BlockView key={index} block={blockInfo} />)

        return (
            <div>This is a blockchain with id {this.chain.id} has {this.chain.count} blocks
                {blocks}
            </div>
        )
    }
}

export default BlockchainView;