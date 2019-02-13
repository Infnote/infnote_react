import React, { Component } from 'react'
import { FixedSpace } from 'components/Utils'
import { TextField, Button, Card, CardContent, Typography, withStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import { PostModel, Store } from 'models'
import { refresh } from 'models/actions'

const remainLimit = {
    title: 50,
    content: 10000
}

const styles = {
    remainText: {
        textAlign: 'right',
        color: 'gray',
    },
    remainHighlight: {
        textAlign: 'right',
        color: 'red'
    }
}

class PostForm extends Component {

    state = {
        content: '',
        title: '',
        display: PostModel.isAllowed(),
        titleRemain: remainLimit.title,
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
        PostModel.submit(title, content).then(() => {
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
        const { content, title, display, titleRemain, contentRemain, alert, alertContent} = this.state

        if (display === false) 
            return (<div></div>)
        return (
            <div>
                <Card>
                    <CardContent>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Title"
                            rowsMax="4"
                            fullWidth={true}
                            value={title}
                            onChange={this.handleChange('title')}
                            //className={classes.textField}
                            margin="normal"
                            // helperText="hello"
                        />
                        <Typography 
                            className={titleRemain >= 0 ? classes.remainText : classes.remainHighlight}>
                            {titleRemain >= 0 ? titleRemain : 0}
                        </Typography>
                        <FixedSpace size="xs2" />
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Post"
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
                        <Typography 
                            className={contentRemain >= 0 ? classes.remainText : classes.remainHighlight}>
                            {contentRemain >= 0 ? contentRemain : 0}
                        </Typography>
                        <FixedSpace size="xs2" />
                        <Button variant="contained" onClick={this.post} fullWidth>
                            Post
                        </Button>
                        <FixedSpace size="xs2" />
                    </CardContent>
                </Card>

                <Dialog open={alert} onClose={this.handleAlertClose} aria-labelledby="form-dialog-title" fullWidth>
                    <DialogTitle id="form-dialog-title">加载错误</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {alertContent}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAlertClose} color="primary">
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            
        )
    }
}

export default withStyles(styles)(PostForm)