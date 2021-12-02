import React from "react";
import { Card, Grid, CardMedia, Typography, Box } from "@mui/material";
import { CardContent, CardActions, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { getProjetosInteresses } from "../services/api_projetos";
import { postInteresseProjeto } from "../services/api_projetos";
import { deleteInteresseProjeto } from "../services/api_projetos";
import { limitString } from "../services/util";

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

const MyCard = ({ info, type }) => {
  const [btnInteresse, setBtnInteresse] = React.useState(false);
  const [componentLoading, setComponentLoading] = React.useState(true);

  const pid = info.id;

  const classes = useStyles();
  let history = useHistory();

  async function updateInteresse() {
    if (btnInteresse) await deleteInteresseProjeto(info.guid);
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
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "350px",
          }}
        >
          <Box>
            <CardMedia
              sx={{
                width: "100%",
                bgcolor: "#dedede",
                margin: "auto",
                backgroundSize: "cover",
                border: "1px solid #c0c0c0",
              }}
              className={classes.media}
              component="img"
              image={info.image}
            />
          </Box>

          <CardContent>
            <Typography variant="subtitle1">{info.titulo}</Typography>
            <Typography variant="body1" noWrap>
              {" "}
              {limitString(info.descricao, 5)}{" "}
            </Typography>
          </CardContent>

          <CardActions className={classes.actions}>
            <Button
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

            <Button
              color="secondary"
              onClick={() =>
                history.push("/projeto", { data: [info.id, info.guid] })
              }
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
