import React from "react";
import { Card, Grid, CardMedia, Typography, Tooltip } from "@mui/material";
import { CardContent, CardActions, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { getProjetosInteresses } from "../services/api_projetos";
import { postInteresseProjeto } from "../services/api_projetos";
import { deleteInteresseProjeto } from "../services/api_projetos";
import { limitString } from "../services/util";
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
    marginTop: "auto"
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
  const defaultImageUrl = "https://rockcontent.com/br/wp-content/uploads/sites/2/2020/04/modelo-de-projeto.png";
  const [btnInteresse, setBtnInteresse] = React.useState(false);
  const [componentLoading, setComponentLoading] = React.useState(true);

  const pid = info.id;

  const classes = useStyles();
  let history = useHistory();

  async function updateInteresse() {
    if (btnInteresse){
      await deleteInteresseProjeto(info.guid);
      if (page === 'perfil') {
        setValores(valores.filter((valor) => valor.guid !== info.guid));
      }
    } 
    else await postInteresseProjeto(info.guid);

    setBtnInteresse(!btnInteresse);
  }

  React.useEffect(() => {
    if (type === "projetos") {
      async function getStatusInteresse() {
        setComponentLoading(true);
        let aux = await getProjetosInteresses();
        aux = aux.data;

        if (aux.length === 0) {
          // usuario nao tem interesse em nenhum projeto
          setBtnInteresse(false);
        } // usuario tem interesse em algum projeto, verificar se o atual é um deles
        else {
          aux.forEach(function (item, index) {
            if (item.id === pid) {
              setBtnInteresse(true);
              return;
            }
          });
        }

        setComponentLoading(false);
      }

      getStatusInteresse();
    } else {
      setComponentLoading(false);
    }
  }, [pid,type]);

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      {!componentLoading && (
        <Card sx={{ display: "flex", flexDirection: "column", maxWidth: 400, height: 450 }}>
            <CardMedia
              sx={{
                width: "100%",
                bgcolor: "#dedede",
                backgroundSize: "cover",
                border: "1px solid #c0c0c0",
              }}
              // className={classes.media}
              height="194"
              component="img"
              // image={info.image ? info.image : defaultImageUrl }
              src={info.image ? info.image : defaultImageUrl}
            />

          <CardContent sx={{width: "100%"}}>
            <Typography variant="h6">{info.titulo}</Typography>

            <Typography variant="body2" display="inline" style={{textJustify: "justify"}}>
                {info.descricao && limitString(info.descricao, 150)}
            </Typography>

            { info.descricao && info.descricao.length > 150 && 
              <BigTooltip title={info.descricao} arrow>            
                <Typography variant="body2" display="inline" style={{textAlign: "justify", color: "darkblue", fontWeight: 600}}>
                  {" ..."}
                </Typography>
              </BigTooltip>
            }
          </CardContent>

          <CardActions className={classes.actions}>
            <Grid item xs={6} sm={6} md={6} lg={6} style={{display: "flex", justifyContent: "center"}}>            
              <Button
                size="small"
                variant="outlined"
                color={ type === "projetos" ? (btnInteresse ? "error" : "success" ) : "primary" }
                onClick={() => {
                  if (type === "projetos") {
                    updateInteresse();
                  } else {
                    history.push("/editproject", {
                      data: [info.id, info.guid],
                    });
                  }
                }}
              >
                {type === "projetos"
                  ? btnInteresse
                    ? "Remover interesse"
                    : "Marcar interesse"
                  : "Editar"}
              </Button>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} style={{display: "flex", justifyContent: "center"}}>
              <Button
                color="secondary"
                variant="outlined"
                size="small"
                onClick={() =>
                  history.push("/projeto", { data: [info.id, info.guid] })
                }
              >
                Detalhes
              </Button>
            </Grid>
          </CardActions>

        </Card>
      )}
    </Grid>
  );
};

export default MyCard;
