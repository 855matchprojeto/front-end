import React, {useState} from "react";
import {Link } from "react-router-dom";
import Copyright from "../components/Copyright";
import {Formik} from 'formik'
import {makeStyles} from "@mui/styles";
import {Container, Button, TextField, FormControlLabel, Checkbox, Grid, Box, Typography,createTheme,Snackbar,Alert } from "@mui/material";
import * as Yup from "yup";
import {Logar} from "../services/api";
import {login} from "../services/auth";
import { useHistory } from "react-router-dom";

//--estilo--
const theme = createTheme();

const useStyles = makeStyles( ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    position: "relative",
    flexDirection: "column",
    alignItems: "center",
  },
  
  title: {
    marginBottom: theme.spacing(1),
  },

  textFieldInput: {
    marginTop: theme.spacing(2),
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
}));
//---------

const Login = () => {
  const classes = useStyles();

  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');

  function closeAlert(){
    setAlert(false)
  }

  // initial values / validation / login
  const values = {username: '', password: ''}

  async function fazerLogin(values){
    try 
    {
      const Token = await Logar(values);

      if(Token.status === 200)
      {
        login(Token.data.access_token);
      }
    } 
    catch (err) 
    {
      setAlertContent(err.response.data.detail)
      setAlert(true)
    }
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("digite seu username."),
    password: Yup.string()
      .required("digite sua senha.")
  });

  //---------------------------------------------
  
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>

        <Snackbar open={alert} autoHideDuration={6000} onClose={closeAlert} anchorOrigin={{ vertical:'top', horizontal:'center'}}>
          <Alert onClose={closeAlert} severity="error" sx={{ width: '100%' }}>
            {alertContent}
          </Alert>
        </Snackbar>

        <Typography className={classes.title} variant="h4">Match de Projetos</Typography>
        <Typography component="h1" variant="h5"> Login </Typography>

        <Formik
          initialValues = {values}
          validationSchema = {validationSchema}
          onSubmit = {values => {fazerLogin(values)}}
        >
          {props => (
            <form className={classes.form} onSubmit={props.handleSubmit}>

              <TextField className={classes.textFieldInput} id="username" name="username" label="username" 
                autoComplete="username" type="text"
                error={Boolean(props.touched.username && props.errors.username)} 
                helperText={props.errors.username}
                value={props.values.username} onChange={props.handleChange}
              />

              <TextField className={classes.textFieldInput} id="password" name="password" label="senha" 
                type="password" autoComplete="current-password"
                error={Boolean(props.touched.password && props.errors.password)}
                helperText={props.errors.password}
                value={props.values.password} onChange={props.handleChange}
              />

              <Button type="submit" variant="contained" fullWidth color="primary" className={classes.submit}> Logar </Button>

              <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Lembrar"/>

              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" to="/#">Esqueceu sua senha?</Link>
                </Grid>

                <Grid item xs>
                  <Link to="/signup">Não tem conta? Cadastre-se</Link>
                </Grid>
              </Grid>

            </form>
          )}
        </Formik>

      </div>

      <Box mt={6} mb={4}> <Copyright /> </Box>
    </Container>
  );
};

export default Login;