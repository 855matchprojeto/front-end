import React, { useState, useEffect } from "react";
import { Card, Grid, CardMedia, Typography, Tooltip } from "@mui/material";
import { CardContent, CardActions, Button, tooltipClasses } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { putRel } from "../../services/api_projetos";
import { limitString } from "../../services/util";
import ProjectDefault from "../../icons/project.svg";
import FavoriteIcon from '@mui/icons-material/Favorite';

//--estilo--
const useStyles = makeStyles((theme) => ({

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

  mediaContainer: {
    width: "100%", 
    display:"flex", 
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    boxShadow: "0 0 1px #000"
  },
  
  media: {
    width: "fit-content",
    height: "150px",
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
    fontWeight: 600
  }
}));

const BigTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 450,
  },
});
//---------

function CardProjeto(props) 
{
  const [btnInteresse, setBtnInteresse] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);
  const [hasMatch, setHasMatch] = useState(false);

  const classes = useStyles();
  let history = useHistory();
  
  const info = props.info;
  const type = props.type;
  const userGuid = props.userGuid;
  const status = props.status;

  useEffect(() => {
    setComponentLoading(true);

    if (type === "projetos") 
    {
      if(status)
      {
        setHasMatch(status.fl_match);
        setBtnInteresse(true);
      }
      else
      {
        setHasMatch(false);
        setBtnInteresse(false);
      }
    }
    
    setComponentLoading(false);
  }, [type, status]);

  async function updateInteresse() 
  {
    let aux = {"fl_usuario_interesse": !btnInteresse};
    
    await putRel(userGuid, info.guid, aux).then(res => 
      {
        if(res.status === 200)
        {
          setHasMatch(res.data.fl_match);
          setBtnInteresse(!btnInteresse);
        }
      }
    );
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} container className={classes.grid} p={1}>
        <Card className={classes.card}>

          <div className={classes.mediaContainer}>
            <CardMedia
              component="img"
              image={(info.imagem_projeto !== null) ? info.imagem_projeto.url : ProjectDefault} 
              className={classes.media}
            />
          </div>

          <CardContent sx={{width: "100%"}}>
            <Typography variant="h6">{info.titulo}</Typography>

            <Typography component="div" variant="body2" className={classes.desc}>
                {info.descricao && limitString(info.descricao, 200)}

                { info.descricao && info.descricao.length > 200 && 
                  <BigTooltip title={info.descricao} arrow>            
                    <div className={classes.tooltip}>
                      {" ..."}
                    </div>
                  </BigTooltip>
                }
            </Typography>
          </CardContent>
          
          
            <CardActions className={classes.actions}>    
              { !componentLoading && 
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
                  {
                    type === "projetos" ? 
                    (btnInteresse ? "Remover interesse" : "Marcar interesse") :
                    "Editar"
                  }

                </Button>
              }

              <Button 
                color="secondary" 
                variant="outlined" 
                size="small"
                sx={{textTransform: 'none'}}
                onClick={() => history.push("/projeto", { data: [info.id, info.guid, userGuid] })}
              >
                Detalhes
              </Button>

              { hasMatch &&
                <FavoriteIcon style={{marginLeft:"3px"}} color='error'/>
              }
            </CardActions>
          
        </Card>
    </Grid>
  );
};

export default CardProjeto;