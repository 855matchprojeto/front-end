import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Grid,
  TextField,
  Autocomplete,
  Chip,
  Button,
  useMediaQuery,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useSnackbar } from "notistack";
import { getToken } from "../../services/auth";
import axios from "axios";
import { useHistory } from "react-router";
import { Formik, Form, setFieldValue } from "formik";
import * as Yup from "yup";

const CriarProjeto = () => {
  const values = {
    titulo: "",
    descricao: "",
    cursos: [],
    areas: [],
  };

  const validationScheme = Yup.object().shape({
    titulo: Yup.string().required("Digite um título para o projeto"),
    descricao: Yup.string().required("Digite uma descrição para o projeto"),
    cursos: Yup.array().required("Escolha pelo menos um curso").min(1),
    areas: Yup.array().required("Escolha pelo menos uma área").min(1),
  });
  const { enqueueSnackbar } = useSnackbar();
  const matches = useMediaQuery("(max-width: 900px)");

  const imageRef = useRef();
  const history = useHistory();
  const [fields, setFields] = useState({ titulo: "", descricao: "" });
  const defaultImageUrl =
    "https://rockcontent.com/br/wp-content/uploads/sites/2/2020/04/modelo-de-projeto.png";
  const [imageFile, setImageFile] = useState(null);

  const [image, setImage] = useState(null);

  async function handleCreateProject(values) {
    // Faz as requisições para adicionar o projeto, e desativa o botao enquanto faz a requisição
    setIsLoading(true);

    const form = {
      titulo: values.titulo,
      descricao: values.descricao,
      entidades: [],
      tags: [],
      url_imagem: "https://picsum.photos/200/500?random=50",
      interesses: values.areas.map((area) => area.id),
      cursos: values.cursos.map((curso) => curso.id),
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
    <Card sx={{ width: "100%", p: 4, minHeight: "100vh" }}>
      <Formik
        initialValues={values}
        validationSchema={validationScheme}
        onSubmit={(values) => {
          handleCreateProject(values);
        }}
      >
        {({
          handleChange,
          values,
          setFieldValue,
          errors,
          touched,
          handleBlur,
        }) => (
          <Form>
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
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  name="titulo"
                  error={Boolean(touched.titulo && errors.titulo)}
                  helperText={touched.titulo ? errors.titulo : ""}
                  value={values.titulo}
                  fullWidth
                  margin="normal"
                  style={{
                    width: matches ? "100%" : "50%",
                  }}
                  label="Título do projeto"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  name="descricao"
                  margin="normal"
                  error={Boolean(touched.descricao && errors.descricao)}
                  helperText={touched.descricao ? errors.descricao : ""}
                  multiline
                  rows={3}
                  value={values.descricao}
                  fullWidth
                  label="Descrição do projeto"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  name="cursos"
                  id="cursos"
                  multiple
                  options={allCourses && allCourses}
                  getOptionLabel={(option) => option.nome_exibicao}
                  fullWidth
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
                    setFieldValue("cursos", value);
                  }}
                  onBlur={handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cursos Envolvidos"
                      placeholder="Cursos"
                      margin="normal"
                      error={Boolean(touched.cursos && errors.cursos)}
                      helperText={
                        touched.cursos &&
                        errors.cursos &&
                        "Escolha pelo menos um curso"
                      }
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={allInteresses && allInteresses}
                  getOptionLabel={(option) => option.nome_exibicao}
                  name="areas"
                  id="areas"
                  fullWidth
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
                    setFieldValue("areas", value);
                  }}
                  onBlur={handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Áreas Envolvidas"
                      placeholder="Áreas"
                      margin="normal"
                      error={Boolean(touched.areas && errors.areas)}
                      helperText={
                        touched.areas &&
                        errors.areas &&
                        "Escolha pelo menos uma área"
                      }
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={["Teste", "Teste1", "Teste2"]}
                  getOptionLabel={(option) => option}
                  name="participantes"
                  id="participantes"
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Participantes"
                      placeholder="Adicionar Participantes"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={isLoading}
                  sx={{
                    width: "250px",
                    p: 1,
                  }}
                >
                  Criar projeto
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default CriarProjeto;
