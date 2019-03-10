import React, { Component, Fragment } from 'react'
import { Blockchain, Block, Storage } from '../../blockchain'
import { BlockView } from '../Blockchain'
import { eventEmitter } from 'utils'

class BlockchainView extends Component {
    constructor(props) {
        super(props)
        eventEmitter.on('NEW_BLOCK', this.newBlockHandler)
    }

    state = {
        blocksInfo: [],
        chaindId: ''
    }

    updateState = (chainId = this.props.match.params.chainId) => {
        this.setState({
            chainId: chainId,
            blocksInfo: Storage.getAllBlocks(chainId)
        })
    }

    newBlockHandler = (chainId) => {
        if (chainId === this.props.match.params.chainId) {
            this.updateState(chainId)
        }
    }

    componentDidMount() {
        this.updateState(this.props.match.params.chainId)
    }

    componentWillUnmount() {
        eventEmitter.off('NEW_BLOCK', this.newBlockHandler)
    }

    render() {
        let blocks = this.state.blocksInfo.map(blockInfo => {
            let block = Block.fromJSON(blockInfo)
            return (
                <BlockView key={block.height} block={block} />
                )
            })

        return (
            <Fragment>
                <h3>Blockchain: {this.state.chainId}</h3>
                <p>Total: {this.state.blocksInfo.length} blocks</p>
                {blocks}
            </Fragment>
        )
    }
}

export default BlockchainView;