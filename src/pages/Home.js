import React from "react";
import Cards from "../components/Cards";
import { Container, createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

//--estilo--
const theme = createTheme();

const useStyles = makeStyles( ({
  grid: {
    marginTop: theme.spacing(2),
  },
}));
//---------

const Home = () => {
  const classes = useStyles();
  return (
      <Container className={classes.grid} maxWidth="lg">
        <Cards />
      </Container>
  );
};

export default Home;
