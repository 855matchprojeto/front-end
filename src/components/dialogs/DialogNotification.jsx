import React, { Suspense } from "react";
import { Dialog } from "@mui/material";
import { useHistory } from "react-router-dom";

const Avatar = React.lazy(() => import('@mui/material/Avatar'));
const Box = React.lazy(() => import('@mui/material/Box'));
const Typography  = React.lazy(() => import('@mui/material/Typography'));
const Button = React.lazy(() => import('@mui/material/Button'));
const IconButton = React.lazy(() => import('@mui/material/IconButton'));
const DialogContent = React.lazy(() => import('@mui/material/DialogContent'));
const DialogActions = React.lazy(() => import('@material-ui/core/DialogActions'));

const DialogNotification = ({ notif, setOpen, user }) => {
  const history = useHistory();
  
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