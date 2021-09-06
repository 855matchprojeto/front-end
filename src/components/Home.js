import React from "react";
import Header from "./Header";
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
  Button
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
        <Grid className={classes.grid} container spacing={2}>
          <Grid item xs={12} md={4} lg={3}>
           <Card>
               <CardMedia image="https://source.unsplash.com/random"/>
               <CardContent>
                   <Typography variant="subtite1">Projeto 1</Typography>
                   <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita cumque incidunt magnam cum vero repellendus tempore quasi deserunt esse unde, corporis aliquam officia voluptas quidem quo distinctio impedit suscipit at </p>
               </CardContent>
               <CardActions>
                   <Button color="primary">Tenho interesse</Button>
               </CardActions>

           </Card>
           
           
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
          <Card>
               <CardMedia image="https://source.unsplash.com/random"/>
               <CardContent>
                   <Typography variant="subtite1">Projeto 1</Typography>
                   <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita cumque incidunt magnam cum vero repellendus tempore quasi deserunt esse unde, corporis aliquam officia voluptas quidem quo distinctio impedit suscipit at </p>
               </CardContent>
               <CardActions>
                   <Button color="primary">Tenho interesse</Button>
               </CardActions>

           </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
          <Card>
               <CardMedia image="https://source.unsplash.com/random"/>
               <CardContent>
                   <Typography variant="subtite1">Projeto 1</Typography>
                   <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita cumque incidunt magnam cum vero repellendus tempore quasi deserunt esse unde, corporis aliquam officia voluptas quidem quo distinctio impedit suscipit at </p>
               </CardContent>
               <CardActions>
                   <Button color="primary">Tenho interesse</Button>
               </CardActions>

           </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
          <Card>
               <CardMedia image="https://source.unsplash.com/random"/>
               <CardContent>
                   <Typography variant="subtite1">Projeto 1</Typography>
                   <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita cumque incidunt magnam cum vero repellendus tempore quasi deserunt esse unde, corporis aliquam officia voluptas quidem quo distinctio impedit suscipit at </p>
               </CardContent>
               <CardActions>
                   <Button color="primary">Tenho interesse</Button>
               </CardActions>

           </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
