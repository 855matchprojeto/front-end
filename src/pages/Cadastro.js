import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {Formik} from 'formik'
import { Container, Typography, TextField, Button, Box, makeStyles} from "@material-ui/core";
import Copyright from "../components/Copyright";
import { Cadastrar } from "../services/api";
import * as Yup from "yup";

//--estilo--
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(3),
  },

  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(1),
  },
  textFieldInput: {
    marginTop: theme.spacing(2),
  },

  btnSubmit: {
    marginTop: theme.spacing(4),
  },

  linkSignin: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
  },
}));
//---------

const Cadastro = () => {
  const classes = useStyles();
  const history = useHistory();

  // initial values / validation / sign up
  const values = {nome: '', sobrenome: '', email: '', password: '', password2: ''}

  const validationSchema = Yup.object().shape({
    nome: Yup.string()
      .required("campo obrigatório."),
    sobrenome: Yup.string()
      .required("campo obrigatório."),
    email: Yup.string()
      .email("email inválido")
      .required("campo obrigatório."),
    password: Yup.string()
      .min(8, "senha muito curta, deve ter ao minímo 8 caracteres.")
      .matches("^(?=.*[0-9])(?=.*[!@#$&*])(?=.*[a-z])$","deve conter ao menos um número, letras e um caracter especial.")
      .required("campo obrigatório."),
    password2: Yup.string()
      .required("campo obrigatório.")
      .oneOf([Yup.ref('password'), null], 'senhas devem ser iguais.')
  });

  async function fazerCadastro(usuario) {
    let signup = await Cadastrar(usuario)
    
    if (signup.status === 200){
      //let econf = await ConfirmaEmail()
      history.push("/")
    }
  }

  //---------------------------------------------

  return (
    <>
      <Container className="paper" maxWidth="xs">
        <Typography className={classes.title} align="center" variant="h4">Match de Projetos</Typography>
        <Typography component="h1" variant="h5" align="center"> Cadastro </Typography>

        <Formik
          initialValues = {values}
          validationSchema = {validationSchema}
          onSubmit = {values => {fazerCadastro(values)}}
        >
          {props => (
            <form className={classes.form} onSubmit={props.handleSubmit}>
              <TextField className={classes.textFieldInput} id="nome" name="nome" label="nome" 
                value={props.values.nome} onChange={props.handleChange} error={props.errors.nome} helperText={props.errors.nome}
              />

              <TextField className={classes.textFieldInput} id="sobrenome" name="sobrenome" label="sobrenome" 
                value={props.values.sobrenome} onChange={props.handleChange}  error={props.errors.sobrenome} helperText={props.errors.sobrenome}
              />

              <TextField className={classes.textFieldInput} id="email" name="email" label="email" 
                error={props.errors.email} helperText={props.errors.email}
                value={props.values.email} onChange={props.handleChange}
              />

              <TextField className={classes.textFieldInput} id="password" name="password" label="senha" 
                type="password" error={props.errors.password} helperText={props.errors.password}
                value={props.values.password} onChange={props.handleChange}
              />

              <TextField className={classes.textFieldInput} id="password2" name="password2" label="confirmação de senha" 
                type="password" error={props.errors.password2} helperText={props.errors.password2}
                value={props.values.password2} onChange={props.handleChange}
              />

              <Button className={classes.btnSubmit} type="submit" variant="contained" color="primary"> Cadastrar </Button>
            </form>
          )}
        </Formik>

        <Link className={classes.linkSignin} to="/"> Já tem uma conta? Logar </Link>
        <Box mt={6} mb={4}> <Copyright /> </Box>
      </Container>
    </>
  );
};

export default Cadastro;
