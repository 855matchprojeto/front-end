import React, { useRef, useState, useEffect, forwardRef } from "react";
import { TextField, IconButton } from "@mui/material";
import { Button, Dialog, DialogContent } from "@mui/material";
import { List, ListItem, ListItemText, Divider, Slide } from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { doGetDataUser, postPhones, deletePhones } from "../../services/api_perfil";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function MyPhones()
{
  const mountedRef = useRef(true);
  const [open, setOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [phones, setPhones] = useState([]);

  useEffect(() => 
  {
      async function doGetPhones()  
      {
        await doGetDataUser().then(res =>
          {
            if (!mountedRef.current)
              return
            if(res.status === 200)
              setPhones(res.data.phones);
          }
        );
      }
      
      doGetPhones();
  }, [])

  // cleanup
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, [])
  
  const DeleteButton = (props) =>
  {
    async function handleDeletePhone()
    {
      let res = await deletePhones(props.phone);
      if(res.status === 204)
      {
        res = await doGetDataUser();
        if (res.status === 200)
          setPhones(res.data.phones);    
      }
    }

    return(
      <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePhone()}> 
        <DeleteIcon/> 
      </IconButton>
    )
  }

  const AddButton = () =>
  {      
    async function handleNewPhone()
    {
      let res = await postPhones({"phone": newPhone, "id_tipo_contato": 1});
      
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

      <Dialog 
        open={open} 
        TransitionComponent={Transition}
        onClose={() => setOpen(false)}
      >
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

export default MyPhones;