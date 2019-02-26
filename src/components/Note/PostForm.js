import React, { Component } from 'react'
import { FixedSpace } from 'components/Utils'
import { TextField, Button, Card, CardContent, Typography, withStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from '@material-ui/core'
import { PostModel, Store } from 'models'
import { refresh } from 'models/actions'
import { __ } from 'utils'

const remainLimit = {
    content: 10000
}

const styles = {
    remainText: {
        textAlign: 'left',
        color: 'gray',
    },
    remainHighlight: {
        textAlign: 'left',
        color: 'red'
    }
}

class PostForm extends Component {

    state = {
        content: '',
        display: PostModel.isAllowed(),
        contentRemain: remainLimit.content,
        alert: false,
        alertContent: ''
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
            [name+'Remain']: remainLimit[name] - event.target.value.length
        })
    }

    post = () => {
        const { title, content } = this.state
        if (content.length > remainLimit.content || title.length > remainLimit.title) {
            return
        }
        PostModel.submit('', content).then(() => {
            this.setState({ content: '', title: '' })
            Store.dispatch(refresh())
        }).catch( err => {
            this.setState({alert: true, alertContent: err.message})
        })
    }

    componentWillMount() {
        this.setState({ loged: PostModel.isAllowed()})
        this.unsubscribe = Store.subscribe(() => {
            const refresh = Store.getState().refresh
            if (refresh) {
                this.setState({ display: PostModel.isAllowed()})
            }
        })
    }

    componentWillUnmount() {
        this.setState({ display: PostModel.isAllowed()})
        this.unsubscribe()
    }

    render() {
        const { classes } = this.props
        const { content, display, contentRemain, alert, alertContent} = this.state

        if (display === false) 
            return (<div></div>)
        return (
            <div>
                <Card>
                    <CardContent>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Note"
                            multiline
                            rows="4"
                            fullWidth
                            value={content}
                            onChange={this.handleChange('content')}
                            //className={classes.textField}
                            margin="normal"
                            // helperText="hello"
                            variant="outlined"
                        />
                        <FixedSpace size="xs4" />
                        <Grid container justify='space-between'>
                            <Grid item>
                                <Typography 
                                    className={contentRemain >= 0 ? classes.remainText : classes.remainHighlight}>
                                    {contentRemain >= 0 ? contentRemain : 0}
                                </Typography>
                            </Grid>    
                            <Grid item>
                                <Button variant="contained" onClick={this.post}>{__('post')}</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

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
            </div>
            
        )
    }
}

export default withStyles(styles)(PostForm)