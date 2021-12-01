import React, { useState, useEffect } from "react";
import { Grid, Card, CardMedia, CardContent, Container, CircularProgress } from "@mui/material";
import { CardActions, Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { getProjetosInteresses } from "../../services/api_projetos";

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

const Interesses = () => {
  const classes = useStyles();
  const history = useHistory();

  // puxa interesses
  const [interesses, setInteresses] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);

  useEffect(() => {
    async function doGetProjInteresses()
    {
      setComponentLoading(true);
      try 
      {
        const res = await getProjetosInteresses();
        if (res.status === 200) 
          setInteresses(res.data);
        
      } 
      catch (err) 
      {
        console.log(err);
      }
      setComponentLoading(false);
    }

    doGetProjInteresses()
  }, []);

  return (
      <Grid container spacing={2}>
        { !componentLoading && (
            <>
              {
                interesses.length > 0 ? (
                  interesses.map((interesse) => (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <Card>
                        <CardMedia
                          className={classes.media}
                          image={interesse.image}
                        />
                        <CardContent>
                          <Typography variant="subtitle1">
                            {interesse.title}
                          </Typography>
                          <p>{interesse.description}</p>
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
                  )
                  )
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
                        Você ainda não tem nenhum projeto com interesse.
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

export default Interesses;
