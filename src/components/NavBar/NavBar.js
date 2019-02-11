import React, { Component } from 'react'
import { AppBar, Toolbar, Typography, Grid, IconButton, withStyles, Drawer, TextField, Button } from '@material-ui/core'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Menu, MenuItem } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import logo from 'assets/infnote-logo.png'
import { FixedSpace } from 'components/Utils'
import { Store, APIClient, UserModel } from 'models'
import { refresh } from 'models/actions'
import { Storage } from 'utils'
import QRCode from 'qrcode.react'

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
    dialogText: {
        overflowWrap: 'break-word',
    }
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
                    this.setState({ nickname: UserModel.currentUser['nickname'], logged: true })
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
        }
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
            this.setState({ logged: true })
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
        this.setState({ keyDialog: true })
    }

    handleCloseKeyDialog = () => {
        this.setState({ keyDialog: false })
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
        if ((UserModel.currentUserExist() === false) && (this.state.wif != null))
            UserModel.updateCurrentUser(this.state.wif).then(() => {
                this.setState({ logged: true })
                this.setState({ nickname: UserModel.currentUser['nickname'] })
                this.setState({ email: UserModel.currentUser['email'] })
                Store.dispatch(refresh()) 
            })
    }

    render() {
        const { classes } = this.props
        const { anchorEl, apiAddress, chainAddress, wif, nickname, email, logged, loginDialog, signUpDialog, logoutDialog, keyDialog } = this.state
        return (
            <div>
                <AppBar position="fixed" color="inherit">
                    <Toolbar>
                        <img src={logo} alt="" srcSet={logo + ' 2x'} width="80" />
                        <Grid container justify="flex-end" alignItems="center">
                            {(() => {
                                if (logged) {
                                    return (
                                        <Button 
                                            aria-owns={anchorEl ? 'simple-menu' : undefined}
                                            aria-haspopup="true" 
                                            onClick={this.handleMenuOpen} 
                                            className={classes.userButton}>
                                            <Typography>
                                                <strong>{nickname}</strong>
                                            </Typography>
                                        </Button>
                                    )
                                }
                                return (
                                    <div>
                                        <Button className={classes.userButton} onClick={this.handleOpenLogin}>
                                            <Typography>
                                                <strong>登入</strong>
                                            </Typography>
                                        </Button>
                                        <Button className={classes.userButton} onClick={this.handleClickOpenSignUp}>
                                            <Typography>
                                                <strong>注册</strong>
                                            </Typography>
                                        </Button>
                                    </div>
                                )
                            })()}
                        </Grid>
                        <IconButton className={classes.settingsButton} onClick={this.toggleDrawer(true)}><SettingsIcon /></IconButton>
                    </Toolbar>
                </AppBar>
                
                <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleMenuClose}>
                    <MenuItem onClick={this.handleOpenKeyDialog}>我的秘钥</MenuItem>  
                    <MenuItem onClick={this.handleClickOpenLogout}>登出</MenuItem>  
                </Menu>

                <Dialog fullWidth open={loginDialog} onClose={this.handleCloseLogin} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
                    <DialogContent>
                        <TextField 
                            margin="dense"
                            id="login-wif"
                            label="秘钥 (Wallet Import Format)"
                            value={wif === null ? '' : wif}
                            onChange={this.handleChange('wif')}
                            variant="outlined"
                            multiline
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseLogin} color="primary">
                            取消
                        </Button>
                        <Button onClick={this.handleLogin} color="primary">
                            登入
                        </Button>
                    </DialogActions>
                </Dialog>
            
                <Dialog open={signUpDialog} onClose={this.handleCloseSignUp} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="nickname"
                            label="昵称"
                            fullWidth
                            value={nickname}
                            onChange={this.handleChange('nickname')}
                            variant="outlined"
                        />
                        <TextField
                            margin="dense"
                            id="email"
                            label="邮箱"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={this.handleChange('email')}
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseSignUp} color="primary">
                            取消
                        </Button>
                        <Button onClick={this.handleSubmitSignUp} color="primary">
                            注册
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={logoutDialog} onClose={this.handleCloseLogout} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Logout</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            确定要登出吗？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseLogout} color="primary">
                            取消
                        </Button>
                        <Button onClick={this.handleLogout} color="primary">
                            登出
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={keyDialog} onClose={this.handleCloseLogout} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Logout</DialogTitle>
                    <DialogContent>
                        <QRCode value={wif} renderAs="svg" size={256} />
                        <Typography className={classes.dialogText}>{wif}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseKeyDialog} color="primary">
                            关闭
                        </Button>
                    </DialogActions>
                </Dialog>

                <Drawer anchor="right" open={this.state.drawer} onClose={this.toggleDrawer(false)}>
                    <div className={classes.drawer}>
                        <TextField
                            id="api-server"
                            label="API 服务器"
                            value={apiAddress}
                            margin="normal"
                            fullWidth
                            onChange={this.handleChange('apiAddress')}
                        />
                        <TextField
                            id="chain-server"
                            label="Chain 服务器"
                            value={chainAddress}
                            margin="normal"
                            fullWidth
                            onChange={this.handleChange('chainAddress')}
                        />
                        <FixedSpace size="xs2" />
                        <Button variant="contained" className={classes.button} onClick={this.drawerSave} fullWidth>
                            保存
                        </Button>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default withStyles(styles)(NavBar)
