import React, { Component } from 'react'
import { Block } from '../../blockchain'
import Grid from '@material-ui/core/Grid'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BlocksHeader } from 'components/View'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import { Link } from 'react-router-dom'

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
        this.block = this.props.block
        this.state = {
            expanded: null
        }
    }

    UnixToUTC(seconds) {
        return new Date(seconds * 1000).toISOString()
    }

    payloadInBytes() {
        return Buffer.byteLength(this.block.payload)
    }

    handleChange = (panel) => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false
        })
    }

    getPayloadJSON() {
        return this.block.decodePayload()
    }

    render() {
        let {expanded} = this.state
        let payload = this.getPayloadJSON()
        let blockDetail = Object.keys(payload).map((key, i) => (
            <ListItem key={i}>
                <ListItemText primary={key} secondary={payload[key]} />
            </ListItem>
        ))

        return (
            <ExpansionPanel expanded={expanded === this.block.blockHash} onChange={this.handleChange(this.block.blockHash)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <h3>{this.block.blockHash}</h3>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container spacing={24}>
                        <BlocksHeader/>
                        <Grid item xs={1}>{this.block.height}</Grid>
                        <Grid item xs={2}>{this.UnixToUTC(this.block.time)}</Grid>
                        <Grid item xs={1}>{this.payloadInBytes()}</Grid>
                        <Grid item xs={8}>{this.block.signature}</Grid>
                        <List>
                            {blockDetail}
                        </List>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

export default BlockView