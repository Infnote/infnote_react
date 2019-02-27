import React, { Component } from 'react'
import { AppBar, Toolbar, Typography, Grid, IconButton, withStyles, Drawer, TextField, Button } from '@material-ui/core'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Menu, MenuItem } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SettingsIcon from '@material-ui/icons/Settings'
import logo from 'assets/infnote-logo.png'
import { FixedSpace } from 'components/Utils'
import { Store, APIClient, UserModel } from 'models'
import { refresh } from 'models/actions'
import { Storage , __} from 'utils'
import QRCode from 'qrcode.react'

const styles = theme => ({
    settingsButton: {
        marginLeft: 15
    },
    drawer: {
        [theme.breakpoints.up('xs')]: {
            width: '100vw'
        },
        [theme.breakpoints.up('sm')]: {
            width: 400
        },
        padding: 15,
        boxSizing: 'border-box'
    },
    userButton: {
        textTransform: 'none',
    },
    dialogText: {
        overflowWrap: 'break-word',
    },
    error: {
        color: 'red'
    },
    hint: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.palette.grey[500],
        padding: 5
    },
})

class NavBar extends Component {
    state = {
        drawer: false,
        loginDialog: false,
        signUpDialog: false,
        logoutDialog: false,
        keyDialog: false,
        logged: false,
        apiAddress: Storage.getValue('apiAddress'),
        chainAddress: Storage.getValue('chainAddress'),
        wif: Storage.getValue('wif'),
        nickname: '',
        email: '',
        anchorEl: null,
        alert: false,
        alertContent: '',
        signUpErrors: {}
    }

    handleOpenLogin = () => {
        this.handleMenuClose()
        this.setState({ loginDialog: true })
    }

    handleCloseLogin = () => {
        this.setState({ loginDialog: false })
    }

    handleLogin = () => {
        this.handleCloseLogin()
        if (this.state.wif != null && this.state.wif.length > 0) {
            try {
                UserModel.updateCurrentUser(this.state.wif).then(() => {
                    this.setState({ nickname: UserModel.currentUser()['nickname'], logged: true })
                    Storage.setValue('wif', this.state.wif)
                    APIClient.changeURL(this.state.apiAddress)
                    Store.dispatch(refresh())
                }).catch(err => {
                    this.setState({alert: true, alertContent: err.message})
                    this.logout()
                })
            }
            catch(err) {
                this.setState({alert: true, alertContent: err.message})
                this.logout()
            }
        }
    }

    handleClickOpenSignUp = () => {
        this.setState({ signUpDialog: true })
    }

    handleCloseSignUp = () => {
        this.setState({ signUpDialog: false })
    }

    handleSubmitSignUp = () => {
        UserModel.signUp(this.state.nickname, this.state.email).then(wif => {
            this.setState({
                logged: true, 
                nickname: UserModel.currentUser()['nickname'], 
                email: UserModel.currentUser()['email'], 
                wif: wif, 
                signUpDialog: false 
            })
            Storage.setValue('wif', wif)
            Store.dispatch(refresh())
        }).catch(err => {
            if (err.response && err.response.status === 400) {
                this.setState({signUpErrors: err.response.data})
            } else {
                this.setState({alert: true, alertContent: __('connectionError')})
            }
        })
    }

    handleClickOpenLogout = () => {
        this.handleMenuClose()
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
        this.setState({ logged: false })
        this.setState({ nickname: '' })
        this.setState({ email: '' })
        this.setState({ wif: '' })
        Storage.removeItem('wif')
        UserModel.logout()
        Store.dispatch(refresh())
    }

    handleOpenKeyDialog = () => {
        this.setState({ keyDialog: true, anchorEl: null})
    }

    handleCloseKeyDialog = () => {
        this.setState({ keyDialog: false, copied: false })
    }

    handleAlertClose = () => {
        this.setState({ alert: false })
    }

    toggleDrawer = open => () => {
        this.setState({ drawer: open })
    }

    drawerSave = () => {
        this.toggleDrawer(false)()
        Storage.setValue('apiAddress', this.state.apiAddress)
        Storage.setValue('chainAddress', this.state.chainAddress)
        
        APIClient.changeURL(this.state.apiAddress)
        Store.dispatch(refresh()) 
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        })
    }

    handleMenuOpen = event => {
        this.setState({anchorEl: event.currentTarget})
    }

    handleMenuClose = () => {
        this.setState({anchorEl: null})
    }

    componentWillMount() {
        if (this.state.wif != null)
            UserModel.updateCurrentUser(this.state.wif).then(() => {
                this.setState({ logged: true })
                this.setState({ nickname: UserModel.currentUser()['nickname'] })
                this.setState({ email: UserModel.currentUser()['email'] })
                Store.dispatch(refresh()) 
            })
    }

    render() {
        const { classes } = this.props
        const { anchorEl, apiAddress, wif, nickname, email, logged, loginDialog, signUpDialog, logoutDialog, keyDialog, alert, alertContent, signUpErrors } = this.state
        return (
            <div>
                <AppBar position="fixed" color="inherit">
                    <Toolbar>
                        <img src={logo} alt="" srcSet={logo + ' 2x'} width="80" />
                        {(() => {
                            if (logged) {
                                return (
                                    <Grid container justify="flex-end" alignItems="center">
                                        <Grid item>
                                            <Button 
                                                aria-owns={anchorEl ? 'simple-menu' : undefined}
                                                aria-haspopup="true" 
                                                onClick={this.handleMenuOpen} 
                                                className={classes.userButton}>
                                                <Typography>
                                                    <strong>{nickname}</strong>
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )
                            }
                            return (
                                <Grid container justify="flex-end" alignItems="center">
                                    <Grid item>
                                        <Typography className={classes.hint}>
                                            {__('anonymous.status')}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button className={classes.userButton} onClick={this.handleOpenLogin}>
                                            <Typography>
                                                <strong>{__('login')}</strong>
                                            </Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button className={classes.userButton} onClick={this.handleClickOpenSignUp}>
                                            <Typography>
                                                <strong>{__('register')}</strong>
                                            </Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            )
                        })()}
                        <IconButton className={classes.settingsButton} onClick={this.toggleDrawer(true)}><SettingsIcon /></IconButton>
                    </Toolbar>
                </AppBar>
                
                <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleMenuClose}>
                    <MenuItem onClick={this.handleOpenKeyDialog}>{__('myPrivateKey')}</MenuItem>  
                    <MenuItem onClick={this.handleClickOpenLogout}>{__('logout')}</MenuItem>  
                </Menu>

                <Dialog fullWidth open={loginDialog} onClose={this.handleCloseLogin} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{__('login')}</DialogTitle>
                    <DialogContent>
                        <TextField 
                            margin="dense"
                            id="login-wif"
                            label={__('privateKeyWIF')}
                            value={wif === null ? '' : wif}
                            onChange={this.handleChange('wif')}
                            variant="outlined"
                            multiline
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseLogin} color="primary">
                            {__('cancel')}
                        </Button>
                        <Button onClick={this.handleLogin} color="primary">
                            {__('login')}
                        </Button>
                    </DialogActions>
                </Dialog>
            
                <Dialog open={signUpDialog} onClose={this.handleCloseSignUp} aria-labelledby="form-dialog-title" fullWidth>
                    <DialogTitle id="form-dialog-title">{__('register')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="nickname"
                            label={__('nickname')}
                            fullWidth
                            value={nickname}
                            onChange={this.handleChange('nickname')}
                            variant="outlined"
                        />
                        {(() => {
                            if (signUpErrors.nickname) {
                                return (
                                    <Typography className={classes.error}>
                                        {signUpErrors.nickname}
                                    </Typography>
                                )
                            }
                        })()}
                        <TextField
                            margin="dense"
                            id="email"
                            label={__('email')}
                            type="email"
                            fullWidth
                            value={email}
                            onChange={this.handleChange('email')}
                            variant="outlined"
                        />
                        {(() => {
                            if (signUpErrors.email) {
                                return (
                                    <Typography className={classes.error}>
                                        {signUpErrors.email}
                                    </Typography>
                                )
                            }
                        })()}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseSignUp} color="primary">
                            {__('cancel')}
                        </Button>
                        <Button onClick={this.handleSubmitSignUp} color="primary">
                            {__('register')}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={logoutDialog} onClose={this.handleCloseLogout} aria-labelledby="form-dialog-title" fullWidth>
                    <DialogTitle id="form-dialog-title">{__('logout')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {__('logout?')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseLogout} color="primary">
                            {__('cancel')}
                        </Button>
                        <Button onClick={this.handleLogout} color="primary">
                            {__('logout')}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={keyDialog} onClose={this.handleCloseLogout} aria-labelledby="form-dialog-title" >
                    <DialogTitle id="form-dialog-title">{__('myPrivateKey')}</DialogTitle>
                    <DialogContent>
                        <Grid container direction='column' spacing>
                            <Grid item>
                                <QRCode value={wif} renderAs="svg" size={256} />
                            </Grid>
                            <Grid item>
                                <TextField id='wif-for-copy' value={wif} readOnly fullWidth/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseKeyDialog}>
                            {__('close')}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={alert} onClose={this.handleAlertClose} aria-labelledby="form-dialog-title" fullWidth>
                    <DialogTitle id="form-dialog-title">{__('error')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {alertContent}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAlertClose} color="primary">
                            {__('ok')}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Drawer anchor="right" open={this.state.drawer} onClose={this.toggleDrawer(false)}>
                    <div className={classes.drawer}>
                        <IconButton onClick={this.toggleDrawer(false)}><CloseIcon /></IconButton>
                        <TextField
                            id="api-server"
                            label={__('apiserver')}
                            value={apiAddress}
                            margin="normal"
                            fullWidth
                            onChange={this.handleChange('apiAddress')}
                        />
                        {/* <TextField
                            id="chain-server"
                            label="Chain 服务器"
                            value={chainAddress}
                            margin="normal"
                            fullWidth
                            onChange={this.handleChange('chainAddress')}
                        /> */}
                        <FixedSpace size="xs2" />
                        <Button variant="contained" className={classes.button} onClick={this.drawerSave} fullWidth>
                            {__('save')}
                        </Button>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default withStyles(styles)(NavBar)
