import React, { Component } from 'react'
import { AppBar, Toolbar, Typography, Grid, IconButton, withStyles, Drawer, TextField, Button } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import logo from 'assets/infnote-logo.png'
import {FixedSpace} from 'components/Utils'
import {Store, APIClient} from 'models'
import {saveSettingEvent} from 'models/actions'

const styles = theme => ({
    settingsButton: {
        marginLeft: 15
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: 300
        },
        [theme.breakpoints.up('lg')]: {
            width: 500
        },
        padding: 15
    }
})

class NavBar extends Component {
    state = {
        drawer: false,
        apiAddress : this.getValue('apiAddress'),
        chainAddress : this.getValue('chainAddress'),
        wif : this.getValue('wif'),
    }

    toggleDrawer = open => () => {
        this.setState({ drawer: open })
    }

    getValue(index) {
        let result = localStorage.getItem(index)
        if (result === null){
            if (index === 'apiAddress')
                return 'http://localhost:32767'
            if (index === 'chainAddress')
                return 'http://localhost:32767'
            if (index === 'wif')
                return 'test'
        }
        return result
    }

    setValue(index, value) {
        localStorage.setItem(index,value)
    }

    apply = () => {
        this.toggleDrawer(false)()
        this.setValue('apiAddress', this.state.apiAddress)
        this.setValue('chainAddress', this.state.chainAddress)
        this.setValue('wif', this.state.wif)
        APIClient.changeURL(this.state.apiAddress)
        Store.dispatch(saveSettingEvent(this.state.apiAddress))
    }

    handleAPIAddressChange = event => {
        this.setState({apiAddress: event.target.value})
    }

    handleChainAddressChange = event => {
        this.setState({chainAddress: event.target.value})
    }

    handleWIFChange = event => {
        this.setState({wif: event.target.value})
    }

    render() {
        const { classes } = this.props
        const { apiAddress, chainAddress, wif } = this.state
        return (
            <div>
                <AppBar position="fixed" color="inherit">
                    <Toolbar>
                        <img src={logo} alt="" srcSet={logo + ' 2x'} width="80"/>
                        <Grid container justify="flex-end" alignItems="center">
                            <Typography><strong>Anonymous</strong></Typography>
                        </Grid>
                        <IconButton className={classes.settingsButton} onClick={this.toggleDrawer(true)}><SettingsIcon /></IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer anchor="right" open={this.state.drawer} onClose={this.toggleDrawer(false)}>
                    <div className={classes.drawer}>
                        <TextField 
                            id="api-server"
                            label="API Server"
                            value={apiAddress}
                            margin="normal"
                            fullWidth
                            onChange={this.handleAPIAddressChange}
                        />
                        <TextField 
                            id="chain-server"
                            label="Chain Server"
                            value={chainAddress}
                            margin="normal"
                            fullWidth
                            onChange={this.handleChainAddressChange}
                        />
                        <TextField 
                            id="WIF"
                            label="Private Key (Wallet Import Format)"
                            value={wif}
                            margin="normal"
                            fullWidth
                            multiline
                            variant="outlined"
                            onChange={this.handleWIFChange}
                        />
                        <FixedSpace size="xs2" />
                        <Button variant="contained" className={classes.button} onClick={this.apply}>
                            Save
                        </Button>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default withStyles(styles)(NavBar)
