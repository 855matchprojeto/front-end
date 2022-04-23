import React, { useState, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getProjetosInteresses } from "../../services/api_projetos";
import LoadingBox from "../LoadingBox";
import Cards from "../Cards";

const useStyles = makeStyles((theme) => ({
  font: {
    margin: 16,
    marginBottom: 8,
    fontSize: "1.3rem",
  },
}));

const Interesses = () => {
  const classes = useStyles();
  const [interesses, setInteresses] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);

  useEffect(() => {
    async function doGetProjInteresses() {
      setComponentLoading(true);

      const res = await getProjetosInteresses();
      if (res.status === 200) setInteresses(res.data);

      setComponentLoading(false);
    }

    doGetProjInteresses();
  }, []);

  return (
    <>
      {!componentLoading && (
        <>
          {interesses.length > 0 ? (
            <Grid container spacing={0.5} sx={{ py: 1.5, pl: 1 }}>
              <Cards
                valores={interesses}
                setValores={setInteresses}
                cardsType="projetos"
                page="perfil"
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
