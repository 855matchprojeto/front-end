import React, { useState, forwardRef } from "react";
import { TextField, IconButton } from "@mui/material";
import { Button, Dialog, DialogContent } from "@mui/material";
import { List, ListItem, ListItemText, Divider, Slide } from "@mui/material";
import InputMask from 'react-input-mask';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { enqueueMySnackBar } from "../../services/util";
import { useSnackbar } from "notistack";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function MySelectDialog(props)
{
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState("");
  const [arrayData, setArrayData] = useState(props.data);
  const btnIcon = props.btnIcon;

  const deleteEvent = props.deleteEvent;
  const addEvent = props.addEvent;
  const addPayload = props.addPayload;
  const fieldType = props.fieldType;

  const formatNumber = (number) => {
    if (number.length === 10) {
      return `(${number.slice(0,2)}) ${number.slice(2,6)}-${number.slice(6,10)}`
    }
    if (number.length === 11) {
      return `(${number.slice(0,2)}) ${number.slice(2,7)}-${number.slice(7,11)}`
    }

    return number;
  }

  const DeleteButton = (props) =>
  {
    const messageOK = fieldType === 'tel' ?  "Número removido com sucesso!" : 'Email removido com sucesso!';
    const messageError = fieldType === 'tel' ?  "Erro ao remover o número" : "Erro ao remover o email";
    console.log(messageOK);

    async function handleDeleteValue()
    {
      await deleteEvent(props.guid).then(res => 
        {
          if(res.status === 204) {
            setArrayData(arrayData.filter(el => el.guid !== props.guid));
            enqueueMySnackBar(enqueueSnackbar, messageOK, "success"); 
          } else {
            enqueueMySnackBar(enqueueSnackbar, messageError, "error")
          }
             
        }
      );
    }

    return(
      <IconButton title="Remover" edge="end" aria-label="delete" onClick={() => handleDeleteValue()}> 
        <DeleteIcon/> 
      </IconButton>
    )
  }

  const AddButton = () =>
  {
    const messageOK = fieldType === 'tel' ?  "Número adicionado com sucesso!" : 'Email adicionado com sucesso!';
    const messageError = fieldType === 'tel' ?  "Erro ao adicionar o número" : "Erro ao adicionar o email";
    async function handleNewValue()
    {
      await addEvent(addPayload(newData)).then(res =>
        {
          if(res.status === 200)
          {
            setNewData("");
            setArrayData([res.data, ...arrayData]);
            enqueueMySnackBar(enqueueSnackbar, messageOK, "success");
          } else {
            enqueueMySnackBar(enqueueSnackbar, messageError, "error")
          }
        }
      );   
    }

    return(
      <IconButton 
        title="Adicionar" 
        edge="end" 
        aria-label="add" 
        onClick={() => {
          if (fieldType === 'tel' && newData.trim().length !== 10 && newData.trim().length !== 11)
            return;
          handleNewValue();
        }}
      > 
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
        maxWidth="md"
        TransitionComponent={Transition}
        onClose={() => setOpen(false)}
      >
        <DialogContent style={{display:"flex", justifyContent:"center", padding:"10px 12px"}}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}} aria-label="phones">

            <ListItem secondaryAction={<AddButton/>}>                  
              <ListItemText>
                {fieldType === 'tel' ? (
                  <InputMask 
                    mask={newData.length <= 10 ? '(99) 9999-9999?' : '(99) 99999-9999'}
                    formatChars={{ 9: '[0-9]', '?': '[0-9 ]' }}
                    value={newData}
                    maskChar="" 
                    onChange={(e) => {
                      const phone =  e.target.value.replace(/[^0-9]+/g, '');
                      setNewData(phone);
                    }}
                  >
                    {inputProps => (
                      <TextField
                        {...inputProps}
                        type={fieldType}
                        name={props.fieldName}
                        size="small"
                        label={props.fieldLabel}             
                        fullWidth
                      />
                    )}
                    
                  </InputMask>
                ) : (
                  <TextField
                  type={fieldType}
                  name={props.fieldName}
                  size="small"
                  value={newData}
                  onChange={(e) => setNewData(e.target.value)}
                  label={props.fieldLabel}             
                  fullWidth
                />
                )}
              </ListItemText>
            </ListItem>

            <Divider />

            {
              arrayData.map((obj, i) => 
              <ListItem key={i} secondaryAction={<DeleteButton guid={obj.guid}/>}>
                <ListItemText>
                  <ListItemText primary={fieldType === 'tel' ? formatNumber(obj[props.dataValue]) : obj[props.dataValue]} />
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