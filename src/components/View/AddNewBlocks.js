import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import { Blockchain, Block, Key } from 'blockchain'

class AddNewBlocks extends Component {
    state = {
        name: ''
    }

    // componentDidMount() {
    //     let key = new Key();
    // }

    handleChange = name => e => {
        this.setState({[name]: e.target.value})
    }

    handleClick = () => {
        const wif = localStorage.getItem('wif')
        let key = Key.fromWIF(wif)

        const chain = Blockchain.fromPrivateKey(key)
        let count = chain.count

        // failing at block.getDataForHashing...
        let block = chain.createBlock(this.state.name, count++)
        chain.saveBlock(block)
        console.log(this.state.name)
    }

    render() {
        const { classes } = this.props

        return (
            <div>
                <TextField
                    id="textfield"
                    label="New Block"
                    multiline
                    onChange={this.handleChange('name')}
                    margin="normal"
                    />
                <Button variant="contained" onClick={this.handleClick}>Submit</Button>
            </div>
        )
    }
}

export default AddNewBlocks;