import React, { Suspense, useState, forwardRef } from "react";
import { IconButton } from "@mui/material";
import {Dialog, Slide} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

const DialogTitle = React.lazy(() => import('@mui/material/DialogTitle'));
const DialogContent = React.lazy(() => import('@mui/material/DialogContent'));
const DialogContentText = React.lazy(() => import('@mui/material/DialogContentText'));

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function AlertDialog(props) 
{
  const [open, setOpen] = useState(false);
  const type = props.type;

  return (
    <>
      <IconButton aria-label="info" size="small" style={{borderRadius: "100%"}} onClick={() => setOpen(true)}>
        <InfoIcon fontSize="inherit" />
      </IconButton>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="dialog-desc"
      >
        <Suspense fallback={<></>}>
            <DialogTitle>{"Como pesquisar?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="dialog-desc">
                { type ?
                  <> 
                    Busque por usuários da plataforma. Caso possuir algum projeto,
                    você pode selecionar algum específico, e buscar por usuários que se encaixam em algum perfil.
                    caso encontre algum que se encaixe, pode marcá-lo como de interesse do projeto.
                  </> 
                  :
                  <> 
                    Busque por projetos da plataforma. 
                    Caso encontre algum que goste, pode marcá-lo como de seu interesse.
                  </>
                }
                
              </DialogContentText>
            </DialogContent>
        </Suspense>
      </Dialog>
    </>
  );
}

export default AlertDialog;