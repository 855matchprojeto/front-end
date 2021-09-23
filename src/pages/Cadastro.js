import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {useFormik} from 'formik'
import { Container, Typography, TextField, Button, Box, makeStyles} from "@material-ui/core";
import Copyright from "../components/Copyright";
import { Cadastrar } from "../services/api";

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
  //const history = useHistory();

  function fazerCadastro(usuario) {

    Cadastrar(usuario);
    //console.log(usuario);
    //history.push("/home");
  }

  const formik = useFormik({
    initialValues: {
      nome: '',
      sobrenome: '',
      email: '',
      password: '',
      password2: ''
    },
    onSubmit: values => {fazerCadastro(values)}
  })

  return (
    <>
      <Container className="paper" maxWidth="xs">
        <Typography className={classes.title} align="center" variant="h4">Match de Projetos</Typography>
        <Typography component="h1" variant="h5" align="center"> Cadastro </Typography>

        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <TextField className={classes.textFieldInput} 
                     id="nome"
                     type="input" 
                     label="Nome" 
                     value={formik.values.nome} 
                     onChange={formik.handleChange}/>

          <TextField className={classes.textFieldInput} 
                     id="sobrenome"
                     type="input" 
                     label="Sobrenome" 
                     value={formik.values.sobrenome} 
                     onChange={formik.handleChange}/>

          <TextField className={classes.textFieldInput} 
                     id="email"
                     type="email"
                     label="Email" 
                     value={formik.values.email} 
                     onChange={formik.handleChange}/>

          <TextField className={classes.textFieldInput} 
                     id="password" 
                     type="password" 
                     label="Senha" 
                     value={formik.values.password} 
                     onChange={formik.handleChange}/>

          <TextField className={classes.textFieldInput} 
                     id="password2" 
                     type="password" 
                     label="Confirmar Senha" 
                     value={formik.values.password2} 
                     onChange={formik.handleChange}/>

          <Button className={classes.btnSubmit} type="submit" variant="contained" color="primary">
            Cadastrar
          </Button>
        </form>

        <Link className={classes.linkSignin} to="/"> Já tem uma conta? Logar </Link>
        <Box mt={6} mb={4}> <Copyright /> </Box>
      </Container>
    </>
  );
};

export default Cadastro;
