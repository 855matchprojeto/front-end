import React from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { DialogActions } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const DialogNotification = ({ notification, setOpen, user }) => {
  const history = useHistory();
  function getLetterAvatar() {
    let letter = "";
    switch (notification.tipo) {
      case "MATCH_PROJETO":
        letter = "MP";
        break;
      case "MATCH_USUARIO":
        letter = "MU";
        break;
      case "INTERESSE_USUARIO_PROJETO":
        let user = notification.json_details?.user;
        if (user) {
          letter = user.nome?.length > 0 ? user.nome[0] : user.username[0];
        } else {
          letter = "U";
        }
        break;
      case "INTERESSE_PROJETO_USUARIO":
        letter = "P";
        break;
      default:
        letter = "A";
    }

    return letter;
  }
  return (
    <Dialog open onClose={() => setOpen(null)}>
      <DialogContent>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <IconButton title="Ir para o perfil">
            <Avatar
              sx={{
                width: "50px",
                height: "50px",
              }}
            >
              {getLetterAvatar()}
            </Avatar>
          </IconButton>
        </Box>
        <Typography>{notification.conteudo}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="info"
          size="small"
          onClick={() => {
            if (notification.tipo === "INTERESSE_USUARIO_PROJETO") {
              history.push("/profile", {
                data: [notification.json_details.user.guid, "notification"],
              });
            } else {
              history.push("/projeto", {
                data: [
                  notification.json_details.project.id,
                  notification.json_details.project.guid,
                  user.guid_usuario,
                ],
              });
            }
            setOpen(null);
          }}
        >
          {notification.tipo === "INTERESSE_USUARIO_PROJETO"
            ? "Ir para o perfil"
            : "Ir para o projeto"}
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => {
            setOpen(null);
          }}
        >
          Sair
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogNotification;
