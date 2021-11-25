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
  Autocomplete,
  Stack,
} from "@mui/material";

import { useSnackbar } from "notistack";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";

import { doHandleDelete } from "../services/api_perfil";
import { doHandleDeleteCourses } from "../services/api_perfil";
import { doGetDataUsers } from "../services/api_perfil";
import { doAdicionaCurso } from "../services/api_perfil";
import { doAdicionaInteresse } from "../services/api_perfil";
import { doGetAllCourses } from "../services/api_perfil";
import { doHandleChangeCourses } from "../services/api_perfil";
import { doGetInteresses } from "../services/api_perfil";
import { doHandleSave } from "../services/api_perfil";
import { doHandleTextFieldChange } from "../services/api_perfil";


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
  const perfilImageUrl = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Elliot_Grieveson.png";
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [valueTab, setTabValue] = useState("perfil");
  const [isLoading, setIsLoading] = useState(false);

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

  const tenhoInteresse = [
    {
      id: 3,
      title: "Título 3",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
      image: "https://source.unsplash.com/random",
    },
    {
      id: 4,
      title: "Título 4",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
      image: "https://source.unsplash.com/random",
    },
  ];

  const [user, setUser] = useState(null);
  const [allInteresses, setAllInteresses] = useState(null);
  const [allCourses, setAllCourses] = useState(null);

  async function handleDelete(value) 
  {
    const res = await doHandleDelete(value);

    if (res.status === 204) {
      setUser({
        ...user,
        interesses: user.interesses.filter(
          (interesse) => interesse.nome_exibicao !== value.nome_exibicao
        ),
      });
      console.log("Interesse removido com sucesso!");
    }
  }

  async function handleDeleteCourses(value)
  {
    const res = await doHandleDeleteCourses(value);

    if (res.status === 204) {
      setUser({
        ...user,
        cursos: user.cursos.filter(
          (curso) => curso.nome_exibicao !== value.nome_exibicao
        ),
      });
      console.log("Curso removido com sucesso!");
    }
  }

  async function getDataUsers(value)
  {
    try {
      const res = await doGetDataUsers(value);

      if (res.status === 200) {
        setUser({
          name: res.data.nome_exibicao.split(" ")[0],
          sobrenome: res.data.nome_exibicao.split(" ")[1],
          interesses: res.data.interesses,
          cursos: res.data.cursos,
          email: res.data.emails[0],
        });
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function adicionaCurso(id)
  {
    try {
      const res = doAdicionaCurso(id);
      if (res.status === 201) {
        console.log("Curso adicionado com sucesso.");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function adicioneInteresse(id)
  {
    try {
      const res = await doAdicionaInteresse(id);

      if (res.status === 201) {
        console.log("Interesse adicionado com sucesso");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getAllCourses()
  {
    try {
      const res = await doGetAllCourses();

      if (res.status === 200 && res.statusText === "OK") {
        setAllCourses(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleChangeCourses(value)
  {
      if (value) {
        const newCourse = user.cursos.find(
          (curso) => curso.nome_exibicao === value.nome_exibicao
        );

        if (!newCourse) {
          try {
            const res = await doHandleChangeCourses(value);

            if (res.status === 201) {
              console.log("ADICIONADO COM SUCESSO");
              console.log(value);
              setUser({ ...user, cursos: [...user.cursos, value] });
            }
          } catch (err) {
            console.log(err);
          }
        }
    }
  }

  async function getInteresses()
  {
    try {
      const res = await doGetInteresses();

      if (res.statusText === "OK") {
        setAllInteresses(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSave()
  {
    setIsLoading(true);
    const nome_exibicao = `${user.name} ${user.sobrenome}`;

    try {
      const res = await doHandleSave(nome_exibicao);

      if (res.status === 200) {
        enqueueSnackbar("Dados atualizados com sucesso!", {
          anchorOrigin: {
            horizontal: "right",
            vertical: "top",
          },
          variant: "success",
        });
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }

  async function handleTextFieldChange(field, value)
  {
    if (value) {
      if (field === "interesses") {
        const newInterest = user.interesses.find(
          (interesse) => interesse.nome_exibicao === value.nome_exibicao
        );

        if (!newInterest) {

          try {
            const res = await doHandleTextFieldChange();
            
            if (res.status === 201) {
              console.log("ADICIONADO COM SUCESSO");
              console.log(value);
              setUser({ ...user, interesses: [...user.interesses, value] });
            }
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        setUser({ ...user, [field]: value });
      }
    }
  }

  useEffect(() => {
    getDataUsers();
    getInteresses();
    getAllCourses();
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
                          src={perfilImageUrl}
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
                            onChange={(e) =>
                              handleTextFieldChange(
                                e.target.name,
                                e.target.value
                              )
                            }
                            fullWidth
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
                            value={user ? user.sobrenome : ""}
                            onChange={(e) =>
                              handleTextFieldChange(
                                e.target.name,
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Autocomplete
                            options={allCourses && allCourses}
                            getOptionLabel={(option) => option.nome_exibicao}
                            name="cursos"
                            id="cursos"
                            freeSolo
                            onChange={(e, value) => handleChangeCourses(value)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Cursos"
                                placeholder="Cursos"
                                fullWidth
                              />
                            )}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sx={{ display: "flex", flexWrap: "wrap" }}
                        >
                          {user &&
                            user.cursos.map((curso, index) => (
                              <Chip
                                variant="outlined"
                                label={curso.nome_exibicao}
                                sx={{ mr: 1, mb: 1 }}
                                key={index}
                                onDelete={() => handleDeleteCourses(curso)}
                              />
                            ))}
                        </Grid>

                        <Grid item xs={12} sx={{ mb: 1 }}>
                          <Typography variant="subtitle2">
                            Áreas de Interesse
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Autocomplete
                            options={allInteresses && allInteresses}
                            getOptionLabel={(option) => option.nome_exibicao}
                            name="interesses"
                            id="interesses"
                            freeSolo
                            onChange={(e, value) =>
                              handleTextFieldChange("interesses", value)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Interesses"
                                placeholder="Interesses"
                                fullWidth
                              />
                            )}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sx={{ display: "flex", flexWrap: "wrap" }}
                        >
                          {user &&
                            user.interesses.map((area, index) => (
                              <Chip
                                variant="outlined"
                                label={area.nome_exibicao}
                                sx={{ mr: 1, mb: 1 }}
                                key={index}
                                onDelete={() => handleDelete(area)}
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
                        onClick={() => handleSave()}
                        disabled={isLoading}
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
                  {meusProjetos &&
                    meusProjetos.map((projeto) => (
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card>
                          <CardMedia
                            className={classes.media}
                            image={projeto.image}
                          />
                          <CardContent>
                            <Typography variant="subtitle1">
                              {projeto.title}
                            </Typography>
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
              </Box>
            </TabPanel>
            <TabPanel value="interesses">
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                }}
              >
                <Grid container spacing={2}>
                  {tenhoInteresse &&
                    tenhoInteresse.map((projeto) => (
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card>
                          <CardMedia
                            className={classes.media}
                            image={projeto.image}
                          />
                          <CardContent>
                            <Typography variant="subtitle1">
                              {projeto.title}
                            </Typography>
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
              </Box>
            </TabPanel>
          </TabContext>
        </Card>
      </Box>
    </>
  );
};

export default Perfil;