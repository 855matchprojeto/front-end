import React, {useRef, useEffect, useState} from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CardProjeto from "./CardProjeto";
import CardPerfil from "./CardPerfil";
import { getUserProjRel,getProjUserRel } from "../../services/api_projetos";

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

function CardGroup(props)
{
  const mountedRef = useRef(true);
  const classes = useStyles();
  const cards = props.valores;
  const cardsType = props.cardsType;
  const guidRef = props.guidRef;

  const [status, setStatus] = useState([]);

  useEffect(() => {

    async function getStatus()
    {
      if(cardsType === "usuarios" && guidRef)
      {
        await getProjUserRel(guidRef, null, true).then(res =>
          {
            if (!mountedRef.current)
              return
            if(res.status === 200)
              setStatus(res.data);
          }
        )              
      }
      else
      {
        await getUserProjRel(true, null, null).then(res => 
          {
            if (!mountedRef.current)
              return
            if(res.status === 200)
            {
              res = res.data;
              res.forEach(el => el.interesse_usuario_projeto.guid = el.guid);
              res = res.map(el => el.interesse_usuario_projeto);
              setStatus(res);
            }
          }
        )       
      }
    }

    getStatus();
  }, [cardsType, guidRef]);

  // cleanup
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, [])

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
    {
      return cards.map((card, index) => <CardProjeto key={index} info={card} userGuid={guidRef} status={checkStatus(card)} type={cardsType} />);
    }
      
  }

  return (
    <Grid className={classes.grid} container>
      {cards && <> {mapingCards()} </>}
    </Grid>
  );
};

export default CardGroup;