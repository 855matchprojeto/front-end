import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { getToken } from "../services/auth";

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
  const [interesses, setInteresses] = useState(null);
  const classes = useStyles();
  const history = useHistory();

  const getProjetosInteresses = async () => {
    const URL =
      "https://projetos-match-projetos.herokuapp.com/users/me/projects/interested-in";
    try {
      const res = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + getToken,
        },
      });

      if (res.status === 200) {
        setInteresses(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProjetosInteresses();
  }, []);
  return (
    <Grid container spacing={2}>
      {interesses && (
        <>
          {interesses.length > 0 ? (
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
            ))
          ) : (
            <Box>
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
          )}
        </>
      )}
    </Grid>
  );
};

export default Interesses;
