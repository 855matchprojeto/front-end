import React, { useState, forwardRef } from "react";
import { TextField, IconButton } from "@mui/material";
import { Button, Dialog, DialogContent } from "@mui/material";
import { List, ListItem, ListItemText, Divider, Slide } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { postPhones, deletePhones } from "../../services/api_perfil";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function MyPhones(props)
{
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState("");
  const [arrayData, setArrayData] = useState(props.data);
  const btnIcon = props.btnIcon;
  
  const DeleteButton = (props) =>
  {
    async function handleDeleteValue()
    {
      await deletePhones(props.phone).then(res => 
        {
          if(res.status === 204)
            setArrayData(arrayData.filter(el => el.guid !== props.guid));   
        }
      );
    }

    return(
      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteValue()}> 
        <DeleteIcon/> 
      </IconButton>
    )
  }

  const AddButton = () =>
  {      
    async function handleNewValue()
    {
      await postPhones({"phone": newData, "id_tipo_contato": 1}).then(res =>
        {
          if(res.status === 200)
          {
            setNewData("");
            setArrayData([res.data, ...arrayData]);
          }
        }
      );   
    }

    return(
      <IconButton edge="end" aria-label="add" onClick={() => handleNewValue()}> 
        <AddCircleIcon /> 
      </IconButton>
    )
  }

  return(
  <>
      <Button size="medium" variant="outlined" startIcon={btnIcon} onClick={() => setOpen(true)}>
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
                  value={newData}
                  label="Número"
                  onChange={(e) => setNewData(e.target.value)}
                  fullWidth
                />
              </ListItemText>
            </ListItem>

            <Divider />

            {
              arrayData.map((obj, i) => 
              <ListItem key={i} secondaryAction={<DeleteButton guid={obj.guid}/>}>
                <ListItemText>
                  <ListItemText primary={obj.phone} />
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