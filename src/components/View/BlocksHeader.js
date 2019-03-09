import React, { Component, Fragment } from 'react'
import Grid from '@material-ui/core/Grid'

class BlocksHeader extends Component {
    render() {
        return (
            <Fragment>
                <Grid item xs={1}>Height</Grid>
                <Grid item xs={2}>Timestamp</Grid>
                <Grid item xs={1}>Size</Grid>
                <Grid item xs={8}>Signature</Grid>
            </Fragment>
        )
    }
}

export default BlocksHeader