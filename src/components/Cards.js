import React from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MyCard from "./MyCard";
import ProfCard from "./ProfCard";

//--estilo--
const useStyles = makeStyles(theme => ({
  grid: {
    display: "flex",
    marginTop: theme.spacing(1),
    width: "100%",
    maxWidth: "1400px",
  },
}));
//---------

const Cards = (props) => {
  const classes = useStyles();
  const cards = props.valores;
  const cardsType = props.cardsType;
  const guid = props.userGuid;

  return (
    <Grid className={classes.grid} container>
      {cards && (
        <>
          {cardsType === "usuarios"
            ? cards.map((card, index) => <ProfCard key={index} info={card} />)
            : cards.map((card, index) => (
                <MyCard
                  key={index}
                  info={card}
                  type={cardsType}
                  setValores={props.setValores}
                  valores={card}
                  userGuid={guid}
                />
              ))}
        </>
      )}
    </Grid>
  );
};

export default Cards;
