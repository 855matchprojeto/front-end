import React,{ useState, useEffect } from "react";
import { createTheme,Container, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation } from "react-router";

//--estilo--
const theme = createTheme();

const useStyles = makeStyles( ({
  grid: {
    marginTop: theme.spacing(1),
  },
}));

const ProjetoInfo = () => {
  
 const [projectInfo, getProjectInfo] = useState(false);

 const location =  useLocation();
 const id = location.state?.data;
  
  useEffect(() => 
  {
      async function getInfos() 
      {
        // fazer uma chamada de api com o pid (project id) e setar os dados

        // const info = chamada(id)
        // getProjectInfo(info);
        
        getProjectInfo(true);
      }
      
      getInfos();

  })

    return(
        <Container className={useStyles.grid} maxWidth="lg">
            {
                projectInfo && <Typography> {id} </Typography>
            }
        </Container>
    )
}

export default ProjetoInfo;