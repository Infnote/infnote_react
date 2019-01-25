import React, { Component } from 'react'
import { Card, CardHeader, CardContent, Typography, Avatar} from '@material-ui/core'

class Note extends Component {
    render() {
        const { object } = this.props
        return (
            <Card>
                <CardHeader avatar={
                    <Avatar>R</Avatar>
                }
                title={ object.user.nickname }
                subheader={ object.dateSubmitted }/>
                <CardContent>
                    <Typography>
                        { object.title }
                    </Typography>
                    <Typography>
                        { object.content }
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default Note
