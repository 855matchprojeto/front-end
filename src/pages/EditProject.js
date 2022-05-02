import React, { useEffect } from "react";
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
  CardActions
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
    maxWidth: "300px", 
    maxHeight: "200px" 
  }, 

  actions: {
    display: "flex",
    justifyContent: "start",
    padding: "16px",
    width: "100%",
  },
}));
//---------

const EditProject = () => {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const pid = location.state?.data[0];
  const guid = location.state?.data[1];
  const classes = useStyles();
  const imageRef = React.useRef();

  const [fields, setFields] = React.useState(null);

  const [image, setImage] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);

  const [pageLoading, setPageLoading] = React.useState(true);
  const [allInteresses, setAllInteresses] = React.useState([]);
  const [allCourses, setAllCourses] = React.useState([]);

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
  const [isLoading, setIsLoading] = React.useState(false);

  const [areasSelecionadas, setAreasSelecionadas] = React.useState([]);
  const [cursosSelecionados, setCursosSelecionados] = React.useState([]);

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
      let res = await doGetAllInteresses();
      if (res.status === 200 && res.statusText === "OK")
        setAllInteresses(res.data);

      res = await doGetAllCourses();
      if (res.status === 200 && res.statusText === "OK")
        setAllCourses(res.data);
      setPageLoading(false);
    }

    getDados();
  }, []);

  useEffect(() => {
    async function getInfos() {
      // faz uma chamada de api com o pid (project id) e seta dados basicos
      const info = await getProjetos(pid, true);
      if (info.status === 200) {
        const infoData = info.data[0];
        setFields(infoData);
        setCursosSelecionados(infoData.cursos);
        setAreasSelecionadas(infoData.interesses);
      }
    }

    getInfos();
  }, [pid]);

  return (
    <>
      {!pageLoading && (
        <Grid container maxWidth="lg" className={classes.grid}>
          <Card className={classes.card}>
            <CardHeader title={<Typography variant="h6">Editar Projeto</Typography>} />
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => updateImage(e)}
            />

            <CardMedia
              alt="Not Found"
              component="img"
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="input"
                      label="Título do projeto"
                      placeholder="Título do projeto"
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
                          placeholder="Cursos"
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
                          placeholder="Áreas"
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

export default EditProject;
