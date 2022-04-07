import React from "react";
import ReactDOM from "react-dom";
import { SnackbarProvider } from "notistack";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { CssBaseline } from "@mui/material";

import 'overlayscrollbars/css/OverlayScrollbars.css';
import "./index.css";
import Base from "./pages/Base";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";

import Error from "./pages/Error";

import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import Projetos from "./pages/Projetos";
import ProjetoInfo from "./pages/ProjetoInfo";
import ProfileInfo from "./pages/ProfileInfo";
import EditProject from "./pages/EditProject";

import { StyledEngineProvider } from "@mui/material/styles";
import { estaLogado } from "./services/auth";

const RouteProtection = () => {
  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (!estaLogado ? <Login /> : <Redirect to="/home" />)}
          />
          <Route
            exact
            path="/signup"
            render={() =>
              !estaLogado ? <Cadastro /> : <Redirect to="/home" />
            }
          />

          <Route exact path="/forgotpassword" render={() => <EsqueciSenha />} />

          <Base>
            <Route
              exact
              path="/home"
              render={() => (estaLogado ? <Home /> : <Redirect to="/" />)}
            />
            <Route
              exact
              path="/projetos"
              render={() => (estaLogado ? <Projetos /> : <Redirect to="/" />)}
            />
            <Route
              exact
              path="/perfil"
              render={() => (estaLogado ? <Perfil /> : <Redirect to="/" />)}
            />

            <Route
              exact
              path="/projeto"
              render={() =>
                estaLogado ? <ProjetoInfo /> : <Redirect to="/" />
              }
            />

            <Route
              exact
              path="/profile"
              render={() =>
                estaLogado ? <ProfileInfo /> : <Redirect to="/" />
              }
            />

            <Route
              exact
              path="/editproject"
              render={() =>
                estaLogado ? <EditProject /> : <Redirect to="/" />
              }
            />
          </Base>

          <Route path="*" component={Error} />
        </Switch>
      </Router>
    </StyledEngineProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider>
      <RouteProtection />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
