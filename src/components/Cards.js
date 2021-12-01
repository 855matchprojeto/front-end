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
  const cardsType = props.cardType;

  useEffect(() => 
  {
    setCards(props.valores);
  }, [props.valores])

  return (
      <Grid className={classes.grid} container spacing={2}>
        { 
          cards && cards.map((card, index) => 
            <>
              { (cardsType === "projetos") && <MyCard key={card.id} info={card} /> }
              { (cardsType === "usuarios") && <ProfCard key={card.id} info={card}/> }
            </>
          )
        }
      </Grid>
  );
};

export default Cards;
