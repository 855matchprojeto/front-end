import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getProjetosInteresses } from "../../services/api_projetos";
import LoadingBox from "../LoadingBox";
import Cards from "../Cards";

const useStyles = makeStyles((theme) => ({
  font: {
    p: 4, 
    fontSize: "1.5em"
  }
}));

const Interesses = () => {
  const classes = useStyles();
  const [interesses, setInteresses] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);

  useEffect(() => {
    async function doGetProjInteresses() 
    {
      setComponentLoading(true);

      const res = await getProjetosInteresses();
      if (res.status === 200) 
        setInteresses(res.data);

      setComponentLoading(false);
    }

    doGetProjInteresses();
  }, []);

  return (
    <>
      {!componentLoading && (
        <Grid spacing={0.5}>
          {interesses.length > 0 ? 
          (<Cards valores={interesses} cardsType="projetos" page="perfil" />) : 
          ( <Typography variant="subtitle1" color="textSecondary" className={classes.font}>
              Você ainda não tem nenhum projeto com interesse.
            </Typography>
          )}

        </Grid>
      )}

      {componentLoading && <LoadingBox />}
    </>
  );
};

export default Interesses;
