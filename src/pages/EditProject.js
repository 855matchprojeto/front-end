import React, { useEffect } from "react";
import { Container, Grid, Box, Typography, Button } from "@mui/material";
import { useLocation } from "react-router";
import {
  TextField,
  Card,
  CardHeader,
  Autocomplete,
  useMediaQuery,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useSnackbar } from "notistack";
import LoadingBox from "../components/LoadingBox";
import { doGetAllCourses, doGetAllInteresses } from "../services/api_projetos";
import { getProjetos, updateProjetos } from "../services/api_projetos";
import { doUpdateAreas, doUpdateCourses } from "../services/api_projetos";

const EditProject = () => {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const pid = location.state?.data[0];
  const guid = location.state?.data[1];
  const imageRef = React.useRef();
  const matches = useMediaQuery("(max-width: 900px)");

  const [fields, setFields] = React.useState(null);

  const [image, setImage] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);

  const [pageLoading, setPageLoading] = React.useState(true);
  const [allInteresses, setAllInteresses] = React.useState([]);
  const [allCourses, setAllCourses] = React.useState([]);

  const handleImageFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setImageFile(e.target.files[0]);
    }
  };

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

    if (res.status === 200) {
      enqueueSnackbar("Projeto atualizado com sucesso!", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        variant: "success",
      });
    } else {
      enqueueSnackbar("Erro ao atualizar o projeto!", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        variant: "error",
      });
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
        <Card sx={{ width: "100%", p: 4, mt: 1, minHeight: "100vh" }}>
          <CardHeader title="Editar Projeto" />
          <Grid container spacing={1} rowGap={1}>
            <Grid item xs={12}>
              <Grid container rowGap={2}>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <img
                    src={image ? image : "https://bit.ly/37W5LLQ"}
                    alt="Not Found"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
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
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="input"
                name="titulo"
                value={fields ? fields.titulo : ""}
                style={{
                  width: matches ? "100%" : "50%",
                }}
                fullWidth
                label="Título do projeto"
                onChange={(e) => handleChangeFields(e, null)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="input"
                name="descricao"
                multiline
                rows={3}
                value={fields ? fields.descricao : ""}
                fullWidth
                label="Descrição do projeto"
                onChange={(e) => handleChangeFields(e, null)}
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
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                onClick={handleEditProject}
                disabled={isLoading}
              >
                Salvar
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}

      {pageLoading && <LoadingBox />}
    </>
  );
};

export default EditProject;
