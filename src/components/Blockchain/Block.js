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

    UnixToUTC(seconds) {
        return new Date(seconds * 1000).toISOString()
    }

    payloadInBytes() {
        return Buffer.byteLength(this.block.payload)
    }

    render() {

        return (
            <React.Fragment>
                <Grid item xs={1}>{this.block.height}</Grid>
                <Grid item xs={2}>{this.UnixToUTC(this.block.time)}</Grid>
                <Grid item xs={1}>{this.payloadInBytes()}</Grid>
                <Grid item xs={8}>{this.block.signature}</Grid>
            </React.Fragment>
        )
    }
}

export default BlockView;