import React, { Component } from 'react'
import { AppBar, Toolbar, Typography, Grid, IconButton, withStyles, Drawer, TextField, Button } from '@material-ui/core'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import logo from 'assets/infnote-logo.png'
import { FixedSpace } from 'components/Utils'
import { Store, APIClient, UserModel } from 'models'
import { refresh } from 'models/actions'
import { Storage } from 'utils'

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
    },
    userButton: {
        textTransform: 'none',
    },
})

class NavBar extends Component {
    state = {
        drawer: false,
        signUpDialog: false,
        logoutDialog: false,
        loged: false,
        apiAddress: Storage.getValue('apiAddress'),
        chainAddress: Storage.getValue('chainAddress'),
        wif: Storage.getValue('wif'),
        nickname: '',
        email: '',
    }

    handleClickOpenSignUp = () => {
        this.setState({ signUpDialog: true })
    }

    handleCloseSignUp = () => {
        this.setState({ signUpDialog: false })
    }

    handleSubmitSignUp = () => {
        this.setState({ signUpDialog: false })
        UserModel.signUp(this.state.nickname, this.state.email).then(wif => {
            this.setState({ loged: true })
            this.setState({ nickname: UserModel.currentUser['nickname'] })
            this.setState({ email: UserModel.currentUser['email'] })
            this.setState({ wif: wif })
            Storage.setValue('wif', wif)
            Store.dispatch(refresh())
        }).catch(err => {
            console.log(err)
        })
    }

    handleClickOpenLogout = () => {
        this.setState({ logoutDialog: true })
    }

    handleCloseLogout = () => {
        this.setState({ logoutDialog: false })
    }

    handleLogout = () => {
        this.setState({ logoutDialog: false })
        this.logout()
    }

    logout() {
        this.setState({ loged: false })
        this.setState({ nickname: '' })
        this.setState({ email: '' })
        this.setState({ wif: '' })
        Storage.removeItem('wif')
        UserModel.logout()
        Store.dispatch(refresh())
    }

    toggleDrawer = open => () => {
        this.setState({ drawer: open })
    }

    drawerSave = () => {
        this.toggleDrawer(false)()
        Storage.setValue('apiAddress', this.state.apiAddress)
        Storage.setValue('chainAddress', this.state.chainAddress)

        if (this.state.wif != null) {
            try {
                UserModel.updateCurrentUser(this.state.wif).then(() => {
                    this.setState({ nickname: UserModel.currentUser['nickname'], loged: true })
                    Storage.setValue('wif', this.state.wif)
                    APIClient.changeURL(this.state.apiAddress)
                    Store.dispatch(refresh())
                }).catch(err => {
                    console.log(err)
                    this.logout()
                })
            }
            catch(err) {
                console.log(err)
                this.logout()
            }
            return
        }
        
        APIClient.changeURL(this.state.apiAddress)
        Store.dispatch(refresh()) 
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        })
    }

    componentWillMount() {
        if ((UserModel.currentUserExist() === false) && (this.state.wif != null))
            UserModel.updateCurrentUser(this.state.wif).then(() => {
                this.setState({ loged: true })
                this.setState({ nickname: UserModel.currentUser['nickname'] })
                this.setState({ email: UserModel.currentUser['email'] })
                Store.dispatch(refresh()) 
            })
    }

    render() {
        const { classes } = this.props
        const { apiAddress, chainAddress, wif, nickname, email, loged, signUpDialog, logoutDialog } = this.state
        return (
            <div>
                <AppBar position="fixed" color="inherit">
                    <Toolbar>
                        <img src={logo} alt="" srcSet={logo + ' 2x'} width="80" />
                        <Grid container justify="flex-end" alignItems="center">
                            <Button onClick={loged === true ? this.handleClickOpenLogout : this.handleClickOpenSignUp} className={classes.userButton}>
                                <Typography >
                                    <strong>{loged === true ? nickname : 'Anonymous'}</strong>
                                </Typography>
                            </Button>
                        </Grid>
                        <IconButton className={classes.settingsButton} onClick={this.toggleDrawer(true)}><SettingsIcon /></IconButton>
                    </Toolbar>
                </AppBar>
                <Dialog open={signUpDialog} onClose={this.handleCloseSignUp} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="nickname"
                            label="Nickname"
                            fullWidth
                            value={nickname}
                            onChange={this.handleChange('nickname')}
                            variant="outlined"
                        />
                        <TextField
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={this.handleChange('email')}
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseSignUp} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmitSignUp} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={logoutDialog} onClose={this.handleCloseLogout} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Logout</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure to logout?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseLogout} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleLogout} color="primary">
                            Logout
                        </Button>
                    </DialogActions>
                </Dialog>
                <Drawer anchor="right" open={this.state.drawer} onClose={this.toggleDrawer(false)}>
                    <div className={classes.drawer}>
                        <TextField
                            id="api-server"
                            label="API Server"
                            value={apiAddress}
                            margin="normal"
                            fullWidth
                            onChange={this.handleChange('apiAddress')}
                        />
                        <TextField
                            id="chain-server"
                            label="Chain Server"
                            value={chainAddress}
                            margin="normal"
                            fullWidth
                            onChange={this.handleChange('chainAddress')}
                        />
                        <TextField
                            id="WIF"
                            label="Private Key (Wallet Import Format)"
                            value={wif}
                            margin="normal"
                            fullWidth
                            multiline
                            variant="outlined"
                            onChange={this.handleChange('wif')}
                        />
                        <FixedSpace size="xs2" />
                        <Button variant="contained" className={classes.button} onClick={this.drawerSave} fullWidth>
                            Save
                        </Button>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default withStyles(styles)(NavBar)
