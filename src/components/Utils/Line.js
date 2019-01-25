import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = {
    line: {
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        width: '100%',
    }
}


class Line extends Component {
    render() {
        const { classes, width, color } = this.props
        return (
            <div className={classes.line} style={{
                borderBottomColor: color,
                borderBottomWidth: width,
            }}></div>
        )
    }
}

export default withStyles(styles)(Line)
