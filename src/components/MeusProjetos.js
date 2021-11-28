import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { getToken } from "../services/auth";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";

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
  const [meusProjetos, setMeusProjetos] = useState(null);

  const getMeusProjetos = async () => {
    // Dar um get nos projetos criados pelo usuário.

    const URL = ""; // COlocar aqui a url
    try {
      const res = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + getToken,
        },
      });
      if (res.status === 200) {
        setMeusProjetos(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMeusProjetos();
  }, []);
  return (
    <Grid container spacing={2}>
      {meusProjetos &&
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
        ))}
    </Grid>
  );
};

export default MeusProjetos;
