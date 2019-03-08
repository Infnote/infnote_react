import React, { Component } from 'react'
import { Blockchain } from '../../blockchain'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

class BlockchainCard extends Component {
    constructor(props) {
        super(props)
        this.chain = new Blockchain(this.props.chainID)
    }

    handleClick = e => {
        // console.log(e)
        this.props.history.push(`/blockchain/${this.chain.id}`)
    }

    render() {
        return (
            <Card>
                <CardContent>
                    <h3>Id {this.chain.id}: {this.chain.count} blocks</h3>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={this.handleClick}>View</Button>
                </CardActions>
            </Card>
        )
    }
}

export default BlockchainCard;