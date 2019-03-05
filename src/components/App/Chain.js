import React, { Component } from 'react'
//import logo from './logo.svg'
import '../../App.css'
import {Blockchain, Key} from '../../blockchain'
import {Service} from '../../network'
import {log} from '../../utils'

class Chain extends Component {

    init = () => {
        this.service = new Service()
        // let url = document.getElementById('peerURL').value
    }

    broadcast = () => {
        const buf = '5k1XmJn4556WCM'
        this.blockchain = Blockchain.fromPrivateKey(Key.fromWIF("Kxqkq6zZyf8czck2iZpcp55MQ2zweE6qTz3DUEMy51igJoMvD54w"))
        let block = this.blockchain.createBlock(buf, this.blockchain.count)
        this.blockchain.saveBlock(block)
        var chainID = block.chainID
        log.info('created 1 blocks with the chainID of ' + chainID)
        this.service.broadcastBlock(block)
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    {/* <img src={logo} className="App-logo" alt="logo" /> */}
                    <h1 className="App-title">Blockchain Test</h1>
                </header>
                <div id="data_input">
                    {/*<input id="peerURL" type="text" defaultValue="ws://10.89.58.116:32767" />*/}
                    <button id="btnConnect" onClick={this.init}>init</button>
                    <button id="btnSend" onClick={this.broadcast}>broadcast</button>
                    <br />
                    <p>p2p testing</p>
                    <p>option + command + i to check local storage</p>
                </div>
            </div>
        );
    }
}

export default Chain;
