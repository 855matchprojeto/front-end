import React from "react";
import { Card, Grid, CardMedia, Typography,Box } from "@mui/material";
import { CardContent, CardActions, Button, Tooltip  } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { limitString } from "../services/util";
import { useHistory } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';

//--estilo--
const useStyles = makeStyles({
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
  actions: {
    display: "flex",
    marginTop: "auto",
    justifyContent: "center"
  },
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
    <Grid item xs={12} sm={6} md={4} lg={4}>
        <Card sx={{ display: "flex", flexDirection: "column", maxWidth: 400, height: 450 }}>
          <Box>
            <CardMedia sx={{width: "100%",bgcolor: "#dedede",margin: "auto", backgroundSize: "cover", border: "1px solid #c0c0c0" }}
              className={classes.media} 
              component="img"
              image={info.image}
            />
          </Box>
          
          <CardContent sx={{width: "100%"}}>
            <Typography variant="subtitle1">{info.nome_exibicao}</Typography>

            <Typography variant="body2" display="inline" style={{textJustify: "justify"}}>
              {info.bio && limitString(info.bio, 150)} 
            </Typography>

            { info.bio && info.bio.length > 150 && 
              <BigTooltip title={info.bio} arrow>            
                <Typography variant="body2" display="inline" style={{textAlign: "justify", color: "darkblue", fontWeight: 600}}>
                  {" ..."}
                </Typography>
              </BigTooltip>
            }
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