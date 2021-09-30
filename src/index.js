import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import "./index.css";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

import Error from "./pages/Error";

import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import Projetos from "./pages/Projetos";
import Interesses from "./pages/Interesses";
import ProjetoInfo from "./pages/ProjetoInfo";

import { StyledEngineProvider } from '@mui/material/styles';

const RouteProtection = () => {
  const logado = false; // verificar token válido pela chamada de API

  return(
    <StyledEngineProvider injectFirst>
      <CssBaseline />

      <Router>
        <Switch>
          <Route exact path="/" render={() => !logado ? <Login/> : <Redirect to="/home" />}/>
          <Route exact path="/signup" render={() => !logado ? <Cadastro/> : <Redirect to="/home" />}/>

          <Route exact path="/home" render={() => logado ? <Home/> : <Redirect to="/" />}/>
          <Route exact path="/projetos" render={() => logado ? <Projetos/> : <Redirect to="/" />}/>
          <Route exact path="/interesses" render={() => logado ? <Interesses/> : <Redirect to="/" />}/>
          <Route exact path="/perfil" render={() => logado ? <Perfil/> : <Redirect to="/" />}/>

          <Route exact path="/projetoInfo" render={() => logado ? <ProjetoInfo/> : <Redirect to="/" />}/>

          <Route path="*" component={Error} />
        </Switch>
      </Router>
    </StyledEngineProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <RouteProtection/>
  </React.StrictMode>,
  document.getElementById("root")
);
