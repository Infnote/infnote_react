import React, { Component } from 'react'
// import { Route } from 'react-router-dom'
import { NoteFlow } from 'components/Note'
import { NavBar } from 'components/NavBar'
import FixedSpace from 'components/Utils/FixedSpace'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
        fontFamily: [
            'Avenir Next', 
            '-apple-system', 
            'BlinkMacSystemFont', 
            'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 
            'Droid Sans', 'Helvetica Neue',
        ]
    }
})

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <NavBar />
                <FixedSpace size="xl" />
                <NoteFlow />
            </MuiThemeProvider>
        )
    }
}

export default App