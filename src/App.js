import React, {useEffect, useState} from "react";
import "./styles/App.css";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./pages/home";
import GradConnection from "./pages/gradconnection";
import store from "store";
import observe from "store/plugins/observe";
import GradAustralia from "./pages/gradAustralia";
import GetHighered from "./pages/getHighered";
import Iaeste from "./pages/iaeste";
import Whirlpool from "./pages/whirlpool";
import "firebase/analytics";
import {fetchFirebase} from "./utils/data";

function App() {
    store.addPlugin(observe)
    const [email, setEmail] = useState(store.get('email'))
    useEffect(()=>{
        let listener = store.observe('email',(email)=>{
            if(email) setEmail(email)
        })
        return () => store.unobserve(listener)
    },[])

    useEffect(()=>{
        if(email){
            fetchFirebase()
        } else {
            console.log('not fetched - no email')
        }
    },[])
    console.log(email)
    if (!email) return <Router><Home/></Router>
    return (
        <Router>
            <div className="App">
                <div className="main">
                    <Switch>
                        <Route path="/gradconnection">
                            <GradConnection/>
                        </Route>
                        <Route path="/gradaustralia">
                            <GradAustralia/>
                        </Route>
                        <Route path="/gethighered">
                            <GetHighered/>
                        </Route>
                        <Route path="/iaeste">
                            <Iaeste/>
                        </Route>
                        <Route path="/whirlpool">
                            <Whirlpool/>
                        </Route>
                        <Route path="/">
                            <Home/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
