import React, { useState } from "react";
import { CardMedia, Dialog, DialogContent } from "@mui/material";

function ImageDialog(props) 
{
  const [open, setOpen] = useState(false);
  const classRef = props.classRef;
  const urlImg = props.urlImg;
  
  const cardMediaComp = props.cardMediaComp;
  const cardMediaImg = props.cardMediaImg;

  function handleOpen()
  {
    if(urlImg !== null)
      setOpen(true);
  }

  return (
    <>
      <CardMedia
        alt="Not Found"
        component={cardMediaComp}
        image={cardMediaImg}
        className={classRef}
        onClick={() => handleOpen()}
      >
      </CardMedia>

      <Dialog
        open={open}
        PaperProps={{style:{maxWidth:"1000px", margin:"16px"}}}
        onClose={() => setOpen(false)}
      >
        <DialogContent style={{display:"flex", justifyContent:"center", padding:"15px 18px"}}>
          <img alt="" src={urlImg} style={{maxHeight:"100%", maxWidth:"100%"}}>

          </img>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImageDialog;