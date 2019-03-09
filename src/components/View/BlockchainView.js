import React, { Component, Fragment } from 'react'
import { Blockchain, Storage } from '../../blockchain'
import { BlockView } from '../Blockchain'

class BlockchainView extends Component {
    state = {
        blocksInfo: [],
        chaindId: ''
    }

    componentDidMount() {
        this.setState({
            chainId: this.props.match.params.chainId,
            blocksInfo: Storage.getAllBlocks(this.props.match.params.chainId)
        })
    }

    render() {
        const { blocksInfo } = this.state
        let blocks = blocksInfo.map((blockInfo, index) => <BlockView key={index} block={blockInfo} />)

        return (
            <Fragment>
                <h3>Blockchain: {this.state.chainId}</h3>
                {blocks}
            </Fragment>
        )
    }
}

export default BlockchainView;