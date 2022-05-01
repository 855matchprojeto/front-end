import React, { useRef, useState } from "react";
import {
  Typography,
  TextField,
  Grid,
  CardHeader,
  CardContent,
  Card,
  CardActions,
} from "@mui/material";
import { CardMedia, Button, Autocomplete } from "@mui/material";
import { makeStyles } from "@mui/styles";
import LoadingBox from "./LoadingBox";
import { useSnackbar } from "notistack";
import PersonIcon from "@mui/icons-material/Person";
import UploadIcon from "@mui/icons-material/Upload";

import {
  doGetDataUser,
  doGetAllCourses,
  doGetAllInteresses,
} from "../services/api_perfil";
import { doUpdateCourses, doUpdateInteresse } from "../services/api_perfil";
import { doSaveProfile } from "../services/api_perfil";

//--estilo--
const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "none",
  },

  cardContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },

  media: {
    width: "150px",
    height: "150px",
    border: "1px solid black",
    padding: "0",
  },

  mediaUpload: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      backgroundColor: "rgba(200,200,200,0.6)",
    },
  },

  actions: {
    display: "flex",
    justifyContent: "start",
    padding: "16px",
    width: "100%",
  },
}));
//---------

const MeusDados = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = React.useState(false);
  const [componentLoading, setComponentLoading] = React.useState(true);

  const [user, setUser] = React.useState(null);
  const [allInteresses, setAllInteresses] = React.useState([]);
  const [allCourses, setAllCourses] = React.useState([]);
  const imageUpload = useRef(null);
  const [showUpload, setShowUpload] = useState(false);

  React.useEffect(() => {
    async function getDataUser() {
      setComponentLoading(true);

      const res = await doGetDataUser();
      if (res.status === 200) {
        setUser({
          name: res.data.nome_exibicao.split(" ")[0],
          sobrenome: res.data.nome_exibicao.split(" ")[1],
          interesses: res.data.interesses,
          bio: res.data.bio !== null ? res.data.bio : "",
          cursos: res.data.cursos,
          email:
            res.data.emails && res.data.emails.length > 0
              ? res.data.emails[0].email
              : "",
          url_imagem:
            res.data.imagem_perfil !== null ? res.data.imagem_perfil.url : null,
        });
      }
    }

    async function getInteresses() {
      const res = await doGetAllInteresses();
      if (res.status === 200 && res.statusText === "OK")
        setAllInteresses(res.data);
    }

    async function getAllCourses() {
      const res = await doGetAllCourses();
      if (res.status === 200 && res.statusText === "OK")
        setAllCourses(res.data);
      setComponentLoading(false);
    }

    getDataUser();
    getInteresses();
    getAllCourses();
  }, []);

  async function updateCourses(v) {
    let aux = user.cursos;
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

    const res = await doUpdateCourses(aux[0].id, flag);
    if (flag) {
      if (res.status === 201) {
        enqueueSnackbar("Curso adicionado com sucesso!", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "success",
        });
        setUser({ ...user, cursos: v });
      } else {
        enqueueSnackbar("Houve um erro ao adicionar o curso!", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "error",
        });
      }
    } else {
      if (res.status === 204) {
        enqueueSnackbar("Curso removido com sucesso!", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "success",
        });
        setUser({ ...user, cursos: v });
      } else {
        enqueueSnackbar("Houve um erro ao remover o curso!", {
          anchorOrigin: {
            horizontal: "right",
            vertical: "top",
          },
          variant: "error",
        });
      }
    }
  }

  async function updateInteresses(v) {
    let aux = user.interesses;
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

    const res = await doUpdateInteresse(aux[0].id, flag);
    if (flag) {
      if (res.status === 201) {
        enqueueSnackbar("Interesse adicionado com sucesso!", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "success",
        });
        setUser({ ...user, interesses: v });
      } else {
        enqueueSnackbar("Houve um erro ao adicionar o interese!", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "error",
        });
      }
    } else {
      if (res.status === 204) {
        enqueueSnackbar("Interesse removido com sucesso!", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "success",
        });
        setUser({ ...user, interesses: v });
      } else {
        enqueueSnackbar("Houve um erro ao remover o interesse!", {
          anchorOrigin: {
            horizontal: "right",
            vertical: "top",
          },
          variant: "error",
        });
      }
    }
  }

  async function handleSave() {
    setIsLoading(true);
    const aux = {
      nome_exibicao: `${user.name} ${user.sobrenome}`,
      imagem_perfil: user.imagem_perfil,
      bio: user.bio,
    };

    const res = await doSaveProfile(aux);
    if (res.status === 200) {
      enqueueSnackbar("Dados atualizados com sucesso!", {
        anchorOrigin: {
          horizontal: "right",
          vertical: "top",
        },
        variant: "success",
      });
    }
    setIsLoading(false);
  }

  async function Base64(img) {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(img);

      reader.onload = () => {
        const res = reader.result;
        resolve(res);
      };
    });
  }

  async function updateImage(e) {
    let img = e.target.files[0];
    let aux = await Base64(img);
    let url = aux;
    aux = aux.split(",").pop();

    img = {
      file_name: img.name,
      file_type: `.${img.type.split("/")[1]}`,
      b64_content: aux,
    };

    setUser({ ...user, url_imagem: url, imagem_perfil: img });
  }

  return (
    <>
      {!componentLoading && user && (
        <Grid container>
          <Card className={classes.card}>
            <CardHeader title={<Typography variant="h6">Perfil</Typography>} />
            <input
              ref={imageUpload}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => updateImage(e)}
            />

            <CardMedia
              alt="Not Found"
              component={user.url_imagem !== null ? Button : PersonIcon}
              image={user.url_imagem !== null ? user.url_imagem : ""}
              className={classes.media}
              onClick={() => imageUpload.current && imageUpload.current.click()}
            >
              <div
                className={classes.mediaUpload}
                onMouseEnter={() => setShowUpload(!showUpload)}
                onMouseLeave={() => setShowUpload(!showUpload)}
              >
                {showUpload && (
                  <UploadIcon
                    color="primary"
                    fontSize="large"
                    style={{
                      border: "1px solid #1976d2",
                      borderRadius: "100%",
                    }}
                  />
                )}
              </div>
            </CardMedia>

            <CardContent className={classes.cardContent}>
              {/* email */}
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="email"
                    label="Email"
                    name="email"
                    variant="outlined"
                    placeholder="Email"
                    value={user ? user.email : ""}
                    size="small"
                    fullWidth
                    disabled
                  />
                </Grid>
              </Grid>

              {/* nome,sobrenome */}
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="text"
                    label="Nome"
                    name="name"
                    variant="outlined"
                    placeholder="Nome"
                    value={user ? user.name : ""}
                    onChange={(e) =>
                      setUser({ ...user, [e.target.name]: e.target.value })
                    }
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="input"
                    label="Sobrenome"
                    name="sobrenome"
                    variant="outlined"
                    placeholder="Sobrenome"
                    value={user ? user.sobrenome : ""}
                    onChange={(e) =>
                      setUser({ ...user, [e.target.name]: e.target.value })
                    }
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* bio */}
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    type="text"
                    label="Bio"
                    name="bio"
                    variant="outlined"
                    placeholder="Bio"
                    value={user ? user.bio : ""}
                    onChange={(e) =>
                      setUser({ ...user, [e.target.name]: e.target.value })
                    }
                    size="small"
                    multiline
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} columns={12} sx={{ mt: 1 }}>
                {/* caixa de cursos */}
                <Grid item xs={12} md={6} sx={{ mt: 1 }}>
                  <Autocomplete
                    options={allCourses}
                    getOptionLabel={(option) => option.nome_exibicao}
                    value={user.cursos}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    name="cursos"
                    id="cursos"
                    disableClearable={true}
                    multiple
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cursos"
                        placeholder="Cursos"
                        autoComplete="off"
                        size="small"
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => updateCourses(v)}
                  />
                </Grid>

                {/* caixa de interesses */}
                <Grid item xs={12} md={6} sx={{ mt: 1 }}>
                  <Autocomplete
                    options={allInteresses}
                    getOptionLabel={(option) => option.nome_exibicao}
                    value={user.interesses}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    name="interesses"
                    id="interesses"
                    disableClearable={true}
                    multiple
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Áreas de Interesse"
                        placeholder="Interesses"
                        autoComplete="off"
                        size="small"
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => updateInteresses(v)}
                  />
                </Grid>
              </Grid>
            </CardContent>

            <CardActions className={classes.actions}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSave()}
                disabled={isLoading}
              >
                Salvar
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )}

      {componentLoading && (
        <Grid
          container
          style={{ display: "flex", minHeight: "calc(100vh - 264px)" }}
        >
          <LoadingBox />
        </Grid>
      )}
    </>
  );
};

export default MeusDados;
