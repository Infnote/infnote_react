import React, { Component } from 'react'
import { Block } from '../../blockchain'
import Grid from '@material-ui/core/Grid'

class BlockView extends Component {
    // this.blockHash = ''
    //     this.prevHash = ''
    //     this.time = 0
    //     this.signature = ''
    //     this.height = 0
    //     this.payload = ''

    // could also display height/block #, time stamp, payload size
    constructor(props) {
        super(props)
        this.block = Block.fromJSON(this.props.block)
    }

    render() {
        let blockClass = "block" + this.block.isGenesis ? "genesis" : ""

        return (
            <React.Fragment>
                <Grid item xs={12}>This is a {this.block.isGenesis ? "Genesis" : ""} block</Grid>
                <Grid item xs={4}>{this.block.prevHash}</Grid>
                <Grid item xs={1}>{this.block.time}</Grid>
                <Grid item xs={7}>{this.block.signature}</Grid>
            </React.Fragment>
        )
    }
}

export default BlockView;