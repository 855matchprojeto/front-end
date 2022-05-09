import React, { useRef, useState, useEffect } from "react";
import { Typography, TextField, Grid, CardHeader, IconButton } from "@mui/material";
import { CardContent, Card, CardActions } from "@mui/material";
import { Button, Autocomplete, Dialog, DialogContent } from "@mui/material";
import { List, ListItem, ListItemText, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import LoadingBox from "./LoadingBox";
import { useSnackbar } from "notistack";

import PersonIcon from "@mui/icons-material/Person";
import UploadIcon from "@mui/icons-material/Upload";
import PhoneIcon from '@mui/icons-material/Phone';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ContactMailIcon from '@mui/icons-material/ContactMail';

import { doGetAllCourses, doGetAllInteresses } from "../services/api_perfil";
import { doGetDataUser, postPhones, deletePhones } from "../services/api_perfil";
import { postEmail, deleteEmail } from "../services/api_perfil";
import { doUpdateCourses, doUpdateInteresse } from "../services/api_perfil";
import { doSaveProfile } from "../services/api_perfil";

import { enqueueMySnackBar, Base64, getLoginData } from "../services/util";
import ImageDialog from "./dialogs/ImageDialog";

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
          if(res.status === 200 && res.statusText === "OK")
          {setAllInteresses(res.data);}
        }
      );

      await doGetAllCourses().then(res =>
        {
          if (res.status === 200 && res.statusText === "OK")
          {setAllCourses(res.data);}
        }
      )

      setComponentLoading(false);
    }

    getData();
  }, []);

  async function handleSave() 
  {
    setIsLoading(true);
    
    let aux = {
      nome_exibicao: `${user.name} ${user.sobrenome}`,
      bio: user.bio
    };

    if(user.imagem_perfil)
      aux['imagem_perfil'] = user.imagem_perfil;

    let deleteArr = myCourses.filter(({ id }) => !myNewCourses.find((el) => el.id === id));
    let insertArr = myNewCourses.filter(({ id }) => !myCourses.find((el) => el.id === id));

    deleteArr.forEach(async (el) => {await doUpdateCourses(el.id, false)})
    insertArr.forEach(async (el) => {await doUpdateCourses(el.id, true)})

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

  const MyPhones = () =>
  {
    const [open, setOpen] = useState(false);
    const [newPhone, setNewPhone] = useState("");
    const [phones, setPhones] = useState([]);

    useEffect(() => 
    {
        async function doGetPhones()  
        {
          const res = await doGetDataUser();
          if(res.status === 200)
            setPhones(res.data.phones);
        }
        
        doGetPhones();
    }, [])
    
    const DeleteButton = (props) =>
    {
      const phoneGuid = props.phone;

      async function handleDeletePhone()
      {
        let res = await deletePhones(phoneGuid);
        if(res.status === 204)
        {
          res = await doGetDataUser();
          if (res.status === 200)
            setPhones(res.data.phones);    
        }
      }

      return(
        <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePhone()}> <DeleteIcon/> </IconButton>
      )
    }

    const AddButton = () =>
    {      
      async function handleNewPhone()
      {
        const body = {  "phone": newPhone, "id_tipo_contato": 1};
        let res = await postPhones(body);
        
        if(res.status === 200)
        {
          res = await doGetDataUser();
          if (res.status === 200)
          {
            setNewPhone("");
            setPhones(res.data.phones);    
          }
        }

      }

      return(
        <IconButton edge="end" aria-label="add" onClick={() => handleNewPhone()}> 
          <AddCircleIcon /> 
        </IconButton>
      )
    }

    return(
    <>
        <Button size="medium" variant="outlined" startIcon={<PhoneIcon/>} onClick={() => setOpen(true)}>
          Números de contato
        </Button>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogContent style={{display:"flex", justifyContent:"center", padding:"10px 12px"}}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}} aria-label="phones">

              <ListItem secondaryAction={<AddButton/>}>                  
                <ListItemText>
                  <TextField
                    type="text"
                    name="phones"
                    size="small"
                    value={newPhone}
                    label="Número"
                    onChange={(e) => setNewPhone(e.target.value)}
                    fullWidth
                  />
                </ListItemText>
              </ListItem>

              <Divider />

              {
                phones.map((phoneObj, index) => 
                <ListItem key={index} secondaryAction={<DeleteButton phone={phoneObj.guid}/>}>
                  <ListItemText>
                    <ListItemText primary={phoneObj.phone} />
                  </ListItemText>
                </ListItem>
                )
              }
            </List>
          </DialogContent>
        </Dialog>
    </>
    )
  }

  const MyEmails = () =>
  {
    const [open, setOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [emails, setEmails] = useState([]);

    useEffect(() => 
    {
        async function doGetEmails()  
        {
          const res = await doGetDataUser();
          if(res.status === 200)
            setEmails(res.data.emails);
        }
        
        doGetEmails();
    }, [])
    
    const DeleteButton = (props) =>
    {
      const emailGuid = props.email;

      async function handleDeleteEmail()
      {
        let res = await deleteEmail(emailGuid);
        if(res.status === 204)
        {
          res = await doGetDataUser();
          if (res.status === 200)
            setEmails(res.data.emails);    
        }
      }

      return(
        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEmail()}> <DeleteIcon/> </IconButton>
      )
    }

    const AddButton = () =>
    {      
      async function handleNewEmail()
      {
        const body = {"email": newEmail};
        let res = await postEmail(body);
        
        if(res.status === 200)
        {
          res = await doGetDataUser();
          if (res.status === 200)
          {
            setNewEmail("");
            setEmails(res.data.emails);    
          }
        }

      }

      return(
        <IconButton edge="end" aria-label="add" onClick={() => handleNewEmail()}> 
          <AddCircleIcon /> 
        </IconButton>
      )
    }

    return(
      <>
        <Button size="medium" variant="outlined" startIcon={<ContactMailIcon/>} onClick={() => setOpen(true)}>
          Emails de contato
        </Button>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogContent style={{display:"flex", justifyContent:"center", padding:"10px 12px"}}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}} aria-label="emails">

              <ListItem secondaryAction={<AddButton/>}>                  
                <ListItemText>
                  <TextField
                    type="email"
                    name="emails"
                    size="small"
                    value={newEmail}
                    label="Email"
                    onChange={(e) => setNewEmail(e.target.value)}
                    fullWidth
                  />
                  </ListItemText>
              </ListItem>

              <Divider />

              {
                emails.map((emailObj, index) => 
                <ListItem key={index} secondaryAction={<DeleteButton email={emailObj.guid}/>}>
                  <ListItemText>
                    <ListItemText primary={emailObj.email} />
                  </ListItemText>
                </ListItem>
                )
              }
            </List>
          </DialogContent>
        </Dialog>
      </>
    )
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

            <ImageDialog 
              urlImg={user.url_imagem} 
              classRef={classes.media} 
              cardMediaComp={user.url_imagem !== null ? Button : PersonIcon} 
              cardMediaImg={user.url_imagem !== null ? user.url_imagem : ""}
            />

            <Button
              variant="outlined"
              onClick={() => imageUpload.current && imageUpload.current.click()}
              size="small"
              sx={{ mt: 1, mb: 1 }}
            >
              Upload
              <UploadIcon fontSize="small" sx={{ ml: 0.4 }} />
            </Button>

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

                <Grid item lg={3} sm={6} xs={12}>
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
