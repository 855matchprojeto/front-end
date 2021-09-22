import React, { useState } from "react";
import CardHome from "./CardHome";
import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  grid: {
    marginTop: theme.spacing(1),
  },
}));

const Cards = () => {
  const classes = useStyles();
  const [cards, setCards] = useState([
    // Estado apenas para simular as informações de projetos
    {
      id: 1,
      title: "Título 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
      image: "https://source.unsplash.com/random",
    },
    {
      id: 2,
      title: "Título 2",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
      image: "https://source.unsplash.com/random",
    },
    {
      id: 3,
      title: "Título 3",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
      image: "https://source.unsplash.com/random",
    },
    {
      id: 4,
      title: "Título 4",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
      image: "https://source.unsplash.com/random",
    },
  ]);

  return (
    <>
      <Grid className={classes.grid} container spacing={2}>
        { 
          cards &&
          cards.map((card, index) => <CardHome key={card.id} info={card} />)
        }
      </Grid>
    </>
  );
};

export default Cards;
