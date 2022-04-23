import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  TextField,
  Grid,
  Card,
  Box,
  Button,
  Chip,
  Autocomplete,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useSnackbar } from "notistack";
import LoadingBox from "../components/LoadingBox";
import { getToken } from "../services/auth";
import axios from "axios";
import { useHistory } from "react-router";

const Projetos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const imageRef = useRef();
  const history = useHistory();
  const [fields, setFields] = useState({ titulo: "", descricao: "" });

  const defaultImageUrl =
    "https://rockcontent.com/br/wp-content/uploads/sites/2/2020/04/modelo-de-projeto.png";
  //const [responsaveis, setResponsaveis] = useState([ { name: "Lebron James", perfil: "Professor" } ]);
  const [imageFile, setImageFile] = useState(null);

  const [areasSelecionadas, setAreasSelecionadas] = useState([]);
  const [cursosSelecionados, setCursosSelecionados] = useState([]);
  const [image, setImage] = useState(null);

  const handleChangeFields = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleChangeAreas = (e, value) => {
    setAreasSelecionadas(value);
  };
  const handleChangeCursos = (e, value) => {
    setCursosSelecionados(value);
  };

  async function handleCreateProject(e) {
    // Faz as requisições para adicionar o projeto, e desativa o botao enquanto faz a requisição
    setIsLoading(true);

    const form = {
      titulo: fields.titulo,
      descricao: fields.descricao,
      entidades: [],
      tags: [],
      url_imagem: "https://picsum.photos/200/500?random=50",
      interesses: areasSelecionadas.map((area) => area.id),
      cursos: cursosSelecionados.map((curso) => curso.id),
    };
    try {
      const res = await axios.post(
        "https://projetos-match-projetos.herokuapp.com/projetos",
        form,
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      );

      if (res.status === 200) {
        enqueueSnackbar("Projeto criado com sucesso!", {
          anchorOrigin: {
            horizontal: "right",
            vertical: "top",
          },
          variant: "success",
        });
        history.push("/projeto", { data: [res.data.id, res.data.guid] });
      } else {
        enqueueSnackbar("Erro ao criar o projeto!", {
          anchorOrigin: {
            horizontal: "right",
            vertical: "top",
          },
          variant: "error",
        });
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Erro ao criar o projeto!", {
        anchorOrigin: {
          horizontal: "right",
          vertical: "top",
        },
        variant: "error",
      });
    }

    setIsLoading(false);
  }

  const handleImageFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setImageFile(e.target.files[0]);
    }
  };

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [allInteresses, setAllInteresses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    async function getInteresses() {
      setPageLoading(true);
      try {
        const res = await axios.get(
          "https://projetos-match-projetos.herokuapp.com/interesse",
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        );
        if (res.statusText === "OK") setAllInteresses(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    async function getAllCourses() {
      try {
        const res = await axios.get(
          "https://projetos-match-projetos.herokuapp.com/curso",
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        );
        if (res.status === 200 && res.statusText === "OK")
          setAllCourses(res.data);
      } catch (err) {
        console.log(err);
      }
      setPageLoading(false);
    }

    getInteresses();
    getAllCourses();
  }, []);

  return (
    <>
      {!pageLoading && (
        <Box
          sx={{
            width: "100%",
            mt: 4
          }}
        >
          <Card sx={{ width: "100%", p: 4, minHeight: "100vh" }}>
            <Typography
              variant="h5"
              color="textSecondary"
              sx={{ mb: 3, fontWeight: 500 }}
            >
              Criar novo projeto
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container rowGap={2}>
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <img
                      src={image ? image : defaultImageUrl}
                      alt="Not Found"
                      style={{
                        maxWidth: "300px",
                        maxHeight: "300px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={imageRef}
                      onChange={(e) => handleImageFile(e)}
                      accept=".png, .jpg, .jpeg"
                    />
                    <Button
                      variant="outlined"
                      onClick={() => imageRef.current.click()}
                      size="small"
                    >
                      Upload
                      <UploadIcon fontSize="small" sx={{ ml: 0.4 }} />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="center">
                <TextField
                  type="text"
                  name="titulo"
                  value={fields.titulo}
                  margin="normal"
                  fullWidth
                  sx={{
                    maxWidth: "600px",
                  }}
                  label="Título do projeto"
                  onChange={(e) => handleChangeFields(e, null)}
                />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="center">
                <Autocomplete
                  multiple
                  options={allCourses && allCourses}
                  getOptionLabel={(option) => option.nome_exibicao}
                  fullWidth
                  sx={{
                    maxWidth: "600px",
                  }}
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
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="center">
                <Autocomplete
                  multiple
                  options={allInteresses && allInteresses}
                  getOptionLabel={(option) => option.nome_exibicao}
                  name="areas"
                  id="areas"
                  fullWidth
                  sx={{
                    maxWidth: "600px",
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option.nome_exibicao}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  onChange={(e, value) => {
                    handleChangeAreas(e, value);
                    console.log(value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Áreas Envolvidas"
                      placeholder="Áreas"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="center">
                <TextField
                  type="text"
                  name="descricao"
                  margin="normal"
                  multiline
                  rows={3}
                  value={fields.descricao}
                  sx={{
                    maxWidth: "600px",
                  }}
                  fullWidth
                  label="Descrição do projeto"
                  onChange={(e) => handleChangeFields(e, null)}
                />
              </Grid>

              <Grid
                item
                xs={12}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={isLoading}
                  onClick={handleCreateProject}
                  sx={{
                    width: "250px",
                    p: 1,
                  }}
                >
                  Criar projeto
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Box>
      )}

      {pageLoading && <LoadingBox />}
    </>
  );
};

export default Projetos;
