import React, { useRef, useState, useEffect } from "react";
import { Typography, TextField, Grid, CardHeader } from "@mui/material";
import { CardContent, CardActions } from "@mui/material";
import { Button, Autocomplete } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";

import PersonIcon from "@mui/icons-material/Person";
import UploadIcon from "@mui/icons-material/Upload";

import { doGetAllCourses, doGetAllInteresses } from "../services/api_perfil";
import { doGetDataUser, doSaveProfile } from "../services/api_perfil";
import { doUpdateCourses, doUpdateInteresse } from "../services/api_perfil";

import { enqueueMySnackBar, Base64, getLoginData } from "../services/util";
import ImageDialog from "../components/dialogs/ImageDialog";
import MyEmails from "../components/dialogs/MyEmails";
import MyPhones from "../components/dialogs/MyPhones";
import CardPage from "../components/customCards/CardPage";

//--estilo--
const useStyles = makeStyles((theme) => ({
  cardContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },

  mediaContainer: {
    display: "flex", 
    justifyContent: "center"
  },

  media: {
    width: "150px",
    height: "150px",
    border: "1px solid black",
    padding: "0",
  },

  actions: {
    display: "flex",
    justifyContent: "start",
    padding: theme.spacing(2),
    width: "100%",
  },
}));
//---------

function Perfil()
{
  const mountedRef = useRef(true);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);

  const [loginInfo, setLoginInfo] = useState(false);

  const [allInteresses, setAllInteresses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const imageUpload = useRef(null);

  const [user, setUser] = useState(null);

  const [myCourses, setMyCourses] = useState([]);
  const [myNewCourses, setMyNewCourses] = useState([]);

  const [myInteresses, setMyInteresses] = useState([]);
  const [myNewInteresses, setMyNewInteresses] = useState([]);

  //const [myEmails, setMyEmails] = useState([]);  
  //const [myPhones, setMyPhones] = useState([]);

  const [changeSelect, setChangeSelect] = useState(false);

  useEffect(() => {
    
    async function getDataUser() 
    {
      setIsLoading(true);

      await doGetDataUser().then(res =>
        {
          if (!mountedRef.current)
            return
          if(res.status === 200)
          {
            let aux = res.data;

            setMyCourses(aux.cursos);
            setMyInteresses(aux.interesses);

            setMyNewCourses(aux.cursos);
            setMyNewInteresses(aux.interesses);
            
            //setMyEmails(aux.emails);
            //setMyEmails(aux.phones);
          }
        }
      );

      setIsLoading(false);
    }

    getDataUser();
  },[changeSelect])

  useEffect(() => {
    async function getData() 
    {
      setComponentLoading(true);

      let aux = getLoginData();
      setLoginInfo({"email": aux.email, "username": aux.username});

      await doGetDataUser().then(res =>
        {
          if (!mountedRef.current)
            return
          if (res.status === 200) 
          {
            aux = res.data;
            let body = {
              name: aux.nome_exibicao.split(" ")[0],
              sobrenome: aux.nome_exibicao.split(" ")[1],
              bio: aux.bio !== null ? aux.bio : "",
              url_imagem: aux.imagem_perfil !== null ? aux.imagem_perfil.url : null,
            };
    
            setUser(body);

            setMyCourses(aux.cursos);
            setMyInteresses(aux.interesses);
    
            setMyNewCourses(aux.cursos);
            setMyNewInteresses(aux.interesses);
          }
        }
      );

      await doGetAllInteresses().then(res =>
        {
          if (!mountedRef.current)
            return
          if(res.status === 200 && res.statusText === "OK")
            setAllInteresses(res.data);
        }
      );

      await doGetAllCourses().then(res =>
        {
          if (!mountedRef.current)
            return
          if (res.status === 200 && res.statusText === "OK")
            setAllCourses(res.data);
          setComponentLoading(false);
        }
      )
    }

    getData();
  }, []);

  // cleanup
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, [])

  async function handleSave() 
  {
    setIsLoading(true);
    
    // nome e sobrenome (required)
    // bio (optional)
    let aux = {
      nome_exibicao: `${user.name} ${user.sobrenome}`,
      bio: user.bio
    };

    // imagem (optional)
    if(user.imagem_perfil)
      aux['imagem_perfil'] = user.imagem_perfil;

    // campos de cursos (optional)
    let deleteArr = myCourses.filter(({ id }) => !myNewCourses.find((el) => el.id === id));
    let insertArr = myNewCourses.filter(({ id }) => !myCourses.find((el) => el.id === id));

    deleteArr.forEach(async (el) => {await doUpdateCourses(el.id, false)})
    insertArr.forEach(async (el) => {await doUpdateCourses(el.id, true)})

    // campos de interesses (optional)
    deleteArr = myInteresses.filter(({ id }) => !myNewInteresses.find((el) => el.id === id));
    insertArr = myNewInteresses.filter(({ id }) => !myInteresses.find((el) => el.id === id));

    deleteArr.forEach(async (el) => await doUpdateInteresse(el.id, false));
    insertArr.forEach(async (el) => await doUpdateInteresse(el.id, true));

    let res = await doSaveProfile(aux);
    if (res.status === 200) 
    {
      const msg = "Dados atualizados com sucesso!";
      const type = "success";
      enqueueMySnackBar(enqueueSnackbar, msg, type);
    }

    setChangeSelect(!changeSelect);
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

    setUser({ ...user, url_imagem: url, imagem_perfil: img });
  }

  return (
    <CardPage loading={componentLoading}>
        { user &&
          <>
            <CardHeader title={<Typography style={{display:"flex", justifyContent:"center"}} variant="h6">Perfil</Typography>} />

            <input
              ref={imageUpload}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => updateImage(e)}
            />
            
            <div className={classes.mediaContainer}>
              <ImageDialog 
                urlImg={user.url_imagem} 
                classRef={classes.media} 
                cardMediaComp={user.url_imagem !== null ? Button : PersonIcon} 
                cardMediaImg={user.url_imagem !== null ? user.url_imagem : ""}
              />
            </div>

            <Grid style={{display:"flex", justifyContent:"center"}}>
              <Button
                variant="outlined"
                onClick={() => imageUpload.current && imageUpload.current.click()}
                size="small"
                sx={{ mt: 1, mb: 1 }}
              >
                Upload
                <UploadIcon fontSize="small" sx={{ ml: 0.4 }} />
              </Button>
            </Grid>

            <CardContent className={classes.cardContent}>
              <Grid container spacing={1} rowGap={1}>

                <Grid item xs={6}>
                  <TextField
                    type="text"
                    label="Username"
                    name="username"
                    value={loginInfo ? loginInfo.username : ""}
                    size="small"
                    disabled
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    type="email"
                    label="Email"
                    name="email"
                    value={loginInfo ? loginInfo.email : ""}
                    size="small"
                    disabled
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="text"
                    label="Nome"
                    name="name"
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
                    value={user ? user.sobrenome : ""}
                    onChange={(e) =>
                      setUser({ ...user, [e.target.name]: e.target.value })
                    }
                    size="small"
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    type="text"
                    label="Bio"
                    name="bio"
                    value={user ? user.bio : ""}
                    onChange={(e) =>
                      setUser({ ...user, [e.target.name]: e.target.value })
                    }
                    size="small"
                    multiline
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={allCourses}
                    getOptionLabel={(option) => option.nome_exibicao}
                    value={myNewCourses}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    name="cursos"
                    id="cursos"
                    disableClearable={true}
                    multiple
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cursos"
                        autoComplete="off"
                        size="small"
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => setMyNewCourses(v)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={allInteresses}
                    getOptionLabel={(option) => option.nome_exibicao}
                    value={myNewInteresses}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    name="interesses"
                    id="interesses"
                    disableClearable={true}
                    multiple
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Áreas de Interesse"
                        autoComplete="off"
                        size="small"
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => setMyNewInteresses(v)}
                  />
                </Grid>

                <Grid item md={6}>
                  <MyPhones/>                    
                </Grid>

                <Grid item lg={6} sm={6} xs={12}>
                  <MyEmails/>  
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
          </>
        }
    </CardPage>
  );
};

export default Perfil;