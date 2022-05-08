import React from "react";
import { Card, Grid, CardMedia, Typography } from "@mui/material";
import { CardContent, CardActions, Button, Tooltip  } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { limitString } from "../services/util";
import { useHistory } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { putRel } from "../services/api_projetos";

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
    height: 400
  },

  mediaContainer: {
    width: "100%", 
    display:"flex", 
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient( gray 50%, rgba(0,0,0,0) 50%)",
    height: "200px",
    boxShadow: "0 0 1px #000"
  },

  media: {
    width: "150px", 
    height: "150px",
    padding: "0",
    border: "1px solid black", 
    borderRadius: "4px",
    background: theme.palette.background.default
  },

  actions: {
    display: "flex",
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

const CardPerfil = (props) => {
  const classes = useStyles();
  let history = useHistory();

  const info = props.info;
  const projGuid = props.projGuid;
  const status = props.status;

  const [btnInteresse, setBtnInteresse] = React.useState(false);
  const [componentLoading, setComponentLoading] = React.useState(true);
  const [hasMatch, setHasMatch] = React.useState(false);

  React.useEffect(() => 
  {
    setComponentLoading(true);

    if(projGuid)
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

  }, [projGuid, status])

  async function changeInteresseNoUsuario()
  {    
    if(!btnInteresse)
    {
      let aux = {"fl_projeto_interesse": true};
      aux = await putRel(info.guid_usuario, projGuid, aux);
      
      if(aux.status === 200)
      {
        setHasMatch(aux.data.fl_match);
        setBtnInteresse(!btnInteresse);
      }
    }
    else 
    {
      let aux = {"fl_projeto_interesse": false};
      aux = await putRel(info.guid_usuario, projGuid, aux);

      if(aux.status === 200)
      {
        setHasMatch(aux.data.fl_match);
        setBtnInteresse(!btnInteresse);
      }

    }
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} container className={classes.grid} p={1}>

        <Card className={classes.card}>
          <div className={classes.mediaContainer}>
            <CardMedia
              component={(info.imagem_perfil !== null) ? "img" : PersonIcon}
              image={(info.imagem_perfil !== null) ? info.imagem_perfil.url : ""} 
              className={classes.media}
            />
          </div>
          
          <CardContent sx={{width: "100%"}}>
            <Typography variant="subtitle1">{info.nome_exibicao}</Typography>

            <Typography component="div" variant="body2" className={classes.desc}>
              {info.bio && limitString(info.bio, 150)} 

              { info.bio && info.bio.length > 150 && 
                <BigTooltip title={info.bio} arrow>            
                  <div className={classes.tooltip} display="inline">
                    {" ..."}
                  </div>
                </BigTooltip>
              }
            </Typography>


          </CardContent>
          
            <CardActions className={classes.actions}>
              { projGuid && !componentLoading &&
                <Button
                  variant="outlined"
                  color={btnInteresse ? "error" : "success" }
                  size="small"
                  sx={{textTransform: 'none'}}
                  onClick={() => changeInteresseNoUsuario()}
                >
                  {btnInteresse ? "Remover interesse" : "Marcar interesse"}
                </Button>
              }

              <Button
                variant="outlined"
                color="secondary"
                size="small"
                sx={{textTransform: 'none'}}
                onClick={() => history.push("/profile", { data: [info.id, info.guid] })}
              >
                Ver Perfil
              </Button>

              { hasMatch &&
                <FavoriteIcon style={{marginLeft:"3px"}} color='error'/>
              }
            </CardActions>
          
        </Card>
        
    </Grid>
  );
  
};

export default CardPerfil;