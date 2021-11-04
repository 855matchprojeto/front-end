import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import {Formik} from 'formik'
import * as Yup from "yup";
import { Cadastrar, Email } from "../services/api";

import { Container, Typography, TextField, Button, Box, createTheme, Alert, Snackbar, Link } from "@mui/material";
import Copyright from "../components/Copyright";
import { makeStyles } from "@mui/styles";
import { delay } from "../services/util";

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

  form: {
    width: "100%", // Fix IE 11 issue.
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(1),
  },
  
  textFieldInput: {
    marginTop: theme.spacing(2),
  },

  submit: {
    marginTop: theme.spacing(2),
  },

  linkSignin: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
}));
//---------

const EsqueciSenha = () => {
  const classes = useStyles();
  let history = useHistory();

  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [alertContent, setAlertContent] = useState('');

  function closeAlert(){
    setAlert(false)
  }

  // initial values / validation / sign up
  const values = {email: '', password: '', password2: ''}

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("email inválido")
      .required("campo obrigatório."),
    password: Yup.string()
      .min(8, "senha muito curta, deve ter ao minímo 8 caracteres.")
      .matches("(?=.*[0-9])(?=.*[a-z A-Z])(?=.*[!@#$%^&*])","deve conter ao menos um número, letras e um caracter especial.")
      .required("campo obrigatório."),
    password2: Yup.string()
      .required("campo obrigatório.")
      .oneOf([Yup.ref('password'), null], 'senhas devem ser iguais.')
  });

  async function fazerCadastro(usuario) {
    try 
    {
      const signup = await Cadastrar(usuario)

      if(signup.status === 200)
      {
        setSeverity('success')
        setAlertContent('Cadastrado com sucesso!')
        await Email(signup.data.username)
        
        setAlert(true)

        await delay(5000)
        history.push('/')
      }
    } 
    catch (err) 
    {
      setSeverity('error')
      setAlertContent(err.response.data.detail)
      setAlert(true)
    }
  }

  //---------------------------------------------

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>

        <Snackbar open={alert} autoHideDuration={6000} onClose={closeAlert} anchorOrigin={{ vertical:'top', horizontal:'center'}}>
          <Alert onClose={closeAlert} severity={severity} sx={{ width: '100%' }}>
            {alertContent}
          </Alert>
        </Snackbar>
        
        <Typography className={classes.title} align="center" variant="h4">Match de Projetos</Typography>
        <Typography component="h1" variant="h5" align="center"> Cadastro </Typography>

        <Formik
          initialValues = {values}
          validationSchema = {validationSchema}
          onSubmit = {values => {fazerCadastro(values)}}
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

              <TextField className={classes.textFieldInput} id="password2" name="password2" label="confirmação de senha" 
                type="password" 
                error={Boolean(props.touched.password2 && props.errors.password2)}
                helperText={props.errors.password2}
                value={props.values.password2} onChange={props.handleChange}
              />

              <Button type="submit" variant="contained" fullWidth color="primary" className={classes.submit}> Cadastrar </Button>
            </form>
          )}
        </Formik>

        <Link className={classes.linkSignin} role='button' component={RouterLink} to="/"> Já tem uma conta? Logar </Link>
        <Box mt={6} mb={4}> <Copyright /> </Box>
      </div>
    </Container>
  );
};

export default EsqueciSenha;
