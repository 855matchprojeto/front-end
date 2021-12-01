import React,{ useState, useEffect } from "react";
import { Grid,createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import MyCard from "./MyCard";
import ProfCard from "./ProfCard";

//--estilo--
const theme = createTheme();

const useStyles = makeStyles( ({
  grid: {
    marginTop: theme.spacing(1),
  },
}));

const Cards = (props) => {
  const classes = useStyles();
  const [cards,setCards] = useState(false);
  const cardsType = props.cardsType;

  useEffect(() => 
  {
    setCards(props.valores);
  }, [props.valores])

  return (
      <Grid className={classes.grid} container spacing={2}>
        { cards &&
          (cardsType === "projetos") && cards.map((card, index) => <MyCard key={card.id} info={card} /> )
        }
        { cards &&
          (cardsType === "usuarios") && cards.map((card, index) => <ProfCard key={card.id} info={card}/> )
        }
      </Grid>
  );
};

export default Cards;
