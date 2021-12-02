import React, { useEffect } from "react";
import { Container, Grid, Box, Typography, Button } from "@mui/material";
import { useLocation } from "react-router";
import {TextField, Stack, Chip, Card, Autocomplete } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { getProjetos } from "../services/api_projetos";
import { doGetAllCourses,doGetInteresses } from "../services/api_perfil";
import LoadingBox from "../components/LoadingBox";

const EditProject = () => {
  const location =  useLocation();
  const pid = location.state?.data[0];
  const guid = location.state?.data[1];
  const imageUrl = "https://source.unsplash.com/random";
  const imageRef = React.useRef();

  const [fields, setFields] = React.useState({
    image: imageUrl,
    titulo: "Projeto Teste",
    cursos: [],
    areas: [],
    descricao: "Esse é um projeto Teste",
  });

  const [image, setImage] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);

  const handleImageFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setImageFile(e.target.files[0]);
    }
  };

  // enquanto estiver criando um projeto, nao deixa clicar no botao
  const [isLoading, setIsLoading] = React.useState(false);

  const [areasSelecionadas, setAreasSelecionadas] = React.useState(null);

  const [cursosSelecionados, setCursosSelecionados] = React.useState(null);

  const handleChangeFields = (e) => { setFields({ ...fields, [e.target.name]: e.target.value }); };
  const handleChangeAreas = (e, value) => { setAreasSelecionadas(value); };
  const handleChangeCursos = (e, value) => { setCursosSelecionados(value); };

  const handleCreateProject = async (e) => {
    // Faz as requisições para adicionar o projeto, e desativa o botao enquanto faz a requisição
    setIsLoading(true);

    const formTeste = new FormData();

    formTeste.append("titulo", fields.titulo);
    formTeste.append("descricao", fields.descricao);
    formTeste.append("areas", areasSelecionadas);
    formTeste.append("cursos", cursosSelecionados);
    formTeste.append("image", imageFile, imageFile.name);

    console.log(formTeste);

    const form = {
      titulo: fields.titulo,
      descricao: fields.descricao,
      interesses: areasSelecionadas.map((area) => area.id),
      cursos: cursosSelecionados.map((curso) => curso.id),
    };

    console.log(form);

    console.log("Sucesso?");

    setIsLoading(false);
  };

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = React.useState(true);

  const [allInteresses, setAllInteresses] = React.useState([]);
  const [allCourses, setAllCourses] = React.useState([]);

  React.useEffect(() => {
    async function getInteresses() 
    {
      setPageLoading(true);
      try 
      {
        const res = await doGetInteresses();
        if (res.statusText === "OK") 
          console.log('teste interesses');
          console.log(res.data);
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
          console.log('teste courses');
          console.log(res.data);
          setAllCourses(res.data);
        
      } 
      catch (err) 
      {
        console.log(err);
      }
      setPageLoading(false);
    }

    getInteresses();
    getAllCourses();
  }, []);

  useEffect(() => 
  {
     
      async function getInfos() 
      {
        // faz uma chamada de api com o pid (project id) e seta dados basicos
        try {
          const info = await getProjetos(pid,true);
          if (info.status === 200) {
            const infoData = info.data[0];
            setFields({...infoData, 
              image: fields.image,
              cursos: fields.cursos,
              areas: fields.areas
            });
          } 

        } catch(err) {
          console.log(err);
        }

        // // PUXAR CURSOS
        // //const cr = await getProjetos(dados);
        // //getProjectCursos(cr.data[0]);
        // getProjectCursos([]);

        // // PUXAR AREAS
        // //const ar = await getProjetos(dados);
        // //getProjectAreas(ar.data[0]);
        // getProjectAreas([]);

        // setPageLoading(false);
      }
      
      // getStatusInteresse();
      getInfos();

  },[pid])


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
                      <Autocomplete
                        multiple
                        options={allCourses && allCourses}
                        freeSolo
                        getOptionLabel={(option) => option.nome_exibicao}
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
                      <Autocomplete
                        multiple
                        options={allInteresses && allInteresses}
                        getOptionLabel={(option) => option.nome_exibicao}
                        name="areas"
                        id="areas"
                        freeSolo
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

      { pageLoading && <LoadingBox/> }
    </>
  );
};

export default EditProject;