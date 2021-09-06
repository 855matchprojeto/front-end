import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import { CssBaseline } from "@material-ui/core";

function App() {
  return (
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
        </Switch>
      </Router>
    </div>
  );
}

export default App;
