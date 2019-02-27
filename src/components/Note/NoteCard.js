import React, { Component } from 'react'
import { Card, CardHeader, CardContent, Typography, Avatar } from '@material-ui/core'

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
        const { object } = this.props
        let time = Note.timeConverter(object.dateSubmitted)
        return (
            <Card>
                <CardHeader avatar={
                    <Avatar>∞</Avatar>
                }
                title={object.user.nickname}
                subheader={time.toString()} />
                <CardContent>
                    <Typography style={{wordBreak: 'break-word'}}>
                        {object.content}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default Note
