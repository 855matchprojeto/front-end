import React,{ useState, useEffect } from "react";
import MyCard from "./MyCard";
import { Grid,createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

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

  useEffect(() => 
  {
    setCards(props.valores);
  }, [props.valores])

  return (
      <Grid className={classes.grid} container spacing={2}>
        { 
          cards && cards.map((card, index) => <MyCard key={card.id} info={card} />)
        }
      </Grid>
  );
};

export default Cards;
