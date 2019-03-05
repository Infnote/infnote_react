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

    handleAlertClose = () => {
        this.setState({alert: false})
    }

    post = () => {
        const content = this.state.content.trim()
        if (content.length > remainLimit.content) {
            this.setState({alert: true, alertContent: __('post.limit_exceed')})
            return
        }
        if (content.length <= 0) {
            this.setState({alert: true, alertContent: __('post.empty')})
            return
        }
        
        PostModel.submit(null, content).then(() => {
            this.setState({ content: '', contentRemain: remainLimit.content })
            Store.dispatch(refresh())
        }).catch( err => {
            this.setState({alert: true, alertContent: err.message})
        })
    }

    render() {
        const { classes } = this.props
        const { content, contentRemain, alert, alertContent} = this.state
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