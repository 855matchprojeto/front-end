import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";

import "./index.css";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import Projetos from "./pages/Projetos";
import Interesses from "./pages/Interesses";

ReactDOM.render(
  <React.StrictMode>
    <div className="App">

      <CssBaseline />

      <Router>
        <Switch>
          <Route path="/" exact>
            <Login />
          </Route>

          <Route path="/signup">
            <Cadastro />
          </Route>

          <Route path="/home">
            <Home />
          </Route>

          <Route path="/projetos">
            <Projetos />
          </Route>

          <Route path="/interesses">
            <Interesses />
          </Route>

          <Route path="/perfil">
            <Perfil />
          </Route>
          
        </Switch>
      </Router>

    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
