import React from "react";
import { Card, Grid, CardMedia, Typography,Box } from "@mui/material";
import { CardContent, CardActions, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
// import { useHistory } from "react-router-dom";

//--estilo--
const useStyles = makeStyles({
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
  },
});
//---------

const ProfCard = ({ info }) => {
  const classes = useStyles();
  //let history = useHistory();

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card>

          <Box>
            <CardMedia sx={{width: "100%",bgcolor: "#dedede",margin: "auto", backgroundSize: "cover", border: "1px solid #c0c0c0" }}
              className={classes.media} 
              component="img"
              image={info.image}
            />
          </Box>
          
          <CardContent>
            <Typography variant="subtitle1">{info.nome_exibicao}</Typography>
            <p>{info.bio}</p>
          </CardContent>

          <CardActions className={classes.actions}>
            <Button
              color="secondary"
              onClick={() => /*history.push("/projeto", { data: [info.id, info.guid] }*/ console.log("ok")}
            >
              Ver Perfil
            </Button>
          </CardActions>
        </Card>
    </Grid>
  );
  
};

export default ProfCard;