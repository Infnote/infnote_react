import React, { Component, Fragment } from 'react'
import { Blockchain, Block, Storage } from '../../blockchain'
import { BlockView } from '../Blockchain'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class BlockchainView extends Component {
    state = {
        expanded: null
    }

    constructor(props) {
        super(props)
        this.chain = new Blockchain(this.props.chainID)

        // only get the genesis block for now
        // this.blockInfo = Storage.getBlock(0, this.chain.id)
        this.blocksInfo = Storage.getAllBlocks(this.props.chainID)
    }

    handleChange = (panel) => (event, expanded) => {
        this.setState({
          expanded: expanded ? panel : false,
        });
      };

    render() {
        const { expanded } = this.state;
        let blocks = this.blocksInfo.map((blockInfo, index) => <BlockView key={index} block={blockInfo} />)

        return (
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <h3>This is a blockchain with id {this.chain.id} has {this.chain.count} blocks</h3>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container spacing={24}>{blocks}</Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

export default BlockchainView;