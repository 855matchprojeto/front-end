import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { Grid, TextField, Autocomplete } from "@mui/material";
import { Button, Card, CardMedia, CardContent, CardActions } from "@mui/material";
import { makeStyles } from "@mui/styles";
import UploadIcon from "@mui/icons-material/Upload";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSnackbar } from "notistack";

import { doGetAllCourses,doGetAllInteresses } from "../../services/api_projetos";
import { postProjetos } from "../../services/api_projetos";
import LoadingBox from "../LoadingBox";
import { enqueueMySnackBar,Base64 } from "../../services/util";
import ProjectDefault from "../../icons/project.svg";                           

//--estilo--
const useStyles = makeStyles((theme) => ({
  grid: {
    alignSelf: "center",
  },

  form: {
    width: "100%",
    margin: "0",
    display: "flex"
  },

  card: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",    
    boxShadow: "none",
    backgroundColor: (theme.palette.mode === "dark" ? "#2c2c2c" : theme.palette.background.paper),
    backgroundImage: "none"
  },

  cardContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },

  media: {
    marginTop: theme.spacing(4),
    width: "300px",
    height: "200px",
    boxShadow: "0 0 3px" + (theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.common.black),
  }, 

  actions: {
    display: "flex",
    justifyContent: "start",
    padding: "16px",
    width: "100%",
  },
}));
//---------

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

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const imageRef = useRef(null);
  const history = useHistory();
  const [imageFile, setImageFile] = useState(null);

  const [image, setImage] = useState(null);

  async function handleCreateProject(values) 
  {
    // Faz as requisições para adicionar o projeto, e desativa o botao enquanto faz a requisição
    setIsLoading(true);

    const form = {
      titulo: values.titulo,
      descricao: values.descricao,
      entidades: [],
      tags: [],
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

  async function updateImage(e) 
  {
    let img = e.target.files[0];
    let aux = await Base64(img);
    let url = aux;
    aux = aux.split(",").pop();

    img = {
      file_name: img.name,
      file_type: `.${img.type.split("/")[1]}`,
      b64_content: aux,
    };

    setImage(url);
    setImageFile(img);
  }

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
      <Grid container maxWidth="md" className={classes.grid}>
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
            <Form className={classes.form}>
              <Card className={classes.card}>
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => updateImage(e)}
                  />

                  <CardMedia
                  alt="Not Found"
                  component={Button}
                  image={image ? image : ProjectDefault}
                  className={classes.media}
                >
                </CardMedia>

                <Button
                  variant="outlined"
                  onClick={() => imageRef.current.click()}
                  size="small"
                  sx={{ mt: 1, mb: 1 }}
                >
                  Upload
                  <UploadIcon fontSize="small" sx={{ ml: 0.4 }} />
                </Button>

                <CardContent className={classes.cardContent}>
                  <Grid container spacing={1} rowGap={1}>
                    <Grid item xs={12}>
                      <TextField
                        type="text"
                        name="titulo"
                        error={Boolean(touched.titulo && errors.titulo)}
                        helperText={touched.titulo ? errors.titulo : ""}
                        value={values.titulo}
                        fullWidth
                        size="small"
                        label="Título do projeto"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        type="text"
                        name="descricao"
                        size="small"
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
                        size="small"
                        multiple
                        options={allCourses}
                        getOptionLabel={(option) => option.nome_exibicao}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        fullWidth
                        onBlur={handleBlur}
                        onChange={(e, value) => {setFieldValue("cursos", value);}}
                        
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Cursos Envolvidos"
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
                        options={allInteresses}
                        getOptionLabel={(option) => option.nome_exibicao}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        name="areas"
                        id="areas"
                        multiple
                        fullWidth
                        size="small"
                        onBlur={handleBlur}
                        onChange={(e, value) => {setFieldValue("areas", value);}}

                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Áreas Envolvidas"
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
                        size="small"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Participantes"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>

                <CardActions className={classes.actions}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={isLoading}
                    sx={{
                      width: "250px",
                      p: 1,
                    }}
                  >
                    Criar projeto
                  </Button>
                </CardActions>
              </Card>
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
