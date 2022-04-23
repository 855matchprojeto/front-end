import React from "react";
import { Container, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MeusDados from "../components/MeusDados";

//--estilo--
const useStyles = makeStyles({
  container: {
    padding: "0",
  },

  tabBox: {
    width: "100%",
    minHeight: "calc(100vh - 264px)",
    display: "flex",
    flexDirection: "column",
    padding: "0",
  },
});
//---------

const Perfil = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Paper sx={{ minHeight: "calc(100vh - 148px)", mt: 4 }}>
        <MeusDados />
      </Paper>
    </Container>
  );
};

export default Perfil;
