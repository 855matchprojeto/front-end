import React from "react";
import Base from "./Base";
import { Container, Typography, makeStyles, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(5),
  },
  textField: {
    marginBottom: theme.spacing(3),
  },
  title: {
    marginTop: theme.spacing(4),
  },
}));

const Perfil = () => {
  const classes = useStyles();
  
  return (
    <Base>
      <Container className={classes.container}>

        <Typography className={classes.title} variant="h4"> Perfil </Typography>

        <form className={classes.form}>
          <TextField className={classes.textField} type="input" label="Email" value="" placeholder="Email" disabled/>
          <TextField className={classes.textField} type="input" label="Name" value="" placeholder="Name"/>
          <TextField className={classes.textField} type="input" label="Sobrenome" value="" placeholder="Sobrenome"/>
        </form>

      </Container>
    </Base>
  );
};

export default Perfil;