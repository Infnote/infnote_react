import React, { Component } from 'react'
import { Blockchain, Block, Storage } from '../../blockchain'
import { BlockView } from '../Blockchain'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

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
            <Grid container spacing={24}>
                <Grid item xs={12}>This is a blockchain with id {this.chain.id} has {this.chain.count} blocks</Grid>
                {blocks}
            </Grid>
        )
    }
}

export default BlockchainView;