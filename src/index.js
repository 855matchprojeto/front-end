import React, { createContext, useMemo, useState } from "react";
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
import ProjetoEditar from "./pages/ProjetoEditar";

import { StyledEngineProvider } from "@mui/material/styles";
import { estaLogado } from "./services/auth";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getPrefMode,setPrefMode } from "./services/util";
export const ColorModeContext = createContext({ toggleColorMode: () => {} });


function RouteProtection()
{
  const [mode, setMode] = useState(getPrefMode);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        (mode === 'dark') ? setPrefMode('light') : setPrefMode('dark');
      },
    }),
    [mode],
  );

  const myTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

 
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={myTheme}>
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

                <Route
                  exact
                  path="/home"
                  render={() => (estaLogado ? <Base> <Home/> </Base> : <Redirect to="/" />)}
                />
                <Route
                  exact
                  path="/projetos"
                  render={() => (estaLogado ? <Base> <Projetos/> </Base> : <Redirect to="/" />)}
                />
                <Route
                  exact
                  path="/perfil"
                  render={() => (estaLogado ? <Base> <Perfil/> </Base> : <Redirect to="/" />)}
                />

                <Route
                  exact
                  path="/projeto"
                  render={() =>
                    estaLogado ? <Base> <ProjetoInfo/> </Base> : <Redirect to="/" />
                  }
                />

                <Route
                  exact
                  path="/profile"
                  render={() =>
                    estaLogado ? <Base> <ProfileInfo/> </Base> : <Redirect to="/" />
                  }
                />

                <Route
                  exact
                  path="/editproject"
                  render={() =>
                    estaLogado ? <Base> <ProjetoEditar/> </Base> : <Redirect to="/" />
                  }
                />

              <Route exact path='/404' render={() => <Base> <Error/> </Base>}/>
              <Redirect from='*' to='/404' />
            </Switch>
          </Router>
        </StyledEngineProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
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
