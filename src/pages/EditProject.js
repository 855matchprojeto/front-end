import React, { useState, useRef, useEffect } from "react";
import { Container, Grid, Box, Typography, Button } from "@mui/material";
import {TextField, Stack, Chip, Card, CircularProgress } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { doGetAllCourses,doGetInteresses } from "../services/api_perfil";

const EditProject = () => {
  const imageUrl = "https://source.unsplash.com/random";
  const imageRef = useRef();
  const [fields, setFields] = useState({
    image: imageUrl,
    titulo: "Projeto Teste",
    cursos: [],
    areas: [],
    descricao: "Esse é um projeto Teste",
  });

  //const [responsaveis, setResponsaveis] = useState([ { name: "Lebron James", perfil: "Professor" }]);
  const [imageFile, setImageFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [areasSelecionadas, setAreasSelecionadas] = useState([
    {
      id: 3,
      nome_referencia: "dev_sustentavel",
      nome_exibicao: "Desenvolvimento Sustentável",
      descricao: "",
    },
    {
      id: 2,
      nome_referencia: "algoritmos",
      nome_exibicao: "Algoritmos",
      descricao: "",
    },
  ]);

  const [cursosSelecionados, setCursosSelecionados] = useState([
    {
      id: 4,
      nome_exibicao: "Engenharia da Computação",
      nome_referencia: "engenharia_comp",
      descricao: "",
    },
    {
      id: 3,
      nome_exibicao: "Ciência da Computação",
      nome_referencia: "ciencia_comp",
      descricao: "",
    },
  ]);

  const [image, setImage] = useState(null);

  const handleChangeFields = (e) => { setFields({ ...fields, [e.target.name]: e.target.value }); };
  const handleChangeAreas = (e, value) => { setAreasSelecionadas(value); };
  const handleChangeCursos = (e, value) => { setCursosSelecionados(value); };

  const handleCreateProject = async (e) => {
    // Faz as requisições para adicionar o projeto, e desativa o botao enquanto faz a requisição
    setIsLoading(true);

    // const form = new FormData();
    // const info = {
    //   ...fields,
    //   areas: areasSelecionadas,
    //   cursos: cursosSelecionados,
    //   imageFile: imageFile,
    // };

    // form.append("titulo", fields.titulo);
    // form.append("descricao", fields.descricao);
    // form.append("areas", areasSelecionadas);
    // form.append("cursos", cursos);
    // form.append("image", imageFile, imageFile.name);

    // try {
    //   const res = await axios.post("ENDPOINT", form, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   });
    //   console.log(res);
    // } catch (err) {
    //   console.log(err);
    // }

    console.log("Sucesso?");

    setIsLoading(false);
  };

  const handleImageFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setImageFile(e.target.files[0]);
    }
  };

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);

  const [allInteresses, setAllInteresses] = useState(null);
  const [allCourses, setAllCourses] = useState(null);

  useEffect(() => {
    setPageLoading(true);

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

    getInteresses();
    getAllCourses();
    setPageLoading(false);
  }, []);

  return (
    <>
      { !pageLoading &&
        <Container maxWidth="xl" sx={{ mb: 5 }}>
          <Card sx={{ width: "100%", p: 4, mt: 1 }}>
            <Typography variant="h5" color="textSecondary" sx={{ mb: 3 }}>
              Projeto Teste
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} sx>
                <Box>
                  <Box>
                    <Box
                      sx={{
                        width: "80%",
                        height: "300px",
                        bgcolor: "text.secondary",
                        mb: 2,
                      }}
                    >
                      <img
                        src={image ? image : imageUrl}
                        alt="Not Found"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </Box>
                    <Box>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={imageRef}
                        onChange={(e) => handleImageFile(e)}
                      />
                      <Button
                        variant="outlined"
                        onClick={() => imageRef.current.click()}
                        size="small"
                        sx={{ mb: 4 }}
                      >
                        Upload
                        <UploadIcon fontSize="small" sx={{ ml: 0.4 }} />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      type="input"
                      name="titulo"
                      value={fields.titulo}
                      fullWidth
                      label="Título do projeto"
                      onChange={(e) => handleChangeFields(e, null)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={3} sx={{ width: "100%" }}>
                      <TextField
                        multiple
                        options={allCourses && allCourses}
                        freeSolo
                        getOptionLabel={(option) => option.nome_exibicao}
                        defaultValue={cursosSelecionados}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              variant="outlined"
                              label={option.nome_exibicao}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        onChange={(e, value) => handleChangeCursos(e, value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Cursos Envolvidos"
                            placeholder="Cursos"
                            fullWidth
                          />
                        )}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={3} sx={{ width: "100%" }}>
                      <TextField
                        multiple
                        options={allInteresses && allInteresses}
                        getOptionLabel={(option) => option.nome_exibicao}
                        name="areas"
                        id="areas"
                        freeSolo
                        defaultValue={areasSelecionadas}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              variant="outlined"
                              label={option.nome_exibicao}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        onChange={(e, value) => handleChangeAreas(e, value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Áreas Envolvidas"
                            placeholder="Áreas"
                            fullWidth
                          />
                        )}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      type="input"
                      name="descricao"
                      multiline
                      rows={3}
                      value={fields.descricao}
                      fullWidth
                      label="Descrição do projeto"
                      onChange={(e) => handleChangeFields(e, null)}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleCreateProject}
                      disabled={isLoading}
                    >
                      Salvar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Container>
      }

      { pageLoading &&
        <Container style={{display: "flex", height: "calc(100vh - 84px)",alignItems: "center", justifyContent: "center"}} maxWidth="lg">
          <CircularProgress size={150} color="secondary" />
        </Container>
      }
    </>
  );
};

export default EditProject;