import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardHeader, CardContent, Typography, Avatar } from '@material-ui/core'
import CodeRender from './CodeRender'

class Note extends Component {

    static timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000)
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        var year = a.getFullYear()
        var month = months[a.getMonth()]
        var date = a.getDate()
        var hour = a.getHours()
        var min = a.getMinutes()
        var sec = a.getSeconds()
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec 
        return time
    }

    render() {
        const { object, onClick } = this.props
        let time = Note.timeConverter(object.dateSubmitted)
        return (
            <Card onClick={onClick}>
                <CardHeader avatar={
                    <Avatar>∞</Avatar>
                }
                title={object.user.nickname}
                subheader={time.toString()} />
                <CardContent>
                    <Typography component="div" style={{wordBreak: 'break-word'}}>
                        <ReactMarkdown source={object.content} renderers={{code: CodeRender}} />
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default Note
