import React, { Component } from 'react'
import { Card, CardHeader, CardContent, Typography, Avatar, withStyles } from '@material-ui/core'

const style = {
    title: {
        fontWeight: 'bold'
    }
}

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
        const { object, classes } = this.props
        let time = Note.timeConverter(object.dateSubmitted)
        return (
            <Card>
                <CardHeader avatar={
                    <Avatar>∞</Avatar>
                }
                title={object.user.nickname}
                subheader={time.toString()} />
                <CardContent>
                    <Typography className={classes.title}>
                        {object.title}
                    </Typography>
                    <Typography >
                        {object.content}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(style)(Note)
