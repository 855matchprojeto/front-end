import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { Grid, TextField, Autocomplete } from "@mui/material";
import { Button, Card, CardContent, CardActions } from "@mui/material";
import { makeStyles } from "@mui/styles";
import UploadIcon from "@mui/icons-material/Upload";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSnackbar } from "notistack";

import { doGetAllCourses,doGetAllInteresses } from "../../services/api_projetos";
import { postProjetos } from "../../services/api_projetos";
import { getProfiles } from "../../services/api_perfil";
import LoadingBox from "../LoadingBox";
import { enqueueMySnackBar,Base64 } from "../../services/util";
import ProjectDefault from "../../icons/project.svg";                           
import ImageDialog from "../dialogs/ImageDialog";

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
    marginTop: theme.spacing(3),
    width: "300px",
    height: "200px",
    boxShadow: "0 0 3px" + (theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.common.black),
    backgroundSize: "contain",
  }, 

  actions: {
    display: "flex",
    justifyContent: "start",
    padding: "16px",
    width: "100%",
  },
}));
//---------

function CriarProjeto()
{
  const values = {
    titulo: "",
    descricao: "",
    cursos: [],
    areas: []
  };

  const validationScheme = Yup.object().shape({
    titulo: Yup.string().required("Digite um título para o projeto"),
    descricao: Yup.string().required("Digite uma descrição para o projeto"),
    cursos: Yup.array().required("Escolha pelo menos um curso").min(1),
    areas: Yup.array().required("Escolha pelo menos uma área").min(1),
  });

  const classes = useStyles();
  const mountedRef = useRef(true);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const imageRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState(null);

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [allInteresses, setAllInteresses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [userList, setUserList] = useState([]);

  async function handleCreateProject(values) 
  {
    // Faz as requisições para adicionar o projeto, e desativa o botao enquanto faz a requisição
    setIsLoading(true);

    const form = {
      titulo: values.titulo,
      descricao: values.descricao,
      interesses: values.areas.map((area) => area.id),
      cursos: values.cursos.map((curso) => curso.id),
    };
    
    // imagem (optional)
    if(imageFile)
      form['imagem_projeto'] = imageFile;

    await postProjetos(form).then(res => 
      {
        if (res.status === 200) 
        {
          enqueueMySnackBar(enqueueSnackbar, "Projeto criado com sucesso!", "success");
          history.push("/projeto", { data: [res.data.id, res.data.guid] });
        }
        else
        {
          enqueueMySnackBar(enqueueSnackbar, "Erro ao criar o projeto!", "error");
          setIsLoading(false);
        }
      }
    )
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

  useEffect(() => {
    async function getSelects() 
    {
      setPageLoading(true);

      let proms = [];
      proms.push(doGetAllInteresses());
      proms.push(doGetAllCourses());
      proms.push(getProfiles([[],[],""], 5));

      await Promise.all(proms).then(data => 
        {
          if (!mountedRef.current)
            return
          if (data[0].status === 200 && data[0].statusText === "OK") 
            setAllInteresses(data[0].data);
          if (data[1].status === 200 && data[1].statusText === "OK") 
            setAllCourses(data[1].data); 
          if (data[2].status === 200)
            setUserList(data[2].data.items);
          
          setPageLoading(false);
        }
      )
    }

    getSelects();
  }, []);

  // cleanup
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, [])

  return (
    <>
      { !pageLoading &&
      <Grid container maxWidth="md" className={classes.grid}>
        <Formik
          initialValues={values}
          validationSchema={validationScheme}
          onSubmit={(values) => {handleCreateProject(values)}}
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

                <ImageDialog 
                  urlImg={image} 
                  classRef={classes.media} 
                  cardMediaComp={Button} 
                  cardMediaImg={image ? image : ProjectDefault}
                />

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
                        options={userList}
                        getOptionLabel={(option) => option.nome_exibicao}
                        isOptionEqualToValue={(o, v) => o.guid_usuario === v.guid_usuario}
                        name="participantes"
                        id="participantes"
                        multiple
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
