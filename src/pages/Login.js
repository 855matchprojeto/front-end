import React from "react";
import { Link, useHistory } from "react-router-dom";
import Copyright from "../components/Copyright";
import {useFormik} from 'formik'
import {
  Container,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
} from "@material-ui/core";

// import {validationSchema} from '../Schema'
import * as yup from "yup";

import { makeStyles } from "@material-ui/core/styles";

const validationSchema = yup.object({
  // email: yup.string().email().required(),
  // password: yup.string().required("Senha é obrigatória"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required")
});


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    marginBottom: theme.spacing(6),
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();
  const history = useHistory();

  function fazerLogin(values){
    history.push('/home')
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {fazerLogin(values)}
  })
  
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>

        <Typography className={classes.title} variant="h4">Match de Projetos</Typography>
        <Typography component="h1" variant="h5"> Login </Typography>

        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            autoFocus
            error={formik.touched.email && Boolean(formik.errors.email)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            value={formik.values.password}
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
          />
          
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Lembrar"/>

          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Entrar
          </Button>

          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" to="/#"> Esqueceu sua senha? </Link>
            </Grid>

            <Grid item xs>
              <Link to="/signup">{" Não tem uma conta? Cadastre-se"}</Link>
            </Grid>
          </Grid>

        </form>
      </div>

      <Box mt={8} mb={4}> <Copyright /> </Box>
    </Container>
  );
};

export default Login;
