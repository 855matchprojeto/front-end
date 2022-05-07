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

const DialogNotification = ({ notification, setOpen }) => {
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
              C
            </Avatar>
          </IconButton>
        </Box>
        <Typography>{notification.conteudo}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="info" size="small">
          Ir para o perfil
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => setOpen(null)}
        >
          Sair
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogNotification;
