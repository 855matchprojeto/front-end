import React, { useState, useEffect } from "react";
import { Card, Grid, CardMedia, Typography, Tooltip } from "@mui/material";
import { CardContent, CardActions, Button, tooltipClasses } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { getProjUserRel } from "../services/api_projetos";
import { putRel } from "../services/api_projetos";
import { limitString } from "../services/util";

//--estilo--
const useStyles = makeStyles({

  grid: {
    display: "flex",
    justifyContent: "center",
  },

  card: {
    display: "flex", 
    flexDirection: "column", 
    width: "100%",
    maxWidth: 380, 
    height: 450
  },
  
  media: {
    width: "100%",
    bgcolor: "#dedede",
    backgroundSize: "cover",
    height: "200px"
  },

  actions: {
    marginTop: "auto",
    justifyContent: "center"
  },

  desc: {
    textAlign: "justify"
  },

  tooltip: {
    display: "inline",
    color: "darkblue", 
    fontWeight: 600
  }
});

const BigTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 450,
  },
});
//---------

const CardProjeto = ({ info, type, valores, userGuid, setValores }) => {
  const [btnInteresse, setBtnInteresse] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);

  const classes = useStyles();
  let history = useHistory();

  async function updateInteresse() 
  {
    if(!btnInteresse)
    {
      let body = {"fl_usuario_interesse": true};
      await putRel(userGuid, valores.guid, body);
    }
    else 
    {
      let body = {"fl_usuario_interesse": false};
      await putRel(userGuid, valores.guid, body);
    }

    setBtnInteresse(!btnInteresse);
  }

  useEffect(() => {

    async function getStatusInteresse() 
    {
      setComponentLoading(true);
      let aux = await getProjUserRel(valores.guid, true, null);
      //(aux.length === 0) ? setBtnInteresse(false) : setBtnInteresse(true);
      
      if(aux.length === 0) 
        setBtnInteresse(false);
      else
      {
        aux.forEach(function (item, index) {
          if (item.id === valores.pid) {
            setBtnInteresse(true);
            return;
          }
        });

        setBtnInteresse(true);
      }

      setComponentLoading(false);
    }

    if (type === "projetos") 
      getStatusInteresse();
    else
      setComponentLoading(false);
  }, [type, valores.guid, valores.pid]);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} container className={classes.grid} p={1}>
      {!componentLoading && (
        <Card className={classes.card}>
            <CardMedia
              component="img"
              image={(info.url_imagem !== null) ? info.url_imagem : "https://bit.ly/37W5LLQ"} 
              className={classes.media}
            />

          <CardContent sx={{width: "100%"}}>
            <Typography variant="h6">{info.titulo}</Typography>

            <Typography component="div" variant="body2" className={classes.desc}>
                {info.descricao && limitString(info.descricao, 150)}

                { info.descricao && info.descricao.length > 150 && 
                  <BigTooltip title={info.descricao} arrow>            
                    <div className={classes.tooltip}>
                      {" ..."}
                    </div>
                  </BigTooltip>
                }
            </Typography>
          </CardContent>

          <CardActions className={classes.actions}>    
            <Button
              size="small"
              variant="outlined"
              color={type === "projetos" ? (btnInteresse ? "error" : "success" ) : "primary"}
              onClick={() => {
                if (type === "projetos") 
                  updateInteresse();
                else 
                  history.push("/editproject", {data: [info.id, info.guid]});
              }}
              sx={{textTransform: 'none'}}
            >
              {type === "projetos" ? 
              (btnInteresse ? "Remover interesse" : "Marcar interesse") :
              "Editar"}
            </Button>

              <Button 
                color="secondary" 
                variant="outlined" 
                size="small"
                sx={{textTransform: 'none'}}
                onClick={() => history.push("/projeto", { data: [info.id, info.guid, userGuid] })}
              >
                Detalhes
              </Button>
          </CardActions>

        </Card>
      )}
    </Grid>
  );
};

export default CardProjeto;