import React, { Component } from 'react'
import { CardHeader, Avatar, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, IconButton } from '@material-ui/core'
import Markdown from 'react-markdown'
import CloseIcon from '@material-ui/icons/Close'
import { NoteCard, PostForm } from '.'
import { NoteModel } from 'models'
import __ from '../../utils/languages'
import CodeRender from './CodeRender'

class NoteFlow extends Component {
    state = {
        notes: [],
        page: 1,
        alert: false,
        alertContent: '',
        loading: 0,
        expand: false,
        expandNote: {
            user: {},
            dateSubmitted: 0
        },
    }

    update = (page, clear) => {
        if (this.state.loading === 3 && !clear) {
            return
        }

        this.setState({loading: 1})
        NoteModel.fetch(page)
            .then(notes => {
                this.setState({
                    notes: clear ? notes : [...this.state.notes, ...notes],
                    page: page,
                    loading: 2
                })
            })
            .catch(error => {
                if (!error.response) {
                    this.setState({alert: true, alertContent: '连接失败，服务器已停止运行或 API 服务器地址错误'})
                } else if (error.response.status !== 404) {
                    this.setState({alert: true, alertContent: error.message})
                } else {
                    this.setState({loading: 3})
                }
            })
    }

    bottomEvent = () => {
        const el = document.getElementById(this.state.notes.length - 1)
        if (!el) {
            return 
        }
        if (el.getBoundingClientRect().bottom <= window.innerHeight) {
            this.update(this.state.page + 1)
        }
    }

    handleAlertClose = () => {
        this.setState({alert: false})
    }

    handleExpand = note => () => {
        this.setState({expand: true, expandNote: note})
        NoteModel.fetchNote(note.id).then(note => {
            this.setState({expandNote: note})
        })
    }

    handleExpandClose = () => {
        this.setState({expand: false})
    }

    componentWillMount() {
        this.update(1)
        document.addEventListener('scroll', this.bottomEvent)
    }

    componentWillUnmount() {
        this.setState({ notes: [], page: 0 })
        document.removeEventListener('scroll', this.bottomEvent)
    }

    render() {
        const { notes, alert, alertContent, loading, expand, expandNote } = this.state
        const flow = notes.map((note, index) => (
            <Grid item key={index} id={index}>
                <NoteCard object={note} onClick={this.handleExpand(note)} />
            </Grid>
        ))
        const time = new Date(expandNote.dateSubmitted * 1000)
        return (
            <div>
                <Grid container justify="center">
                    <Grid item xs={11} sm={8} md={5}>
                        <Grid container direction="column" spacing={16}>
                            <Grid item>
                                <PostForm/>
                            </Grid>
                            {flow}
                            <Grid item>
                                <Typography style={ loading === 1 ? {textAlign: 'center'} : {display: 'none'}}>{__('loading')}</Typography>
                                <Typography style={ loading === 3 ? {textAlign: 'center'} : {display: 'none'}}>{__('no_more_data')}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                
                <Dialog open={alert} onClose={this.handleAlertClose} aria-labelledby="form-dialog-title" fullWidth>
                    <DialogTitle id="form-dialog-title">{__('loading.error')}</DialogTitle>
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

                <Dialog open={expand} onClose={this.handleExpandClose} aria-labelledby="form-dialog-title" fullWidth>
                    <CardHeader 
                        avatar={
                            <Avatar>∞</Avatar>
                        }
                        title={expandNote.user.nickname}
                        subheader={time.toLocaleString()}
                        action={
                            <IconButton onClick={this.handleExpandClose} color="primary">
                                <CloseIcon />
                            </IconButton>
                        } 
                    />
                    <DialogContent>
                        <Typography component="div" style={{wordBreak: 'break-word'}}>
                            <Markdown source={expandNote.content} renderers={{code: CodeRender}} />
                        </Typography>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default NoteFlow
