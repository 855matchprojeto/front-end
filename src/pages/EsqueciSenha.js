import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";
import { Email } from "../services/api_auth";

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import Copyright from "../components/Copyright";
import { makeStyles } from "@mui/styles";
import { delay } from "../services/util";

//--estilo--
const useStyles = makeStyles((theme) => ({
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

function EsqueciSenha() {
  const classes = useStyles();
  let history = useHistory();

  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [alertContent, setAlertContent] = useState("");

  function closeAlert() {
    setAlert(false);
  }

  // initial values / validation / sign up
  const values = { email: "", password: "", password2: "" };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("email inválido").required("campo obrigatório."),
  });

  async function enviarEmail(usuario) {
    console.log(usuario);
    return;
    try {
      // TODO: - cadastrar usuário
      const signup = await Email(usuario);

      if (signup.status === 200) {
        setSeverity("success");
        setAlertContent("Email enviado com sucesso!");
        await Email(signup.data.username);

        setAlert(true);

        await delay(5000);
        history.push("/");
      }
    } catch (err) {
      setSeverity("error");
      setAlertContent(err.response.data.detail);
      setAlert(true);
    }
  }

  //---------------------------------------------

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Snackbar
          open={alert}
          autoHideDuration={6000}
          onClose={closeAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={closeAlert}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {alertContent}
          </Alert>
        </Snackbar>

        <Typography className={classes.title} align="center" variant="h4">
          Match de Projetos
        </Typography>
        <Typography component="h1" variant="h5" align="center">
          {" "}
          Esqueci minha senha{" "}
        </Typography>

        <Formik
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            enviarEmail(values);
          }}
        >
          {(props) => (
            <form
              className={classes.form}
              onSubmit={props.handleSubmit}
              sx={{ mt: 2 }}
            >
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
                className={classes.submit}
              >
                {" "}
                Enviar e-mail de recuperação{" "}
              </Button>
            </form>
          )}
        </Formik>
        <Box mt={1} mb={1}>
          <Copyright />
        </Box>
      </div>
    </Container>
  );
}

export default EsqueciSenha;
