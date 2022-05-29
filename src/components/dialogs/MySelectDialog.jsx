import React, { useState, forwardRef } from "react";
import { TextField, IconButton } from "@mui/material";
import { Button, Dialog, DialogContent } from "@mui/material";
import { List, ListItem, ListItemText, Divider, Slide } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function MySelectDialog(props)
{
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState("");
  const [arrayData, setArrayData] = useState(props.data);
  const btnIcon = props.btnIcon;

  const deleteEvent = props.deleteEvent;
  const addEvent = props.addEvent;
  const addPayload = props.addPayload;

  const DeleteButton = (props) =>
  {

    async function handleDeleteValue()
    {
      await deleteEvent(props.guid).then(res => 
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
      await addEvent(addPayload(newData)).then(res =>
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
      <Button 
        size="medium" 
        variant="outlined" 
        startIcon={btnIcon} 
        onClick={() => setOpen(true)}
      >
        {props.btnTxt}
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
                  type={props.fieldType}
                  name={props.fieldName}
                  size="small"
                  value={newData}
                  label={props.fieldLabel}
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
                  <ListItemText primary={obj[props.dataValue]} />
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

export default MySelectDialog;