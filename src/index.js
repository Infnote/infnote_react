import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import { App } from 'components/App'
import Chain from './Chain'
import * as serviceWorker from './serviceWorker'
import { Route, BrowserRouter } from 'react-router-dom'
import {Storage} from 'utils'
import {Peers} from './network'

Storage.migrate()
Peers.migrate()

let routes = (
    <BrowserRouter>
        <div>
            <Route exact path="/" component={App} />
            <Route path="/chain" component={Chain} />
        </div>
    </BrowserRouter>
)

ReactDOM.render(routes, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
