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

  // enquanto estiver criando um projeto, nao deixa clicar no botao
  const [isLoading, setIsLoading] = useState(false);

  const [areasSelecionadas, setAreasSelecionadas] = useState([]);
  const [cursosSelecionados, setCursosSelecionados] = useState([]);

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

  const handleChangeFields = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  async function updateCourses(v) {
    let aux = cursosSelecionados;
    let flag;

    if (aux.length > v.length) {
      //delete
      aux = aux.filter(({ id }) => !v.find((el) => el.id === id));
      flag = false;
    } //insert
    else {
      aux = v.filter(({ id }) => !aux.find((el) => el.id === id));
      flag = true;
    }

    await doUpdateCourses([{ id_projetos: pid, id_cursos: aux[0].id }], flag);
    setCursosSelecionados(v);
  }

  async function updateAreas(v) {
    let aux = areasSelecionadas;
    let flag;

    if (aux.length > v.length) {
      //delete
      aux = aux.filter(({ id }) => !v.find((el) => el.id === id));
      flag = false;
    } //insert
    else {
      aux = v.filter(({ id }) => !aux.find((el) => el.id === id));
      flag = true;
    }

    await doUpdateAreas([{ id_projetos: pid, id_interesses: aux[0].id }], flag);
    setAreasSelecionadas(v);
  }

  async function handleEditProject(e) 
  {
    setIsLoading(true);

    const form = {
      titulo: fields.titulo,
      descricao: fields.descricao
    };

    // imagem (optional)
    if(fields.imagem_projeto)
      form['imagem_projeto'] = fields.imagem_projeto;

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

        setIsLoading(false);
      }
    );
  }

  useEffect(() => {
    async function getDados() 
    {
      setPageLoading(true);

      await doGetAllInteresses().then(res => 
        {
          if (!mountedRef.current)
            return
          if (res.status === 200 && res.statusText === "OK")
            setAllInteresses(res.data);
        }
      )
      
      await doGetAllCourses().then(res => 
        {
          if (!mountedRef.current)
            return
          if (res.status === 200 && res.statusText === "OK")
            setAllCourses(res.data);
          setPageLoading(false);
        }
      )
      
    }

    getDados();
  }, []);

  useEffect(() => {
    async function getInfos() 
    {
      await getProjetos(pid, true).then(res =>
        {
          if (!mountedRef.current)
            return
          if (res.status === 200) 
          {
            let aux = res.data[0];
            let body = {
              titulo: aux.titulo,
              descricao: aux.descricao,
              url_imagem: aux.imagem_projeto !== null ? aux.imagem_projeto.url : null,
            };

            setFields(body);
            setCursosSelecionados(aux.cursos);
            setAreasSelecionadas(aux.interesses);
          }
        }
      );
      
    }

    getInfos();
  }, [pid]);

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

          <CardContent className={classes.cardContent}>
            <Grid container spacing={1} rowGap={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  type="input"
                  label="Título do projeto"
                  name="titulo"
                  value={fields ? fields.titulo : ""}
                  size="small"
                  fullWidth
                  onChange={(e) => handleChangeFields(e, null)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="input"
                  label="Descrição do projeto"
                  name="descricao"
                  value={fields ? fields.descricao : ""}
                  onChange={(e) => handleChangeFields(e, null)}
                  size="small"
                  multiline
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MyAutoComplete
                  NameId="cursos" 
                  Options={allCourses} 
                  Event={updateCourses} 
                  Label="Cursos" 
                  Value={cursosSelecionados}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MyAutoComplete
                  NameId="interesses" 
                  Options={allInteresses} 
                  Event={updateAreas} 
                  Label="Áreas" 
                  Value={areasSelecionadas}
                />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions className={classes.actions}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditProject}
              disabled={isLoading}
            >
              Salvar
            </Button>
          </CardActions>
        </>
      }
    </CardPage>
  );
};

export default ProjetoEditar;