import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  makeStyles,
} from "@material-ui/core";
import Copyright from "./Copyright";

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
const Cadastro = () => {
  const classes = useStyles();
  return (
    <>
      <Container className="paper" maxWidth="xs">
        <Typography className={classes.title} align="center" variant="h4">
          Match de Projetos
        </Typography>
        <Typography component="h1" variant="h5" align="center">
          Sign Up
        </Typography>
        <form className={classes.form}>
          <TextField
            className={classes.textFieldInput}
            type="input"
            label="Nome"
          />
          <TextField
            className={classes.textFieldInput}
            type="input"
            label="Sobrenome"
          />
          <TextField
            className={classes.textFieldInput}
            type="email"
            label="Email"
          />
          <TextField
            className={classes.textFieldInput}
            type="password"
            label="Senha"
          />
          <TextField
            className={classes.textFieldInput}
            type="password"
            label="Confirmar Senha"
          />
          <Button
            className={classes.btnSubmit}
            type="submit"
            variant="contained"
            color="primary"
          >
            Cadastrar
          </Button>
        </form>
        <Link className={classes.linkSignin} to="/">
          <Typography variant="p" align="center">
            Already have an account? Sign In
          </Typography>
        </Link>

        <Box mt={8} mb={4}>
          <Copyright />
        </Box>
      </Container>
    </>
  );
};

export default Cadastro;
