import React from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CardProjeto from "./CardProjeto";
import CardPerfil from "./CardPerfil";

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

const CardGroup = (props) => {
  const classes = useStyles();
  const cards = props.valores;
  const cardsType = props.cardsType;
  const guid = props.userGuid;
  const projeto = props.projeto;

  return (
    <Grid className={classes.grid} container>
      {cards && (
        <>
          {cardsType === "usuarios"
            ? cards.map((card, index) => <CardPerfil key={index} info={card} projeto={projeto}/>)
            : cards.map((card, index) => (
                <CardProjeto
                  key={index}
                  info={card}
                  type={cardsType}
                  valores={card}
                  userGuid={guid}
                />
              ))}
        </>
      )}
    </Grid>
  );
};

export default CardGroup;
