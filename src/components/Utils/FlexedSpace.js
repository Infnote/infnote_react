import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

// TODO: Add all flexed size
const flexedStyles = theme => {
    const up = theme.breakpoints.up
    return {
        xs4: { [up(0)]: { height: 1 }, [up('xs')]: {}, [up('sm')]: {}, [up('md')]: {}, [up('lg')]: {}, [up('xl')]: {},},
        xs3: { height: 10 },
        xxs: { height: 15 },
        xs:  { height: 20 },
        sm:  { height: 25 },
        md:  { height: 40 },
        lg:  { height: 60 },
        xl:  { height: 80 },
        xxl: { height: 100 },
        xl3: { height: 150 },
        xl4: { height: 220 },
    }
}


class FlexedSpace extends Component {
    render() {
        const { classes } = this.props
        const { size } = this.props
        return (
            <div className={classes[size]}></div>
        )
    }
}


export default withStyles(flexedStyles)(FlexedSpace)
