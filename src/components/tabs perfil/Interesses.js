import React, { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { getProjetosInteresses } from "../../services/api_projetos";
import LoadingBox from "../LoadingBox";
import Cards from "../Cards";

const Interesses = () => {
  // puxa interesses
  const [interesses, setInteresses] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);

  useEffect(() => {
    async function doGetProjInteresses() {
      setComponentLoading(true);
      try {
        const res = await getProjetosInteresses();

        if (res.status === 200) setInteresses(res.data);
      } catch (err) {
        console.log(err);
      }
      setComponentLoading(false);
    }

    doGetProjInteresses();
  }, []);

  return (
    <>
      {!componentLoading && (
        <Grid container spacing={2}>
          {interesses.length > 0 ? (
            <Cards valores={interesses} cardsType="projetos" page="perfil" />
          ) : (
            <Grid container spacing={2}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  sx={{
                    p: 4,
                    fontSize: "1.5em",
                  }}
                >
                  Você ainda não tem nenhum projeto com interesse.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {componentLoading && <LoadingBox />}
    </>
  );
};

export default Interesses;
