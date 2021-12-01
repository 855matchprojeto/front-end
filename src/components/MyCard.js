import React from "react";
import { Card, Grid, CardMedia, Typography,Box } from "@mui/material";
import { CardContent, CardActions, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { getProjetosInteresses } from "../services/api_projetos";
import { postInteresseProjeto } from "../services/api_projetos";
import { deleteInteresseProjeto } from "../services/api_projetos";

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

const MyCard = ({ info }) => {
  const [btnInteresse, setBtnInteresse] = React.useState(false);
  const pid = info.id;

  const classes = useStyles();
  let history = useHistory();

  async function updateInteresse()
  {
    if(btnInteresse)
      await deleteInteresseProjeto(info.guid);
    else
      await postInteresseProjeto(info.guid);

    setBtnInteresse(!btnInteresse);
  }

  React.useEffect(() => 
  {
      async function getStatusInteresse() 
      {
          let aux = await getProjetosInteresses();
          aux = aux.data;
          
          if (aux.length === 0) // usuario nao tem interesse em nenhum projeto
          {
            setBtnInteresse(false);
          }
          else  // usuario tem interesse em algum projeto, verificar se o atual é um deles
          {
            aux.forEach(function (item, index) {
              if (item.id === pid)
                setBtnInteresse(true);
            });
          }
      }
      
      getStatusInteresse();

  },[pid])

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
          <Typography variant="subtitle1">{info.titulo}</Typography>
          <p>{info.descricao}</p>
        </CardContent>

        <CardActions className={classes.actions}>
          <Button 
            color="primary"
            onClick={() => updateInteresse()}
          >
            {btnInteresse ? "Remover interesse" : "Marcar interesse"}
          </Button>

          <Button
            color="secondary"
            onClick={() => history.push("/projeto", { data: [info.id, info.guid] })}
          >
            Detalhes
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default MyCard;