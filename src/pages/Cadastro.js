import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { useSnackbar } from "notistack";

import { Formik } from "formik";
import * as Yup from "yup";
import { Cadastrar, Email } from "../services/api_auth";

import {
  Container,
  Typography,
  TextField,
  Box,
  Link,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Copyright from "../components/Copyright";
import { makeStyles } from "@mui/styles";
import { delay, enqueueMySnackBar } from "../services/util";

//--estilo--
const useStyles = makeStyles(theme => ({
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

function Cadastro()
{
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  // initial values / validation / sign up
  const values = {
    username: "",
    nome: "",
    sobrenome: "",
    email: "",
    password: "",
    password2: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("campo obrigatório."),
    nome: Yup.string().required("campo obrigatório."),
    sobrenome: Yup.string().required("campo obrigatório."),
    email: Yup.string().email("email inválido").required("campo obrigatório."),
    password: Yup.string()
      .min(8, "senha muito curta, deve ter ao minímo 8 caracteres.")
      .matches(
        "(?=.*[0-9])(?=.*[a-z A-Z])(?=.*[!@#$%^&*])",
        "deve conter ao menos um número, letras e um caracter especial."
      )
      .required("campo obrigatório."),
    password2: Yup.string()
      .required("campo obrigatório.")
      .oneOf([Yup.ref("password"), null], "senhas devem ser iguais."),
  });

  async function fazerCadastro(usuario) {
    setIsLoading(true);

    const signup = await Cadastrar(usuario);

    if (signup.status === 200) {
      await Email(signup.data.username);
      const msg = "Cadastrado realizado com sucesso!";
      const type = "success";
      enqueueMySnackBar(enqueueSnackbar,msg,type);
      await delay(2000);
      history.push("/");
    } 
    else 
    {
      const msg = signup.response.data.detail;
      const type = "error";
      enqueueMySnackBar(enqueueSnackbar,msg,type);
    }

    setIsLoading(false);
  }

  //---------------------------------------------

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography className={classes.title} align="center" variant="h4">
          Match de Projetos
        </Typography>
        <Typography component="h1" variant="h5" align="center">
          {" "}
          Cadastro{" "}
        </Typography>

        <Formik
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            fazerCadastro(values);
          }}
        >
          {(props) => (
            <form className={classes.form} onSubmit={props.handleSubmit}>
              <TextField
                className={classes.textFieldInput}
                id="username"
                name="username"
                label="Nome de usuário"
                value={props.values.username}
                onChange={props.handleChange}
                autoComplete="off"
                error={Boolean(props.touched.username && props.errors.username)}
                helperText={props.errors.username}
              />

              <TextField
                className={classes.textFieldInput}
                id="nome"
                name="nome"
                label="Nome"
                value={props.values.nome}
                onChange={props.handleChange}
                autoComplete="off"
                error={Boolean(props.touched.nome && props.errors.nome)}
                helperText={props.errors.nome}
              />

              <TextField
                className={classes.textFieldInput}
                id="sobrenome"
                name="sobrenome"
                label="Sobrenome"
                value={props.values.sobrenome}
                onChange={props.handleChange}
                autoComplete="off"
                error={Boolean(
                  props.touched.sobrenome && props.errors.sobrenome
                )}
                helperText={props.errors.sobrenome}
              />

              <TextField
                className={classes.textFieldInput}
                id="email"
                name="email"
                label="Email"
                error={Boolean(props.touched.email && props.errors.email)}
                helperText={props.errors.email}
                value={props.values.email}
                onChange={props.handleChange}
                autoComplete="off"
              />

              <TextField
                className={classes.textFieldInput}
                id="password"
                name="password"
                label="Senha"
                type="password"
                error={Boolean(props.touched.password && props.errors.password)}
                helperText={props.errors.password}
                value={props.values.password}
                onChange={props.handleChange}
                autoComplete="off"
              />

              <TextField
                className={classes.textFieldInput}
                id="password2"
                name="password2"
                label="Confirmação de senha"
                type="password"
                error={Boolean(
                  props.touched.password2 && props.errors.password2
                )}
                helperText={props.errors.password2}
                value={props.values.password2}
                onChange={props.handleChange}
                autoComplete="off"
              />

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
                fullWidth
                loading={isLoading}
                endIcon={<></>}
                loadingPosition="end"
              >
                Cadastrar
              </LoadingButton>
            </form>
          )}
        </Formik>

        <Link
          className={classes.linkSignin}
          role="button"
          component={RouterLink}
          to="/"
        >
          {" "}
          Já tem uma conta? Logar{" "}
        </Link>
        <Box mt={6} mb={4}>
          {" "}
          <Copyright />{" "}
        </Box>
      </div>
    </Container>
  );
};

export default Cadastro;