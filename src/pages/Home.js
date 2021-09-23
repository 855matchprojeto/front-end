import React from "react";
import Base from "./Base";
import Cards from "../components/Cards";
import { Container, makeStyles } from "@material-ui/core";

//--estilo--
const useStyles = makeStyles((theme) => ({
  grid: {
    marginTop: theme.spacing(2),
  },
}));
//---------

const Home = () => {
  const classes = useStyles();
  return (
    <Base>
      <Container className={classes.grid} maxWidth="lg">
        <Cards />
      </Container>
    </Base>
  );
};

export default Home;
