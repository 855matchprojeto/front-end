import React, { Suspense, useState, useEffect, useRef } from "react";
import { Dialog } from "@mui/material";
import { useHistory } from "react-router-dom";

import { getUserProjRel, getProjUserRel } from "../../services/api_projetos";
import { putRel } from "../../services/api_projetos";

const Avatar = React.lazy(() => import('@mui/material/Avatar'));
const Box = React.lazy(() => import('@mui/material/Box'));
const Typography  = React.lazy(() => import('@mui/material/Typography'));
const Button = React.lazy(() => import('@mui/material/Button'));
const IconButton = React.lazy(() => import('@mui/material/IconButton'));
const DialogContent = React.lazy(() => import('@mui/material/DialogContent'));
const DialogActions = React.lazy(() => import('@material-ui/core/DialogActions'));


const DialogNotification = (props) => {
  const history = useHistory();
  const mountedRef = useRef(true);

  const notif = props.notif;
  const setOpen = props.setOpen;
  const user = props.user;

  const [btnInteresse, setBtnInteresse] = useState(false);
  const [status, setStatus] = useState(false);

  useEffect(() => {

    async function getStatusUP()
    {
      await getUserProjRel(true, null, null).then(res => 
        {
          if (!mountedRef.current)
            return
          if(res.status === 200)
          {
            res = res.data;
            res.forEach(el => el.interesse_usuario_projeto.guid = el.guid);
            res = res.map(el => el.interesse_usuario_projeto);
            res = res.filter(el => el.guid === notif.json_details.project.guid);
            res = res.filter(el => el.guid_usuario === notif.guid_usuario);
            
            setStatus(res.fl_projeto_interesse);

            if(res.fl_projeto_interesse)
              setBtnInteresse(true);
            else
              setBtnInteresse(false);
          }
        }
      )   
    }

    async function getStatusPU()
    {
      await getProjUserRel(notif.json_details.project.guid, null, null).then(res => 
        {
          if (!mountedRef.current)
            return
          if(res.status === 200)
          {
            res = res.data;
            console.log(res);
            res = res.filter(el => el.guid_usuario === notif.guid_usuario);
            res = res[0];
            setStatus(res.fl_usuario_interesse);

            if(res.fl_usuario_interesse)
              setBtnInteresse(true);
            else
              setBtnInteresse(false);
          }
        }
      )   
    }

    if (notif.tipo === "INTERESSE_USUARIO_PROJETO") 
      getStatusUP();
    else if (notif.tipo === "INTERESSE_PROJETO_USUARIO")
      getStatusPU();

  }, [notif.guid_usuario, notif.json_details.project.guid, notif.tipo]);
  
  function getLetterAvatar() 
  {
    let letter = "";

    switch (notif.tipo) 
    {
      case "MATCH_PROJETO":
        letter = "MP";
        break;

      case "MATCH_USUARIO":
        letter = "MU";
        break;

      case "INTERESSE_USUARIO_PROJETO":
        let user = notif.json_details?.user;
        if (user)
          letter = user.nome?.length > 0 ? user.nome[0] : user.username[0];
        else
          letter = "U";
        break;

      case "INTERESSE_PROJETO_USUARIO":
        letter = "P";
        break;

      default:
        letter = "A";
    }

    return letter;
  }

  function redirectAction()
  {
    let url = "";
    let aux = [];

    if (notif.tipo === "INTERESSE_USUARIO_PROJETO") 
    {
      url = "/profile";
      aux = [notif.json_details.user.guid, "notification"];
    } 
    else 
    {
      url = "/projeto";
      aux = [
          notif.json_details.project.id,
          notif.json_details.project.guid,
          user.guid_usuario,
      ];
    }
    
    history.push(url, {data: aux});
    setOpen(null);
  }

  async function changeInteresse(type)
  {
    if(type === "INTERESSE_USUARIO_PROJETO")
    {
      let aux = {"fl_projeto_interesse": !btnInteresse};

      await putRel(notif.json_details.user.guid, notif.json_details.project.guid, aux).then(res =>
        {
          if(res.status === 200)
          {
            setStatus(res.data.fl_projeto_interesse);
            setBtnInteresse(!btnInteresse);
          }
        }
      );
    }
    else
    {
      let aux = {"fl_usuario_interesse": !btnInteresse};
      
      await putRel(notif.json_details.user.guid, notif.json_details.project.guid, aux).then(res => 
        {
          if(res.status === 200)
          {
            setStatus(res.data.fl_usuario_interesse);
            setBtnInteresse(!btnInteresse);
          }
        }
      );
    }
  }

  return (
    <Dialog open onClose={() => setOpen(null)}>

      <Suspense fallback={<></>}>
        <DialogContent>
          <Box sx={{mb: 2, display: "flex", justifyContent: "center"}}>
            <IconButton title="Ir para o perfil">
              <Avatar sx={{width: "50px", height: "50px"}}>
                {getLetterAvatar()}
              </Avatar>
            </IconButton>
          </Box>

          <Typography> {notif.conteudo} </Typography>
        </DialogContent>

        <DialogActions>
          { (notif.tipo === "INTERESSE_USUARIO_PROJETO" ||
             notif.tipo === "INTERESSE_PROJETO_USUARIO") && 
            <Button
              variant="outlined"
              color={status ? "error" : "success"}
              size="small"
              onClick={() => changeInteresse(notif.tipo)}
            >
              { status
                ? "Remover Interesse"
                : "Adicionar Interesse"
              }
            </Button>
          }

          <Button
            variant="outlined"
            color="info"
            size="small"
            onClick={() => redirectAction()}
          >
            { notif.tipo === "INTERESSE_USUARIO_PROJETO"
              ? "Ir para o perfil"
              : "Ir para o projeto"
            }
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => {setOpen(null)}}
          >
            Sair
          </Button>
        </DialogActions>
      </Suspense>
    </Dialog>
  );
};

export default DialogNotification;