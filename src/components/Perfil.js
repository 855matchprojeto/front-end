import React from "react";
import { Container, Typography, makeStyles } from "@material-ui/core";
import Header from "./Header";

const useStyles = makeStyles((theme) => ({
  container: { marginTop: theme.spacing(1) },
}));
const Perfil = () => {
  const classes = useStyles();
  return (
    <>
      <Header />
      <Container className={classes.container}>
        <Typography variant="h5">Perfil</Typography>
      </Container>
    </>
  );
};

export default Perfil;
