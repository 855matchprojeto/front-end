import { useState, useEffect } from "react";
import { Grid, Card, CardMedia, CardContent, Container, CircularProgress } from "@mui/material";
import { CardActions, Box, Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { getMeusProjetos } from "../../services/api_projetos";

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
    async function doGetMeusProjetos()
    {
      setComponentLoading(true);
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

      setComponentLoading(false);
    };

    doGetMeusProjetos();
  }, []);

  return (
      <Grid container spacing={2}>
        { !componentLoading && (
            <>
              {
                meusProjetos.length > 0 ? 
                (
                  meusProjetos.map((projeto) => (
                    <Grid item xs={12} sm={4}>
                      
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
                ) 
                :
                (              
                  <Grid container spacing={2}>
                    <Box sx={{width: "100%", display: "flex", justifyContent: "center"}}>
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
                )
              }
            </>
          )
        }

        { componentLoading &&
          <Container style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "center",alignSelf: "center"}} maxWidth="lg">
            <CircularProgress size={150} color="secondary" />
          </Container>
        }
      </Grid>
  );
};

export default MeusProjetos;
