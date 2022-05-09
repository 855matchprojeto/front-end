import React, { useRef, useState, useEffect } from "react";
import { TextField, IconButton } from "@mui/material";
import { Button, Dialog, DialogContent } from "@mui/material";
import { List, ListItem, ListItemText, Divider } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { doGetDataUser, postEmail, deleteEmail } from "../../services/api_perfil";

function MyEmails()
{
  const mountedRef = useRef(true);
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emails, setEmails] = useState([]);

  useEffect(() => 
  {
      async function doGetEmails()  
      {
        await doGetDataUser().then(res =>
          {
            if (!mountedRef.current)
              return
            if(res.status === 200)
              setEmails(res.data.emails);
          }
        );
        
      }
      
      doGetEmails();
  }, [])

  // cleanup
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, [])
  
  const DeleteButton = (props) =>
  {
    async function handleDeleteEmail()
    {
      let res = await deleteEmail(props.email);
      if(res.status === 204)
      {
        res = await doGetDataUser();
        if (res.status === 200)
          setEmails(res.data.emails);    
      }
    }

    return(
      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEmail()}> 
        <DeleteIcon/> 
      </IconButton>
    )
  }

  const AddButton = () =>
  {      
    async function handleNewEmail()
    {
      let res = await postEmail({"email": newEmail});
      
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

export default MyEmails;