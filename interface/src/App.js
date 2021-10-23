import React from "react";
import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import './App.css'
import Header from './components/header'
import Home from './pages/home/index.js'
// import Swap from './pages/swap/index.js'
// import Liquidity from './pages/liquidity/index.js'
// import Dfinity from './pages/dfinity/index.js'
import Download from './pages/download/index.js'

export default function App() {
  return <div className="Layout">
      <HashRouter>
        <Header/>
        <Switch>
          <Route exact path="/">
            <div className="Content"><Home/></div>
          </Route>
          <Route path="/download">
            <div className="Content"><Download/></div>
          </Route>
          <Redirect to='/' />
          {/* <Route path="/liquidity">
            <div className="Content"><Liquidity/></div>
          </Route>
          <Route path="/swap">
            <div className="Content"><Swap/></div>
          </Route> */}
          {/* <Route path="/dfinity">
            <div className="Content"><Dfinity/></div>
          </Route> */}
        </Switch>
      </HashRouter>
  </div>
  
}