import React, { Component } from 'react'
import Storage from '../../blockchain/storage'
import { eventEmitter } from 'utils'
import { BlockchainCard } from 'components/Blockchain'
import { Service } from 'network'
import { Blockchain } from '../../blockchain'
import { BlockchainView, AddNewBlocks } from 'components/View'


class BlockchainListView extends Component {
    state = {
        keys: []
    }

    updateState = () => {
        this.setState({
            keys: Storage.getAllBlockchainIds()
        })
    }

    componentDidMount() {
        this.updateState()

        // subscribe to broadcast messages
        this.service = new Service()
    }

    render() {
        // let blockchains = this.keys.map(id => <BlockchainView key={id} chainID={id} />)

        let blockchains = this.state.keys.map(id => <BlockchainCard history={this.props.history} key={id} chainID={id} />)

        return (
            <div>
                <h2>Blockchains</h2>
                <div className="blockchainContainer">
                    {blockchains}
                </div>
                {/* <AddNewBlocks /> */}
            </div>
        )
    }
}

export default BlockchainListView;