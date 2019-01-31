import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import { NoteCard, PostForm } from '.'
import { NoteModel, Store } from 'models'

class NoteFlow extends Component {
    state = {
        notes: [],
        page: 1
    }

    update = (page, clear) => {
        NoteModel.fetch(page)
            .then(notes => {
                this.setState({
                    notes: clear ? notes : [...this.state.notes, ...notes],
                    page: page
                })
            })
            .catch(error => {
                if (error.response.status !== 404) {
                    console.log(error.repsonse.data)
                }
            })
    }

    bottomEvent = () => {
        const el = document.getElementById(this.state.notes.length - 1)
        if (el.getBoundingClientRect().bottom <= window.innerHeight) {
            this.update(this.state.page + 1)
        }
    }

    componentDidMount() {
        this.update(1)
        document.addEventListener('scroll', this.bottomEvent)
    }

    componentWillMount() {
        this.unsubscribe = Store.subscribe(() => {
            const save = Store.getState().refresh
            if (save) {
                this.setState({ notes: []})
                this.update(1, true)
            }
        })
    }

    componentWillUnmount() {
        this.setState({ notes: [], page: 0 })
        document.removeEventListener('scroll', this.bottomEvent)
        this.unsubscribe()
    }

    render() {
        const { notes } = this.state
        const flow = notes.map((note, index) => (
            <Grid item key={index} id={index}>
                <NoteCard object={note} />
            </Grid>
        ))
        return (
            <Grid container justify="center">
                <Grid item xs={11} sm={8} md={5}>
                    <Grid container direction="column" spacing={16}>
                        <Grid item>
                            <PostForm/>
                        </Grid>
                        {flow}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default NoteFlow
