import React, { useState, useEffect } from "react";
import { Typography, TextField, Grid, CardHeader, CardContent, Card, CardActions} from "@mui/material"; 
import { Container, CircularProgress, Box, Button, Tab, Chip, Autocomplete} from "@mui/material";

import { useSnackbar } from "notistack";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { makeStyles } from "@mui/styles";

import Interesses from "../components/Interesses";
import MeusProjetos from "../components/MeusProjetos";

import { doHandleDelete,doHandleDeleteCourses } from "../services/api_perfil";
import { doGetDataUser } from "../services/api_perfil";
//import { doAdicionaCurso,doHandleTextFieldChange } from "../services/api_perfil";
import { doAdicionaInteresse } from "../services/api_perfil";
import { doGetAllCourses, doGetInteresses } from "../services/api_perfil";
import { doHandleChangeCourses,doHandleSave  } from "../services/api_perfil";

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
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  
  const [valueTab, setTabValue] = useState("perfil");
  const handleChange = (event, newValue) => { setTabValue(newValue);};

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

  async function handleDelete(value) {
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

  async function handleDeleteCourses(value) {
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

  async function adicionaCurso(value) {
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

  async function handleSave() {
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

  async function handleTextFieldChange(field, value) {
    if (value) {
      if (field === "interesses") {
        const newInterest = user.interesses.find(
          (interesse) => interesse.nome_exibicao === value.nome_exibicao
        );

        if (!newInterest) {
          try {
            const res = await doAdicionaInteresse(value.id);

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

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [allInteresses, setAllInteresses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);


  useEffect(() => {
    setPageLoading(true);

    async function getDataUser() 
    {
      try 
      {
        const res = await doGetDataUser();
  
        if (res.status === 200) 
        {
          setUser({
            name: res.data.nome_exibicao.split(" ")[0],
            sobrenome: res.data.nome_exibicao.split(" ")[1],
            interesses: res.data.interesses,
            cursos: res.data.cursos,
            email: res.data.emails[0],
          });
        }
      } 
      catch (err) 
      {
        console.log(err);
      }
    }

    async function getInteresses() 
    {
      try 
      {
        const res = await doGetInteresses();
        if (res.statusText === "OK") 
          setAllInteresses(res.data);
      
      } 
      catch (err) 
      {
        console.log(err);
      }
    }  

    async function getAllCourses() 
    {
      try 
      {
        const res = await doGetAllCourses();
        if (res.status === 200 && res.statusText === "OK") 
          setAllCourses(res.data);
        
      }
      catch (err) 
      {
        console.log(err);
      }
    }

    getDataUser();
    getInteresses();
    getAllCourses();

    setPageLoading(false);
  }, []);

  return (
    <>
      { !pageLoading &&
        <Box sx={{ mb: 4 }}>
          <Card sx={{ minHeight: "calc(100vh - 184px)", mt: 4 }}>
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
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <Tab label="Meus Dados" value="perfil" />
                  <Tab label="Meus Projetos" value="projetos" />
                  <Tab label="Tenho Interesse" value="interesses" />
                </TabList>
              </Box>

              {/* ABA DE PERFIL */}
              <TabPanel value="perfil">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardHeader
                        title={
                          <Typography variant="h6" align="center">
                            {user && `${user.name}`}
                          </Typography>
                        }
                      />

                      <CardContent style={{display: "flex", justifyContent: "center"}}>
                        <Box>
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
                          {/* email,nome,sobrenome */}
                          <Grid item xs={12} md={6}>
                            <TextField
                              className={classes.textField}
                              type="email"
                              label="Email"
                              variant="outlined"
                              placeholder="Email"
                              value={user ? user.email.email : ""}
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
                              value={user ? user.name : ""}
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

                          {/* caixa de cursos */}
                          <Grid item xs={12} sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">Cursos</Typography>
                          </Grid>

                          <Grid item xs={12}>
                              <Autocomplete
                                options={allCourses}
                                getOptionLabel={(option) => option.nome_exibicao}
                                name="cursos"
                                id="cursos"
                                freeSolo
                                onChange={(e, value) => adicionaCurso(value)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Cursos"
                                    placeholder="Cursos"
                                    value=""
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

                          {/* caixa de interesses */}
                          <Grid item xs={12} sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">
                              Áreas de Interesse
                            </Typography>
                          </Grid>

                          <Grid item xs={12}>
                            <Autocomplete
                              options={allInteresses}
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
                                  autoComplete="off"
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

              {/* ABA MEUS PROJETOS */}
              <TabPanel value="projetos">
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <MeusProjetos />
                </Box>
              </TabPanel>

              {/* ABA MEUS INTERESSES */}
              <TabPanel value="interesses">
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <Interesses />
                </Box>
              </TabPanel>
            </TabContext>
          </Card>
        </Box>
      }

      { pageLoading &&
        <Container style={{display: "flex", height: "calc(100vh - 84px)",alignItems: "center", justifyContent: "center"}} maxWidth="lg">
          <CircularProgress size={150} color="secondary" />
        </Container>
      }
    </>
  );
};

export default Perfil;
