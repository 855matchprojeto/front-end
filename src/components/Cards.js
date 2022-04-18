import React, { useState, useEffect } from "react";
import { Grid, createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import MyCard from "./MyCard";
import ProfCard from "./ProfCard";

//--estilo--
const theme = createTheme();

const useStyles = makeStyles({
  grid: {
    display: "flex",
    marginTop: theme.spacing(1),
    width: "100%"
  },
});

const Cards = (props) => {
  const classes = useStyles();
  const [cards, setCards] = useState(false);
  const cardsType = props.cardsType;

  useEffect(() => {
    setCards(props.valores);
  }, [props.valores]);

  return (
    <Grid className={classes.grid} container spacing={1}>
      {cards &&
        (cardsType === "projetos" || cardsType === "meusprojetos") &&
        cards.map((card, index) => (
          <MyCard key={card.id} info={card} type={cardsType} setValores={setCards} valores={cards} page={props.page} />
        ))}
      {cards &&
        cardsType === "usuarios" &&
        cards.map((card, index) => <ProfCard key={card.id} info={card} />)}
    </Grid>
  );
};

export default Cards;
