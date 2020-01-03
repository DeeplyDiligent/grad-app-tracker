import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./styles/App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import GradConnection from "./pages/gradconnection";
import store from "store";
import observe from "store/plugins/observe";
import GradAustralia from "./pages/gradAustralia";
import GetHighered from "./pages/getHighered";

function App() {
  useEffect(() => {
    store.addPlugin(observe)
  }, []);
  return (
    <Router>
      <div className="App">
        <div className="main">
          <Switch>
            <Route path="/gradconnection">
              <GradConnection />
            </Route>
            <Route path="/gradaustralia">
              <GradAustralia />
            </Route>
            <Route path="/gethighered">
              <GetHighered />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;