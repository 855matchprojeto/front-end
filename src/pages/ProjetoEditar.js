import React, { useEffect, useState, useRef } from "react";
import { Grid, Button } from "@mui/material";
import { useLocation } from "react-router";
import {
  TextField,
  Card,
  CardHeader,
  Autocomplete,
  Typography,
  CardMedia,
  CardContent,
  CardActions,
  DialogContent, 
  Dialog
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import UploadIcon from "@mui/icons-material/Upload";
import { useSnackbar } from "notistack";
import LoadingBox from "../components/LoadingBox";
import { doGetAllCourses, doGetAllInteresses } from "../services/api_projetos";
import { getProjetos, updateProjetos } from "../services/api_projetos";
import { doUpdateAreas, doUpdateCourses } from "../services/api_projetos";
import { enqueueMySnackBar,Base64 } from "../services/util";
import ProjectDefault from "../icons/project.svg";

//--estilo--
const useStyles = makeStyles((theme) => ({
  grid: {
    alignSelf: "center",
    marginTop: theme.spacing(4),
  },

  card: {
    width: "100%",
    minHeight: "calc(100vh - 148px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",    
  },

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

  actions: {
    display: "flex",
    justifyContent: "start",
    padding: "16px",
    width: "100%",
  },
}));
//---------

function ImageDialog(props) 
{
  const [open, setOpen] = useState(false);
  const classRef = props.classRef;
  const urlImg = props.urlImg;
  
  function handleOpen()
  {
    if(urlImg !== null)
      setOpen(true);
  }

  return (
    <>
      <CardMedia
        alt="Not Found"
        component={Button}
        image={urlImg ? urlImg : ProjectDefault}
        className={classRef}
        onClick={() => handleOpen()}
      >
      </CardMedia>

      <Dialog
        PaperProps={{style:{maxWidth:"1000px", margin:"16px"}}}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogContent style={{display:"flex", justifyContent:"center", padding:"15px 18px"}}>
          <img alt="" src={urlImg} style={{maxHeight:"100%", maxWidth:"100%"}}>

          </img>
        </DialogContent>
      </Dialog>
    </>
  );
}

const ProjetoEditar = () => {
  const mountedRef = useRef(true);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const pid = location.state?.data[0];
  const guid = location.state?.data[1];
  const classes = useStyles();
  const imageRef = useRef();

  const [fields, setFields] = useState(null);

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [allInteresses, setAllInteresses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

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

  // enquanto estiver criando um projeto, nao deixa clicar no botao
  const [isLoading, setIsLoading] = useState(false);

  const [areasSelecionadas, setAreasSelecionadas] = useState([]);
  const [cursosSelecionados, setCursosSelecionados] = useState([]);

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

  // termina aqui
  async function handleEditProject(e) {
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

    const res = await updateProjetos(guid, form);

    if (res.status === 200) 
    {
      const msg = "Projeto atualizado com sucesso!";
      const type = "success";  
      enqueueMySnackBar(enqueueSnackbar, msg, type);
    } 
    else 
    {
      const msg = "Erro ao atualizar o projeto!";
      const type = "error";  
      enqueueMySnackBar(enqueueSnackbar, msg, type);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    async function getDados() {
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
            const infoData = res.data[0];
            setFields(infoData);
            setCursosSelecionados(infoData.cursos);
            setAreasSelecionadas(infoData.interesses);
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

  return (
    <>
      {!pageLoading && (
        <Grid container maxWidth="md" className={classes.grid}>
          <Card className={classes.card}>
            <CardHeader title={<Typography variant="h6">Editar Projeto</Typography>} />
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => updateImage(e)}
            />

            <ImageDialog urlImg={image} classRef={classes.media}/>

            <Button
              variant="outlined"
              onClick={() => imageRef.current && imageRef.current.click()}
              size="small"
              sx={{ mt: 1, mb: 1 }}
            >
              Upload
              <UploadIcon fontSize="small" sx={{ ml: 0.4 }} />
            </Button>

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
                    <Autocomplete
                      options={allCourses}
                      getOptionLabel={(option) => option.nome_exibicao}
                      value={cursosSelecionados}
                      isOptionEqualToValue={(o, v) => o.id === v.id}
                      name="cursos"
                      id="cursos"
                      multiple
                      freeSolo
                      onChange={(e, v) => updateCourses(v)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Cursos"
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={allInteresses}
                      getOptionLabel={(option) => option.nome_exibicao}
                      value={areasSelecionadas}
                      isOptionEqualToValue={(o, v) => o.id === v.id}
                      name="interesses"
                      id="interesses"
                      multiple
                      freeSolo
                      onChange={(e, v) => updateAreas(v)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Áreas"
                          size="small"
                          fullWidth
                        />
                      )}
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

          </Card>
        </Grid>
      )}

      {pageLoading && <LoadingBox />}
    </>
  );
};

export default ProjetoEditar;
