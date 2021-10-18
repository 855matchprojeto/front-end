import React, {useState} from "react";
import { Link as RouterLink } from "react-router-dom";

import Copyright from "../components/Copyright";
import {Formik} from 'formik'
import {Container, Button, TextField, Grid, Box, Typography,Snackbar,Alert,Link } from "@mui/material";
import * as Yup from "yup";
import {Logar} from "../services/api";
import {login} from "../services/auth";



const Login = () => {

  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');

  function closeAlert(){
    setAlert(false)
  }

  function recuperarSenha(){
    
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
      <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >

        <Snackbar open={alert} autoHideDuration={6000} onClose={closeAlert} anchorOrigin={{ vertical:'top', horizontal:'center'}}>
          <Alert onClose={closeAlert} severity="error" sx={{ width: '100%' }}>
            {alertContent}
          </Alert>
        </Snackbar>

        <Typography variant="h4">Match de Projetos</Typography>
        <Typography component="h1" variant="h5" sx={{mt: 2}}> Login </Typography>

        <Formik
          initialValues = {values}
          validationSchema = {validationSchema}
          onSubmit = {values => {fazerLogin(values)}}
        >
          {props => (
            <Box component="form" onSubmit={props.handleSubmit} sx={{ mt: 2}}>

              <TextField 
                id="username" 
                name="username" 
                label="Username"
                margin="normal"
                variant="outlined"
                fullWidth
                autoComplete="username" type="text"
                error={Boolean(props.touched.username && props.errors.username)} 
                helperText={props.errors.username}
                value={props.values.username} onChange={props.handleChange}
              />

              <TextField 
                id="password"
                name="password" 
                label="Senha" 
                margin="normal"
                fullWidth
                type="password" autoComplete="current-password"
                error={Boolean(props.touched.password && props.errors.password)}
                helperText={props.errors.password}
                value={props.values.password} onChange={props.handleChange}
              />

              <Button type="submit" variant="contained" fullWidth color="primary"  sx={{ mt: 3, mb: 2 }}> Logar </Button>


              <Grid container>
                <Grid item xs>
                  <Link role='button' variant="body2" onClick={() => recuperarSenha()}>Esqueceu sua senha?</Link>
                </Grid>

                <Grid item xs>
                  <Link role='button' variant="body2" component={RouterLink} to="/signup">Não tem conta? Cadastre-se</Link>
                </Grid>
              </Grid>

            </Box>
          )}
        </Formik>

      </Box>

      <Box mt={6} mb={4}> <Copyright /> </Box>
    </Container>
  );
};

export default Login;