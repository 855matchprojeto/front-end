import { useState, useEffect } from "react";
import { Grid, Card, CardMedia, CardContent } from "@mui/material";
import { CardActions, Box, Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { getMeusProjetos } from "../../services/api_projetos";
import LoadingBox from "../LoadingBox";
import Cards from "../Cards";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    marginTop: "40px",
  },
  textField: {
    marginBottom: "24px",
  },
  title: {
    marginTop: "32px",
  },
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
  },
}));

const MeusProjetos = () => {
  const classes = useStyles();
  const history = useHistory();

  // puxa projetos
  const [meusProjetos, setMeusProjetos] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);

  /*
  const meusProjetos = [
    {
      id: 1,
      title: "Título 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
      image: "https://source.unsplash.com/random",
    },
    {
      id: 2,
      title: "Título 2",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
      image: "https://source.unsplash.com/random",
    },
  ];  
  */

  useEffect(() => {
    async function doGetMeusProjetos() {
      setComponentLoading(true);
      try {
        const res = await getMeusProjetos();
        if (res.status === 200) setMeusProjetos(res.data);
      } catch (err) {
        console.log(err);
      }

      setComponentLoading(false);
    }

    doGetMeusProjetos();
  }, []);

  return (
    <>
      {!componentLoading && (
        <Grid container spacing={2}>
          {meusProjetos.length > 0 ? (
            <Cards valores={meusProjetos} cardsType="meusprojetos" />
          ) : (
            <Grid container spacing={2}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  sx={{
                    p: 4,
                    fontSize: "1.5em",
                  }}
                >
                  Você ainda não criou nenhum projeto.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {componentLoading && <LoadingBox />}
    </>
  );
};

export default MeusProjetos;
