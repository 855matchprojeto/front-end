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
import ProjetoInfo from "./pages/ProjetoInfo";

ReactDOM.render(
  <React.StrictMode>
    <>

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

          <Route path="/projetoInfo">
            <ProjetoInfo />
          </Route>
          
        </Switch>
      </Router>

    </>
  </React.StrictMode>,
  document.getElementById("root")
);
