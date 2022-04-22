import React from "react";
import { Card, Grid, CardMedia, Typography } from "@mui/material";
import { CardContent, CardActions, Button, Tooltip  } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { limitString } from "../services/util";
import { useHistory } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import PersonIcon from '@mui/icons-material/Person';

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
    display: "flex",
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

const ProfCard = ({ info }) => {
  const classes = useStyles();
  let history = useHistory();

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} container className={classes.grid} p={1}>
        <Card className={classes.card}>
          <CardMedia
            component={(info.imagem_perfil !== null) ? "img" : PersonIcon}
            image={(info.imagem_perfil !== null) ? info.imagem_perfil.url : ""} 
            className={classes.media}
          />
          
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
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => history.push("/profile", { data: [info.id, info.guid] })}
            >
              Ver Perfil
            </Button>
          </CardActions>
        </Card>
    </Grid>
  );
  
};

export default ProfCard;