import React from 'react'
import './popup.styl'
import Login from './pages/login'
import Home from './pages/home'
import EthAccount from './pages/home/children/ethAccount/index'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'

function Popup() {
    return (
        <HashRouter>
            <Switch>
                <Route key="/login" path="/login" component={Login} />
                <Route path="/home" path="/home" component={Home} />
                <Route path="/ethAccount" path="/ethAccount" component={EthAccount} />
                {
                    window.localStorage.getItem('wallet')  
                        ? <Redirect to="/home"/>
                        : <Redirect to="/login"/>
                }
            </Switch>
        </HashRouter>
    )
}

export default Popup