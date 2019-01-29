import React, { Component } from 'react'
import { FixedSpace } from 'components/Utils'
import { TextField, Button } from '@material-ui/core'
import { PostModel, Store } from 'models'
import { refresh } from 'models/actions'

class PostForm extends Component {

    state = {
        content: '',
        title: '',
        display: PostModel.isAllowed()
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        })
    }

    post = () => {
        PostModel.submit(this.state.title, this.state.content).then(() => {
            this.setState({ content: '', title: '' })
            Store.dispatch(refresh())
        }).catch( err => {
            console.log(err)
        })
    }

    componentWillMount() {
        this.setState({ loged: PostModel.isAllowed()})
        this.unsubscribe = Store.subscribe(() => {
            const refresh = Store.getState().refresh
            if (refresh) {
                this.setState({ display: PostModel.isAllowed()})
                console.log('refresh')
            }
        })
    }

    componentWillUnmount() {
        this.setState({ display: PostModel.isAllowed()})
        this.unsubscribe()
    }

    render() {
        // const { classes } = this.props;
        const { content, title, display } = this.state
        console.log(display)
        if (display === false) 
            return (<div></div>)
        return (
            <div>
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
                    variant="outlined"
                />
                <TextField
                    id="outlined-multiline-flexible"
                    label="Post"
                    multiline
                    rowsMax="4"
                    fullWidth={true}
                    value={content}
                    onChange={this.handleChange('content')}
                    //className={classes.textField}
                    margin="normal"
                    // helperText="hello"
                    variant="outlined"
                />
                <FixedSpace size="xs2" />
                <Button variant="contained" onClick={this.post}>
                    Post
                </Button>
                <FixedSpace size="xs2" />
            </div>
        )
    }
}

export default PostForm