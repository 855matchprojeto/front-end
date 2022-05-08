import React, { useRef } from "react";
import {Typography, TextField, Grid, CardHeader, IconButton } from "@mui/material";
import {CardContent, Card, CardActions } from "@mui/material";
import { CardMedia, Button, Autocomplete, Dialog, DialogContent } from "@mui/material";
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

function ImageDialog(props) 
{
  const [open, setOpen] = React.useState(false);
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
        component={urlImg !== null ? Button : PersonIcon}
        image={urlImg !== null ? urlImg : ""}
        className={classRef}
        onClick={() => handleOpen()}
      >
      </CardMedia>

      <Dialog
        open={open}
        PaperProps={{style:{maxWidth:"1000px", margin:"16px"}}}
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

const MeusDados = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = React.useState(false);
  const [componentLoading, setComponentLoading] = React.useState(true);

  const [loginInfo, setLoginInfo] = React.useState(false);

  const [user, setUser] = React.useState(null);
  const [allInteresses, setAllInteresses] = React.useState([]);
  const [allCourses, setAllCourses] = React.useState([]);
  const imageUpload = useRef(null);

  React.useEffect(() => {
    async function getDataUser() 
    {
      setComponentLoading(true);

      let aux = getLoginData();
      setLoginInfo({"email": aux.email, "username": aux.username});

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

    async function getSelect() 
    {
      let res = await doGetAllInteresses();
      if (res.status === 200 && res.statusText === "OK")
        setAllInteresses(res.data);

      res = await doGetAllCourses();
      if (res.status === 200 && res.statusText === "OK")
        setAllCourses(res.data);
      setComponentLoading(false);
    }

    getDataUser();
    getSelect();
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
    if (flag) 
    {
      if (res.status === 201) 
      {
        const msg = "Curso adicionado com sucesso!";
        const type = "success";
        enqueueMySnackBar(enqueueSnackbar, msg, type);
        setUser({ ...user, cursos: v });
      } 
      else 
      {
        const msg = "Houve um erro ao adicionar o curso!";
        const type = "error";
        enqueueMySnackBar(enqueueSnackbar, msg, type);
      }
    } 
    else 
    {
      if (res.status === 204) 
      {
        const msg = "Curso removido com sucesso!";
        const type = "success";
        enqueueMySnackBar(enqueueSnackbar, msg, type);
        setUser({ ...user, cursos: v });
      } 
      else 
      {
        const msg = "Houve um erro ao remover o curso!";
        const type = "error";
        enqueueMySnackBar(enqueueSnackbar, msg, type);
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
    if (flag) 
    {
      if (res.status === 201) 
      {
        const msg = "Interesse adicionado com sucesso!";
        const type = "success";
        enqueueMySnackBar(enqueueSnackbar, msg, type);
        setUser({ ...user, interesses: v });
      } 
      else 
      {
        const msg = "Houve um erro ao adicionar o interese!";
        const type = "error";
        enqueueMySnackBar(enqueueSnackbar, msg, type);
      }
    } 
    else 
    {
      if (res.status === 204) 
      {
        const msg = "Interesse removido com sucesso!";
        const type = "success";
        enqueueMySnackBar(enqueueSnackbar, msg, type);
        setUser({ ...user, interesses: v });
      } 
      else 
      {
        const msg = "Houve um erro ao remover o interesse!";
        const type = "error";
        enqueueMySnackBar(enqueueSnackbar, msg, type);
      }
    }
  }

  async function handleSave() {
    setIsLoading(true);
    
    let aux = {
      nome_exibicao: `${user.name} ${user.sobrenome}`,
      bio: user.bio
    };

    if(user.imagem_perfil)
      aux['imagem_perfil'] = user.imagem_perfil;

    const res = await doSaveProfile(aux);
    if (res.status === 200) 
    {
      const msg = "Dados atualizados com sucesso!";
      const type = "success";
      enqueueMySnackBar(enqueueSnackbar, msg, type);
    }
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
    const [open, setOpen] = React.useState(false);
    const [newPhone, setNewPhone] = React.useState("");
    const [phones, setPhones] = React.useState([]);

    React.useEffect(() => 
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
    const [open, setOpen] = React.useState(false);
    const [newEmail, setNewEmail] = React.useState("");
    const [emails, setEmails] = React.useState([]);

    React.useEffect(() => 
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

            <ImageDialog urlImg={user.url_imagem} classRef={classes.media}/>

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
                        autoComplete="off"
                        size="small"
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => updateCourses(v)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
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
                        autoComplete="off"
                        size="small"
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => updateInteresses(v)}
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
