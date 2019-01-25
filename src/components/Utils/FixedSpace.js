import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

const fixedStyles = {
    xs4: { height: 5 },
    xs3: { height: 10 },
    xs2: { height: 15 },
    xs:  { height: 20 },
    sm:  { height: 25 },
    md:  { height: 40 },
    lg:  { height: 60 },
    xl:  { height: 80 },
    xl2: { height: 100 },
    xl3: { height: 150 },
    xl4: { height: 220 },
}


class FixedSpace extends Component {
    render() {
        const { classes, size, className } = this.props
        return (
            <div className={classNames(classes[size], className)}></div>
        )
    }
}

export default withStyles(fixedStyles)(FixedSpace)

