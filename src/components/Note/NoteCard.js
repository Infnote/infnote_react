import React, { Component } from 'react'
import Markdown from 'react-markdown'
import { Card, CardHeader, CardContent, Typography, Avatar } from '@material-ui/core'
import CodeRender from './CodeRender'

class Note extends Component {
    render() {
        const { object, onClick } = this.props
        let time = new Date(object.dateSubmitted * 1000)
        return (
            <Card onClick={onClick}>
                <CardHeader avatar={
                    <Avatar>∞</Avatar>
                }
                title={object.user.nickname}
                subheader={time.toLocaleString()} />
                <CardContent style={{paddingTop: 0}}>
                    <Typography component="div" style={{wordBreak: 'break-word'}}>
                        <Markdown source={object.content} renderers={{code: CodeRender}} />
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default Note
