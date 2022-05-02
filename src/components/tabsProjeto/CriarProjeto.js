import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { Grid, TextField, Autocomplete, Chip } from "@mui/material";
import { Button, useMediaQuery } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSnackbar } from "notistack";

import { doGetAllCourses,doGetAllInteresses } from "../../services/api_projetos";
import { postProjetos } from "../../services/api_projetos";
import LoadingBox from "../LoadingBox";
import { enqueueMySnackBar } from "../../services/util";

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

  const imageRef = useRef(null);
  const history = useHistory();
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

    const res = await postProjetos(form);

    if (res.status === 200) 
    {
      const msg = "Projeto criado com sucesso!";
      const type = "success";  
      enqueueMySnackBar(enqueueSnackbar, msg, type);
      history.push("/projeto", { data: [res.data.id, res.data.guid] });
    } 
    else 
    {
      const msg = "Erro ao criar o projeto!";
      const type = "error";
      enqueueMySnackBar(enqueueSnackbar, msg, type);
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
    async function getSelects() 
    {
      setPageLoading(true);

      let res = await doGetAllInteresses();
      if (res.status === 200 && res.statusText === "OK") 
        setAllInteresses(res.data);
  
      res = await doGetAllCourses();
      if (res.status === 200 && res.statusText === "OK") 
        setAllCourses(res.data); 

      setPageLoading(false);
    }

    getSelects();
  }, []);

  return (
    <>
      { !pageLoading &&
      <Grid container spacing={1} p={4}>
        <Formik
          initialValues={values}
          validationSchema={validationScheme}
          onSubmit={(values) => {handleCreateProject(values);}}
        >
          {({
            handleChange,
            values,
            setFieldValue,
            errors,
            touched,
            handleBlur,
          }) => (
            <Form style={{width : "100%", margin : "auto"}}>
              <Grid item xs={12}>
                <Grid container rowGap={2}>
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <img
                      src={image ? image : "https://bit.ly/37W5LLQ"}
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
                      accept="image/*"
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
                    size="small"
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
            </Form>
          )}
        </Formik>
      </Grid>
      }

      { pageLoading && 
        <div style={{margin: "auto"}}>
          <LoadingBox/>
        </div>
      }
    </>
  );
};

export default CriarProjeto;
