import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Copyright from "../components/Copyright";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import {
  Container,
  TextField,
  Grid,
  Box,
  Typography,
  Link,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";
import { Logar } from "../services/api_auth";
import { login } from "../services/auth";
import { enqueueMySnackBar } from "../services/util";

function Login()
{
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  // initial values / validation / login
  const values = { username: "", password: "" };

  async function fazerLogin(values) {
    setIsLoading(true);

    const Token = await Logar(values);

    if (Token.status === 200) 
      login(Token.data.access_token);
    else 
      enqueueMySnackBar(enqueueSnackbar, Token.response.data.message, "error");

    setIsLoading(false);
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Digite seu nome de usuário."),
    password: Yup.string().required("Digite sua senha."),
  });

  //---------------------------------------------

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" align="center">Match de Projetos</Typography>
          <Typography component="h1" variant="h5" sx={{ mt: 2 }} align="center">
            {" "}
            Login{" "}
          </Typography>

          <Formik
            initialValues={values}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              fazerLogin(values);
            }}
          >
            {(props) => (
              <Box
                component="form"
                onSubmit={props.handleSubmit}
                sx={{ mt: 2, position: "relative" }}
              >
                <TextField
                  id="username"
                  name="username"
                  label="Nome de Usuário"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  autoComplete="username"
                  type="text"
                  error={Boolean(
                    props.touched.username && props.errors.username
                  )}
                  helperText={props.errors.username}
                  value={props.values.username}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />

                <TextField
                  id="password"
                  name="password"
                  label="Senha"
                  margin="normal"
                  fullWidth
                  type="password"
                  autoComplete="current-password"
                  error={Boolean(
                    props.touched.password && props.errors.password
                  )}
                  helperText={props.touched.password && props.errors.password}
                  value={props.values.password}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />

                <LoadingButton
                  type="submit"
                  loading={isLoading}
                  loadingPosition="end"
                  variant="contained"
                  color="primary"
                  endIcon={<></>}
                  sx={{ mt: 3, mb: 2 }}
                  fullWidth
                >
                  Logar
                </LoadingButton>

                <Grid container>
                  <Grid item xs>
                    <Link
                      role="button"
                      variant="body2"
                      component={RouterLink}
                      to="/forgotpassword"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </Grid>

                  <Grid item xs>
                    <Link
                      role="button"
                      variant="body2"
                      component={RouterLink}
                      to="/signup"
                    >
                      Não tem conta? Cadastre-se
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Formik>
        </Box>

        <Box mt={6} mb={4}>
          {" "}
          <Copyright />{" "}
        </Box>
      </Container>
    </>
  );
};

export default Login;