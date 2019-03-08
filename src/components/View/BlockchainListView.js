import React, { Component } from 'react'
import Storage from '../../blockchain/storage'
import { BlockchainCard } from 'components/Blockchain'
import { Blockchain } from '../../blockchain'
import { BlockchainView, AddNewBlocks } from 'components/View'


class BlockchainListView extends Component {
    // constructor(props) {
    //     super(props)
    //     this.keys = Storage.getAllBlockchainIds()
    // }

    state = {
        keys: []
    }

    componentDidMount() {
        this.setState({
            keys: Storage.getAllBlockchainIds()
        })
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