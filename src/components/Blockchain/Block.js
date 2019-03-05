import React, { Component } from 'react'
import { Block } from '../../blockchain';

class BlockView extends Component {
    // this.blockHash = ''
    //     this.prevHash = ''
    //     this.time = 0
    //     this.signature = ''
    //     this.height = 0
    //     this.payload = ''
    constructor(props) {
        super(props)
        this.block = Block.fromJSON(this.props.block)
    }

    render() {
        let blockClass = "block" + this.block.isGenesis ? "genesis" : ""

        return (
            <div className={blockClass}>This is a {this.block.isGenesis ? "Genesis" : ""} block
                prevHash {this.block.prevHash}
                time {this.block.time}
                signature {this.block.signature}
            </div>
        )
    }
}

export default BlockView;