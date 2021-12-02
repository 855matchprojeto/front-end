import React, { useEffect } from "react";
import { Container, Grid, Box, Typography, Button } from "@mui/material";
import { useLocation } from "react-router";
import {TextField, Stack, Chip, Card, Autocomplete } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { getProjetos } from "../services/api_projetos";
import { doGetAllCourses,doGetInteresses } from "../services/api_perfil";
import { useSnackbar } from "notistack";
import LoadingBox from "../components/LoadingBox";
import axios from 'axios';
import { getToken } from "../services/auth";

const EditProject = () => {
  const { enqueueSnackbar } = useSnackbar();
  const location =  useLocation();
  const pid = location.state?.data[0];
  const guid = location.state?.data[1];
  const imageUrl = "https://source.unsplash.com/random";
  const defaultImageUrl = "https://rockcontent.com/br/wp-content/uploads/sites/2/2020/04/modelo-de-projeto.png";
  const imageRef = React.useRef();

  const [fields, setFields] = React.useState(null);

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
  const handleChangeAreas = (e, value) => { 
    setAreasSelecionadas(value); 
    console.log(value);
    console.log(e.target.value);
  };
  const handleChangeCursos = (e, value) => {
    setCursosSelecionados(value);

  };

  // comeca aqui


  async function updateCourses(value,type)
  {
    if(type === 'delete')
    {

    console.log(pid, value.id);
    const res = await axios.delete('https://projetos-match-projetos.herokuapp.com/rel_projeto_curso', [ {  id_projetos: pid, id_cursos: value.id, }], { headers: 
    { Authorization: 'Bearer ' + getToken }})

      if (res.status === 204) 
      {
        setFields({
          ...fields,
          cursos: fields.cursos.filter( (curso) => curso.nome_exibicao !== value.nome_exibicao)} );
        console.log("Curso removido com sucesso!");
      }

    }
    else if(type === "insert")
    {
      if (value) 
      {
        const newCourse = fields.cursos.find( (curso) => curso.nome_exibicao === value.nome_exibicao);
  
        if (!newCourse) 
        {
          try 
          {
            const res = await axios.post('https://projetos-match-projetos.herokuapp.com/rel_projeto_curso', [ {
              id_projetos: pid,
              id_cursos: value.id,
            }], {
              headers: {
                Authorization: `Bearer ${getToken}`
              }
            })
  
            if (res.status === 200) 
            {
              console.log("ADICIONADO COM SUCESSO");
              console.log(value);
              setFields({ ...fields, cursos: [...fields.cursos, value] });
            }
          } 
          catch (err) 
          {
            console.log(err);
          }
        }
      }
    }
  }

  async function updateAreas(e,value,type)
  {
    if(type === "delete")
    {
      const res = await axios.delete('https://projetos-match-projetos.herokuapp.com/rel_projeto_interesse', [ {
        id_projetos: pid,
        id_interesses: value.id,
      }], 
      {
        headers: {
          Authorization: `Bearer ${getToken}`
        }
      })

      if (res.status === 204) 
      {
        setFields({
          ...fields,
          interesses: fields.interesses.filter((interesse) => interesse.nome_exibicao !== value.nome_exibicao)
        });
        console.log("Interesse removido com sucesso!");
      }
    }
    else if(type === "insert")
    {
        const newInterest = fields.interesses.find( (interesse) => interesse.nome_exibicao === value.nome_exibicao);

      console.log(value.id);

      if(!newInterest)
      {
        try 
        {        
          const res = await axios.post('https://projetos-match-projetos.herokuapp.com/rel_projeto_interesse', [ {
            id_projetos: pid,
            id_interesses: value.id,
          }], {
            headers: {
              Authorization: `Bearer ${getToken}`
            }
          })
          if (res.status === 200) 
          {
            console.log("ADICIONADO COM SUCESSO");
            console.log(value);
            setFields({ ...fields, interesses: [...fields.interesses, value] });
          }
        } 
        catch (err) 
        {
          console.log(err);
        }
      }
    }

  }


  // termina aqui 

  const handleEditProject = async (e) => {
    // Faz as requisições para adicionar o projeto, e desativa o botao enquanto faz a requisição
    setIsLoading(true);

    const form = {
      titulo: fields.titulo,
      descricao: fields.descricao,
      interesses: areasSelecionadas.map((area) => area.id),
      cursos: cursosSelecionados.map((curso) => curso.id),
      entidades: [],
      tags: [],
    };

    try {
      const res = await axios.put(`https://projetos-match-projetos.herokuapp.com/projetos/${guid}`, form, {
        headers: {
          'Authorization': `Bearer ${getToken} `,
        }
      });

      if (res.status === 200) {
        enqueueSnackbar('Projeto atualizado com sucesso!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          variant: 'success'

        });
        
      } else {
        enqueueSnackbar('Erro ao atualizar o projeto!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          variant: 'error'

        });

      }

    } catch(err) {
      console.log(err);
      enqueueSnackbar('Erro ao atualizar o projeto!', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center'
        },
        variant: 'error'

      });
    }
    

    setIsLoading(false);
  };

 
  const [pageLoading, setPageLoading] = React.useState(true);

  const [allInteresses, setAllInteresses] = React.useState([]);
  const [allCourses, setAllCourses] = React.useState([]);

  React.useEffect(() => {
    async function getInteresses() 
    {
      setPageLoading(true);
      try {
        const res = await axios.get('https://projetos-match-projetos.herokuapp.com/interesse', {
          headers: {
            Authorization: `Bearer ${getToken}`
          }
        });

        if (res.status === 200){ 
          console.log('teste interesses');
          console.log(res.data);
          setAllInteresses(res.data);
        } 
     
      } catch (err) {
        console.log(err);
      }
    }
  
    async function getAllCourses() 
    {
      try 
      {
        const res = await axios.get('https://projetos-match-projetos.herokuapp.com/curso', {
          headers: {
            Authorization: `Bearer ${getToken}`
          }
        });
        if (res.status === 200 && res.statusText === "OK") 
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
          // const info = await getProjetos(pid,true);
          const info = await axios.get(`https://projetos-match-projetos.herokuapp.com/projetos?id=${pid}`, {
            headers: {
              Authorization: `Bearer ${getToken}`
            }
          });
          if (info.status === 200) {
            const infoData = info.data[0];
            setFields(infoData);
            setCursosSelecionados(infoData.cursos);
            setAreasSelecionadas(infoData.interesses);
            console.log(infoData);
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
        <Container maxWidth="lg" sx={{ mb: 5 }}>
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
                        src={image ? image : defaultImageUrl}
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
                      value={fields ? fields.titulo : ''}
                      fullWidth
                      label="Título do projeto"
                      onChange={(e) => handleChangeFields(e, null)}
                    />
                  </Grid>

                  {/* <Grid item xs={12}>
                    <Stack spacing={3} sx={{ width: "100%" }}>
                      <Autocomplete
                        multiple
                        options={allCourses && allCourses}
                        freeSolo
                        value={cursosSelecionados ? cursosSelecionados : []}
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
                  </Grid> */}
                  {/* Comeca aqui */}
                  <Grid item xs={12}>
                      <Typography variant="subtitle2">Cursos</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Autocomplete
                          options={allCourses}
                          getOptionLabel={(option) => option.nome_exibicao}
                          name="cursos"
                          id="cursos"
                          freeSolo
                          onChange={(e, value) => updateCourses(value,"insert")}
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
                      {fields &&
                        fields.cursos.map((curso, index) => (
                          <Chip
                            variant="outlined"
                            label={curso.nome_exibicao}
                            sx={{ mr: 1, mb: 1 }}
                            key={index}
                            onDelete={() => updateCourses(curso,"delete")}
                          />
                        ))}
                    </Grid>

                    {/* Termina aqui */}

                  {/* <Grid item xs={12}>
                    <Stack spacing={3} sx={{ width: "100%" }}>
                      <Autocomplete
                        multiple
                        options={allInteresses && allInteresses}
                        getOptionLabel={(option) => option.nome_exibicao}
                        name="areas"
                        id="areas"
                        value={areasSelecionadas ? areasSelecionadas : []}
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
                  </Grid> */}
                   <Grid item xs={12}>
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
                        onChange={(e, value) => updateAreas(e, value,"insert")}
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
                      {fields &&
                        fields.interesses.map((area, index) => (
                          <Chip
                            variant="outlined"
                            label={area.nome_exibicao}
                            sx={{ mr: 1, mb: 1 }}
                            key={index}
                            onDelete={(e) => updateAreas(e,area,"delete")}
                          />
                        ))}
                    </Grid>

                  <Grid item xs={12}>
                    <TextField
                      type="input"
                      name="descricao"
                      multiline
                      rows={3}
                      value={fields ? fields.descricao : ''}
                      fullWidth
                      label="Descrição do projeto"
                      onChange={(e) => handleChangeFields(e, null)}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleEditProject}
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