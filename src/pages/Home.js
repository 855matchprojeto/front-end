import React from "react";
import Header from "../components/Header";
import Copyright from "../components/Copyright";
import Cards from "../components/Cards";
import { Link } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  makeStyles,
  Grid,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  grid: {
    marginTop: theme.spacing(2),
  },
}));

const Home = () => {
  const classes = useStyles();
  return (
    <>
      <Header />
      <Container className={classes.container} maxWidth="lg">
        <Cards />
      </Container>
    </>
  );
};

export default Home;
