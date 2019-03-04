import React, { Component } from 'react'
import Markdown from 'react-markdown'
import { Card, CardHeader, CardContent, Typography, Avatar, Grid } from '@material-ui/core'
import CodeRender from './CodeRender'
import __ from '../../utils/languages'
import ImgRender from './ImgRender'

class Note extends Component {
    render() {
        const { object, onClick } = this.props
        const time = new Date(object.dateSubmitted * 1000)
        const nickname = object.user.nickname
        return (
            <Card onClick={object.truncated ? onClick : null}>
                <CardHeader avatar={
                    <Avatar>∞</Avatar>
                }
                title={nickname === 'anonymous' ? __(nickname) : nickname}
                subheader={time.toLocaleString()} />
                <CardContent style={{paddingTop: 0}}>
                    <Typography component="div" style={{wordBreak: 'break-word'}}>
                        <Markdown 
                            source={object.content + (object.truncated ? '...' : '')} 
                            renderers={{
                                code: CodeRender,
                                image: ImgRender,
                            }}
                        />
                    </Typography>
                    <Grid container justify='flex-end'>
                        <Typography style={{color: 'gray'}}>
                            {object.truncated ? __('expand') : ''}
                        </Typography>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

export default Note
