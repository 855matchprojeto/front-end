import React, { useState, useEffect } from "react";
import { Card, Grid, CardMedia, Typography, Tooltip } from "@mui/material";
import { CardContent, CardActions, Button, tooltipClasses } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { getProjetosInteresses } from "../services/api_projetos";
import { postInteresseProjeto } from "../services/api_projetos";
import { deleteInteresseProjeto } from "../services/api_projetos";
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
    height: 400,
  },
  
  media: {
    width: "100%",
    backgroundSize: "cover",
    height: "200px",
    boxShadow: "0 0 1px #000"
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

const MyCard = ({ info, type, valores, setValores, page }) => {
  const [btnInteresse, setBtnInteresse] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);

  const pid = info.id;
  const classes = useStyles();
  let history = useHistory();

  async function updateInteresse() 
  {
    if (btnInteresse)
    {
      await deleteInteresseProjeto(info.guid);
      if (page === 'perfil') 
        setValores(valores.filter((valor) => valor.guid !== info.guid));
    } 
    else await postInteresseProjeto(info.guid);

    setBtnInteresse(!btnInteresse);
  }

  useEffect(() => {

    async function getStatusInteresse() 
    {
      setComponentLoading(true);
      let aux = (await getProjetosInteresses()).data;
  
      if (aux.length === 0) // usuario nao tem interesse em nenhum projeto
        setBtnInteresse(false);
      else 
      {// usuario tem interesse em algum projeto, verificar se o atual é um deles
        aux.forEach(function (item, index) {
          if (item.id === pid) {
            setBtnInteresse(true);
            return;
          }
        });
      }

      setComponentLoading(false);
    }

    if (type === "projetos") 
      getStatusInteresse();
    else
      setComponentLoading(false);
  }, [pid,type]);

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
                onClick={() => history.push("/projeto", { data: [info.id, info.guid] })}
              >
                Detalhes
              </Button>
          </CardActions>

        </Card>
      )}
    </Grid>
  );
};

export default MyCard;