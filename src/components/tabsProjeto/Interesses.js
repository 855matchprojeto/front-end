import React, { useRef, useState, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getUserProjRel } from "../../services/api_projetos";
import { doGetDataUser } from "../../services/api_perfil";
import LoadingBox from "../LoadingBox";
import CardGroup from "../customCards/CardGroup";

const useStyles = makeStyles((theme) => ({
  font: {
    margin: 16,
    marginBottom: 8,
    fontSize: "1.3rem",
  },
}));

function Interesses()
{
  const mountedRef = useRef(true);
  const classes = useStyles();
  const [marcados, setMarcados] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);
  const [guid, setGuid] = useState("");

  useEffect(() => {

    async function getData() 
    { 
      setComponentLoading(true);
      
      await getUserProjRel(true, null, null).then(res =>
        {
          if (!mountedRef.current)
            return
          if(res.status === 200)
            setMarcados(res.data);
        }
      );

      await doGetDataUser().then(res =>
        {
          if (!mountedRef.current)
            return
          if(res.status === 200)
            setGuid(res.data.guid_usuario);
          setComponentLoading(false);
        }
      )
    }

    getData();
  }, []);

  // cleanup
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, [])

  const boxSx = {mt: 4, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"};
  
  return (
    <>
      { !componentLoading && marcados.length > 0 &&
        <Grid container spacing={0.5} sx={{ py: 1.5, pl: 1 }}>
          <CardGroup valores={marcados} cardsType="projetos" guidRef={guid}/>
        </Grid>
      }

      { !componentLoading && marcados.length === 0 &&
        <Box sx={boxSx}>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={classes.font}
          >
            Você ainda não tem nenhum projeto com interesse.
          </Typography>
        </Box>
      }

      { componentLoading && 
        <div style={{margin: "auto"}}>
          <LoadingBox/>
        </div>
      }
    </>
  );
};

export default Interesses;
