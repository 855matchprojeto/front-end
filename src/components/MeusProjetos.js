import { useState, useEffect } from "react";
import { Grid, Card, CardMedia, CardContent } from "@mui/material";
import { CardActions, Box, Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { getMeusProjetos } from "../services/api_projetos";

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
  const [meusProjetos, setMeusProjetos] = useState(null);

  useEffect(() => {
    async function doGetMeusProjetos()
    {
      try 
      {
        const res = await getMeusProjetos();
        if (res.status === 200) 
          setMeusProjetos(res.data);
      } 
      catch (err) 
      {
        console.log(err);
      }
    };

    doGetMeusProjetos();
  }, []);

  return (
    <Grid container spacing={2}>
      {meusProjetos && (
        <>
          {meusProjetos.length > 0 ? (
            meusProjetos.map((projeto) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardMedia className={classes.media} image={projeto.image} />
                  <CardContent>
                    <Typography variant="subtitle1">{projeto.title}</Typography>
                    <p>{projeto.description}</p>
                  </CardContent>
                  <CardActions>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "end",
                        mr: 2,
                      }}
                    >
                      <Button
                        color="primary"
                        onClick={() => {
                          console.log("Teste");
                          history.push("/editproject");
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => {
                          console.log("Teste");
                          history.push("/projeto");
                        }}
                      >
                        Detalhes
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Box sx={{width: "100%", display: "flex", justifyContent: "center"}}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{
                  p: 4,
                  fontSize: "1.5em",
                }}
              >
                Você ainda criou nenhum projeto.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Grid>
  );
};

export default MeusProjetos;
