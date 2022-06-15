import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import { useSnackbar } from "notistack";

import { Grid, Button } from "@mui/material";
import { TextField, CardHeader, Autocomplete } from "@mui/material";
import { Typography, CardActions, CardContent } from "@mui/material";
import { makeStyles } from "@mui/styles";

import UploadIcon from "@mui/icons-material/Upload";

import { doGetAllCourses, doGetAllInteresses } from "../services/api_projetos";
import { getProjetos, updateProjetos } from "../services/api_projetos";
import { doUpdateAreas, doUpdateCourses } from "../services/api_projetos";

import { enqueueMySnackBar,Base64 } from "../services/util";
import ProjectDefault from "../icons/project.svg";
import CardPage from "../components/customCards/CardPage";
import ImageDialog from "../components/dialogs/ImageDialog";

import { Form,Formik } from "formik";
import * as Yup from "yup";

//--estilo--
const useStyles = makeStyles((theme) => ({
  cardContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },

  media: {
    width: "300px",
    height: "200px",
    boxShadow: "0 0 3px" + (theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.common.black),
  }, 

  mediaContainer: {
    display: "flex", 
    justifyContent: "center"
  },

  actions: {
    display: "flex",
    justifyContent: "start",
    padding: "16px",
    width: "100%",
  },
}));
//---------

const ProjetoEditar = () => {
  const mountedRef = useRef(true);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const pid = location.state?.data[0];
  const guid = location.state?.data[1];
  const classes = useStyles();

  const imageRef = useRef();
  const [fields, setFields] = useState(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [allInteresses, setAllInteresses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [myInteresses, setMyInteresses] = useState([]);
  const [myNewInteresses, setMyNewInteresses] = useState([]);

  const [myCourses, setMyCourses] = useState([]);
  const [myNewCourses, setMyNewCourses] = useState([]);

  const [changeSelect, setChangeSelect] = useState(false);

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

    setFields({ ...fields, url_imagem: url, imagem_projeto: img });
  }

  async function handleEditProject(values) 
  {
    setIsLoading(true);

     // titulo e descricao (required)
    const form = {
      titulo: values.titulo,
      descricao: values.descricao
    };

    // imagem (optional)
    if(fields.imagem_projeto)
      form['imagem_projeto'] = fields.imagem_projeto;

    // campos de cursos (optional)
    let deleteArr = myCourses.filter(({ id }) => !myNewCourses.find((el) => el.id === id));
    let insertArr = myNewCourses.filter(({ id }) => !myCourses.find((el) => el.id === id));
    deleteArr = deleteArr.map(el => ({'id_projetos': pid, 'id_cursos': el.id}));
    insertArr = insertArr.map(el => ({'id_projetos': pid, 'id_cursos': el.id}));
    await doUpdateCourses(deleteArr, false);
    await doUpdateCourses(insertArr, true);

    // campos de interesses (optional)
    deleteArr = myInteresses.filter(({ id }) => !myNewInteresses.find((el) => el.id === id));
    insertArr = myNewInteresses.filter(({ id }) => !myInteresses.find((el) => el.id === id));
    deleteArr = deleteArr.map(el => ({'id_projetos': pid, 'id_interesses': el.id}));
    insertArr = insertArr.map(el => ({'id_projetos': pid, 'id_interesses': el.id}));
    await doUpdateAreas(deleteArr, false);
    await doUpdateAreas(insertArr, true);

    await updateProjetos(guid, form).then(res => 
      {
        if (res.status === 200) 
        {
          const msg = "Projeto atualizado com sucesso!";
          enqueueMySnackBar(enqueueSnackbar, msg, "success");
        } 
        else 
        {
          const msg = "Erro ao atualizar o projeto!";
          enqueueMySnackBar(enqueueSnackbar, msg, "error");
        }
      }
    );

    setChangeSelect(!changeSelect);
    setIsLoading(false);
  }

  useEffect(() => {  
    async function getInfos() 
    {
      setIsLoading(true);

      await getProjetos(pid, true).then(res =>
        {
          if (!mountedRef.current)
            return
          if(res.status === 200)
          {
            let aux = res.data[0];

            let body = {
              titulo: aux.titulo,
              descricao: aux.descricao,
              url_imagem: aux.imagem_projeto !== null ? aux.imagem_projeto.url : null,
            };

            setFields(body);
            
            setMyCourses(aux.cursos);
            setMyNewCourses(aux.cursos);

            setMyInteresses(aux.interesses);
            setMyNewInteresses(aux.interesses);
          }

          setIsLoading(false);
        }
      );
    }

    getInfos();
  },[changeSelect, pid])

  useEffect(() => {
    async function getDados() 
    {
      setPageLoading(true);

      await Promise.all([doGetAllInteresses(),doGetAllCourses()]).then(data => 
        {
          if (!mountedRef.current)
            return
          if (data[0].status === 200 && data[0].statusText === "OK")
            setAllInteresses(data[0].data);
          if (data[1].status === 200 && data[1].statusText === "OK")
            setAllCourses(data[1].data);
          setPageLoading(false);
        }
      );      
    }

    getDados();
  }, []);

  // cleanup
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, [])

  const MyAutoComplete = (props) => {
    const name_id = props.NameId;
    const options = props.Options;
    const event = props.Event;
    const label = props.Label;
    const value = props.Value;

    return (
      <>
        <Autocomplete
            options={options}
            getOptionLabel={(o) => o.nome_exibicao}
            value={value}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            name={name_id}
            id={name_id}
            multiple
            freeSolo

            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                autoComplete="off"
                size="small"
                fullWidth
              />
            )}

            onChange={(e,v) => event(v)}
          />  
      </>
    )
  }

  const validationSchema = Yup.object().shape({
    titulo: Yup.string().required("Digite um título para o projeto"),
    descricao: Yup.string().required("Digite uma descrição para o projeto."),
  });

  return (
    <CardPage loading={pageLoading}>
      { fields &&
        <>
          <CardHeader title={<Typography style={{display:"flex", justifyContent:"center"}} variant="h6">Editar Projeto</Typography>} />
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => updateImage(e)}
          />
          <div className={classes.mediaContainer}>
            <ImageDialog 
              urlImg={fields.url_imagem} 
              classRef={classes.media}
              cardMediaComp={Button}
              cardMediaImg={fields.url_imagem !== null ? fields.url_imagem : ProjectDefault}
            />
          </div>

          <Grid style={{display:"flex", justifyContent:"center"}}>
            <Button
              variant="outlined"
              onClick={() => imageRef.current && imageRef.current.click()}
              size="small"
              sx={{ mt: 1, mb: 1 }}
            >
              Upload
              <UploadIcon fontSize="small" sx={{ ml: 0.4 }} />
            </Button> 
          </Grid>

          <Formik
            initialValues={
              {
                titulo: fields.titulo,
                descricao: fields.descricao
              }
            }
            validationSchema={validationSchema}
            onSubmit={(values) => {handleEditProject(values)}}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit} style={{display:"flex", flexDirection:"column"}}>

                <CardContent className={classes.cardContent}>
                  <Grid container spacing={1} rowGap={1}>

                        <Grid item xs={12} md={6}>
                          <TextField
                            type="input"
                            label="Título do projeto"
                            name="titulo"
                            value={props.values.titulo}
                            size="small"
                            autoComplete="off"
                            fullWidth
                            onChange={props.handleChange}
                            error={Boolean(props.touched.titulo && props.errors.titulo)}
                            helperText={props.errors.titulo}
                            onBlur={props.handleBlur}
                          />
                        </Grid>

                        <Grid item xs={12} md={12}>
                          <TextField
                            type="input"
                            label="Descrição do projeto"
                            name="descricao"
                            value={props.values.descricao}
                            size="small"
                            autoComplete="off"
                            multiline
                            fullWidth
                            onChange={props.handleChange}
                            error={Boolean(props.touched.descricao && props.errors.descricao)}
                            helperText={props.errors.descricao}
                            onBlur={props.handleBlur}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <MyAutoComplete
                            NameId="cursos"
                            Label="Cursos" 
                            Options={allCourses} 
                            Event={setMyNewCourses} 
                            Value={myNewCourses}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <MyAutoComplete
                            NameId="interesses" 
                            Label="Áreas" 
                            Options={allInteresses} 
                            Event={setMyNewInteresses} 
                            Value={myNewInteresses}
                          />
                        </Grid>
                  </Grid>
                </CardContent>

                <CardActions className={classes.actions}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                  >
                    Salvar
                  </Button>
                </CardActions>


              </Form>
            )}
          </Formik>
        </>
      }
    </CardPage>
  );
};

export default ProjetoEditar;