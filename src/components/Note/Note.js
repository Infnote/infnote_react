import React, { Component } from 'react'
import { Typography } from '@material-ui/core'


class Note extends Component {
    render() {
        const { object } = this.props 
        return (
            <div>
                <Typography>{ object.title }</Typography>
                <Typography>{ object.content }</Typography>
                <Typography>{ object.dateSubmitted }</Typography>
            </div>
        )
    }
}

export default Note
