import React, { useState, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getUserProjRel } from "../../services/api_projetos";
import { doGetDataUser } from "../../services/api_perfil";
import LoadingBox from "../LoadingBox";
import CardGroup from "../CardGroup";

const useStyles = makeStyles((theme) => ({
  font: {
    margin: 16,
    marginBottom: 8,
    fontSize: "1.3rem",
  },
}));

const Interesses = () => {
  const classes = useStyles();
  const [marcados, setMarcados] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);
  const [guid, setGuid] = React.useState("");

  useEffect(() => {
    async function doGetUserProjRel() 
    {
      setComponentLoading(true);
      let aux = await getUserProjRel(true, null, null);
      setMarcados(aux.data);
    }

    async function getUserGuid() 
    { 
      let res = await doGetDataUser();
      setGuid(res.data.guid_usuario);
      setComponentLoading(false);
    }

    doGetUserProjRel();
    getUserGuid();
  }, []);

  return (
    <>
      {!componentLoading && (
        <>
          {marcados.length > 0 ? (
            <Grid container spacing={0.5} sx={{ py: 1.5, pl: 1 }}>
              <CardGroup
                valores={marcados}
                cardsType="projetos"
                userGuid={guid}
              />
            </Grid>
          ) : (
            <Box
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                color="textSecondary"
                className={classes.font}
              >
                Você ainda não tem nenhum projeto com interesse.
              </Typography>
            </Box>
          )}
        </>
      )}

      { componentLoading && 
        <div style={{margin: "auto"}}>
          <LoadingBox/>
        </div>
      }
    </>
  );
};

export default Interesses;
