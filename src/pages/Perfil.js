import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Grid,
  CardHeader,
  CardContent,
  Card,
  CardActions,
  CardMedia,
  Box,
  Button,
  Tabs,
  Tab,
  Avatar,
  Fab,
  Chip,
} from "@mui/material";

import axios from "axios";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { makeStyles } from "@mui/styles";
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

const Perfil = () => {
  const [valueTab, setTabValue] = useState("perfil");
  const info = {
    id: 1,
    title: "Título 1",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
    image: "https://source.unsplash.com/random",
  };

  const [user, setUser] = useState(null);

  const getDataUsers = async () => {
    const URL = `https://perfis-match-projetos.herokuapp.com/profiles/user/me`;
    try {
      const res = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + getToken,
        },
      });
      if (res.status === 200) {
        setUser({
          name: res.data.nome_exibicao,
          interesses: res.data.interesses,
          cursos: res.data.cursos,
          email: res.data.emails[0],
        });
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createUser = async () => {
    const endpoint = "/profiles/user/me";
    const URL = `https://perfis-match-projetos.herokuapp.com${endpoint}`;
    try {
      const res = await axios.post(URL, user, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + getToken,
        },
      });
      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const adicionaCurso = async (id) => {
    const endpoint = `/profiles/user/me/link-course/${id}`;
    const URL = `https://perfis-match-projetos.herokuapp.com${endpoint}`;
    try {
      const res = await axios.post(URL, "", {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + getToken,
          "Content-Type": "application/json",
        },
      });
      if (res.status === 201) {
        console.log("Curso adicionado com sucesso.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Não será possivel alterar o email.
  // const adicionaEmail = async () => {
  //   const endpoint = "/profiles/user/me/perfil-email";
  //   const URL = `https://perfis-match-projetos.herokuapp.com${endpoint}`;
  //   try {
  //     const res = await axios.post(
  //       URL,
  //       { email: "lebron@teste.com" },
  //       {
  //         headers: {
  //           Accept: "application/json",
  //           Authorization: "Bearer " + getToken,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (res.status === 201) {
  //       console.log(res.data);
  //       console.log("POST");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const adicionaIntresse = async (id) => {
    const endpoint = `/profiles/user/me/link-interest/${id}`;
    const URL = `https://perfis-match-projetos.herokuapp.com${endpoint}`;
    try {
      const res = await axios.post(URL, "", {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + getToken,
          "Content-Type": "application/json",
        },
      });
      if (res.status === 201) {
        console.log("Interesse adicionado com sucesso");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = () => {
    // adicionaCurso();
    console.log("edita o usuário");
  };

  const handleTextFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getDataUsers();
  }, []);

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Card sx={{ minHeight: "100vh", mt: 4 }}>
          <TabContext
            value={valueTab}
            color="primary"
            style={{ marginTop: "24px" }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TabList
                indicatorColor="primary"
                onChange={handleChange}
                style={{ marginTop: "24px", marginBottom: "16px" }}
              >
                <Tab label="Meus Dados" value="perfil" />
                <Tab label="Meus Projetos" value="projetos" />
                <Tab label="Tenho Interesse" value="interesses" />
              </TabList>
            </Box>
            <TabPanel value="perfil">
              <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardHeader
                      title={
                        <Typography variant="h6" align="center">
                          {user && `${user.name}`}
                        </Typography>
                      }
                    />

                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <img
                          alt="Not Found"
                          src="./lebronJames.png"
                          style={{ width: "100px", height: "100px" }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={8}>
                  <Card>
                    <CardHeader
                      title={<Typography variant="h6">Perfil</Typography>}
                    />
                    <CardContent>
                      <Grid container style={{ width: "100%" }} spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            className={classes.textField}
                            type="email"
                            label="Email"
                            variant="outlined"
                            placeholder="Email"
                            defaultValue="email@email.com"
                            value={user && user.email.email}
                            fullWidth
                            disabled
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            className={classes.textField}
                            type="input"
                            label="Nome"
                            name="name"
                            variant="outlined"
                            placeholder="Nome"
                            defaultValue="LeBron James"
                            value={user && user.name}
                            fullWidth
                            onChange={(e) => handleTextFieldChange()}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            className={classes.textField}
                            type="input"
                            label="Sobrenome"
                            name="sobrenome"
                            variant="outlined"
                            placeholder="Sobrenome"
                            value={user ? "James" : "James"}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            className={classes.textField}
                            type="input"
                            label="Cursos"
                            variant="outlined"
                            // placeholder="Engenharia de Computação"
                            value={user ? user.cursos[0].nome_exibicao : ""}
                            // defaultValue="Engenharia de Computação"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">
                            Áreas de Interesse
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          {user &&
                            user.interesses.map((area, index) => (
                              <Chip
                                variant="outlined"
                                label={area.nome_exibicao}
                                sx={{ mr: 2 }}
                                key={index}
                              />
                            ))}
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        marginRight: "24px",
                        marginBottom: "16px",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit()}
                      >
                        Salvar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="projetos">
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardMedia className={classes.media} image={info.image} />
                      <CardContent>
                        <Typography variant="subtitle1">
                          {info.title}
                        </Typography>
                        <p>{info.description}</p>
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
                          <Button color="primary">Editar</Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardMedia className={classes.media} image={info.image} />
                      <CardContent>
                        <Typography variant="subtitle1">
                          {info.title}
                        </Typography>
                        <p>{info.description}</p>
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
                          <Button color="primary">Editar</Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardMedia className={classes.media} image={info.image} />
                      <CardContent>
                        <Typography variant="subtitle1">
                          {info.title}
                        </Typography>
                        <p>{info.description}</p>
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
                          <Button color="primary" disabled>
                            Editar
                          </Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel value="interesses"></TabPanel>
          </TabContext>
        </Card>
      </Box>
    </>
  );
};

export default Perfil;
