import React from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CardProjeto from "./CardProjeto";
import CardPerfil from "./CardPerfil";
import { getUserProjRel,getProjUserRel } from "../services/api_projetos";

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
  const guidRef = props.guidRef;

  const [status, setStatus] = React.useState([]);

  React.useEffect(() => {

    async function getStatus()
    {
      if(cardsType === "usuarios" && guidRef)
      {
        let aux = await getProjUserRel(guidRef, null, true);
        setStatus(aux);        
      }
      else
      {
        let aux = await getUserProjRel(true, null, null);
        if(aux.status === 200)
        {
          aux = aux.data;
          aux.forEach(el => el.interesse_usuario_projeto.guid = el.guid);
          aux = aux.map(el => el.interesse_usuario_projeto);
          setStatus(aux);
        }
      }

    }

    getStatus();
  }, [cardsType, guidRef]);

  function checkStatus(card)
  { 
    let aux;

    if(cardsType === "usuarios")
      aux = status.find(el => el.guid_usuario === card.guid_usuario);
    else
      aux = status.find(el => el.guid === card.guid);

    return aux;
  }

  function mapingCards()
  {
    if (cardsType === "usuarios")
      return cards.map((card, index) => <CardPerfil  key={index} info={card} projGuid={guidRef} status={checkStatus(card)} />);
    else
      return cards.map((card, index) => <CardProjeto key={index} info={card} userGuid={guidRef} status={checkStatus(card)} type={cardsType} />);
  }

  return (
    <Grid className={classes.grid} container>
      { cards && 
        <>
          {mapingCards()}
        </>
      }
    </Grid>
  );
};

export default CardGroup;
