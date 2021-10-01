import React, {useState} from "react";
import {Link, useHistory } from "react-router-dom";
import Copyright from "../components/Copyright";
import {Formik} from 'formik'
import {makeStyles} from "@mui/styles";
import {Container, Button, TextField, FormControlLabel, Checkbox, Grid, Box, Typography,createTheme,Snackbar,Alert } from "@mui/material";
import * as Yup from "yup";
import {Logar} from "../services/api";

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
  const history = useHistory();

  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState('error');
  const [alertContent, setAlertContent] = useState('');

  function closeAlert(){
    setAlert(false)
  }

  // initial values / validation / login
  const values = {email: '', password: ''}

  async function fazerLogin(values){
    try 
    {
      const Token = await Logar(values)
      console.log(Token)

      if(Token.status === 200)
      {
        history.push('/Home')
      }
    } 
    catch (err) 
    {
      console.log(err)
      setAlertContent(err.response.data.detail)
      setAlert(true)
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("email inválido.")
      .required("digite seu email."),
    password: Yup.string()
      .required("digite sua senha.")
  });

  //---------------------------------------------
  
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>

        <Snackbar open={alert} autoHideDuration={6000} onClose={closeAlert} anchorOrigin={{ vertical:'top', horizontal:'center'}}>
          <Alert onClose={closeAlert} severity={severity} sx={{ width: '100%' }}>
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

              <TextField className={classes.textFieldInput} id="email" name="email" label="email" 
                error={Boolean(props.touched.email && props.errors.email)} 
                helperText={props.errors.email}
                value={props.values.email} onChange={props.handleChange}
              />

              <TextField className={classes.textFieldInput} id="password" name="password" label="senha" 
                type="password" 
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
