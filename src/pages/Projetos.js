import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Stack,
  Chip,
  Card,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { getToken } from "../services/auth";

import axios from "axios";

const Projetos = () => {
  const imageRef = useRef();
  const [fields, setFields] = useState({
    titulo: "",
    descricao: "",
  });
  const [allInteresses, setAllInteresses] = useState(null);
  const [allCourses, setAllCourses] = useState(null);
  const defaultImageUrl =
    "https://rockcontent.com/br/wp-content/uploads/sites/2/2020/04/modelo-de-projeto.png";

  const [responsaveis, setResponsaveis] = useState([
    { name: "Lebron James", perfil: "Professor" },
  ]);

  const [imageFile, setImageFile] = useState(null);
  const getInteresses = async () => {
    const URL = "https://perfis-match-projetos.herokuapp.com/interests";
    try {
      const res = await axios.get(URL, {
        headers: {
          Authorization: "Bearer " + getToken,
          Accept: "application/json",
        },
      });
      setAllInteresses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getCursos = async () => {
    const URL = "https://perfis-match-projetos.herokuapp.com/courses";
    try {
      const res = await axios.get(URL, {
        headers: {
          Authorization: "Bearer " + getToken,
          Accept: "application/json",
        },
      });
      setAllCourses(res.data);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
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

  const handleCreateProject = async (e) => {
    // Faz as requisições para adicionar o projeto, e desativa o botao enquanto faz a requisição
    setIsLoading(true);
    const form = {
      titulo: fields.titulo,
      descricao: fields.descricao,
      interesses: areasSelecionadas.map((area) => area.id),
      cursos: cursosSelecionados.map((curso) => curso.id),
      autores: [],
    };

    try {
      const res = await axios.post(
        "https://projetos-match-projetos.herokuapp.com/projetos",
        form,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  };

  const handleImageFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setImageFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    getInteresses();
    getCursos();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mb: 5 }}>
      <Card sx={{ width: "100%", p: 4, mt: 2 }}>
        <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>
          Criar novo projeto
        </Typography>

        <Grid container spacing={1} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
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

          <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
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
                    getOptionLabel={(option) => option.nome_exibicao}
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
                    onChange={(e, value) => {
                      handleChangeAreas(e, value);
                      console.log(value);
                    }}
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
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleCreateProject}
                  disabled={isLoading}
                  size="small"
                >
                  Criar projeto
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Projetos;
