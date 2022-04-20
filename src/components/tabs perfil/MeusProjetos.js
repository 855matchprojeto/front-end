import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getMeusProjetos } from "../../services/api_projetos";
import LoadingBox from "../LoadingBox";
import Cards from "../Cards";

const useStyles = makeStyles((theme) => ({
  font: {
    p: 4, 
    fontSize: "1.5em"
  }
}));

const MeusProjetos = () => {
  const classes = useStyles();
  const [meusProjetos, setMeusProjetos] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);

  useEffect(() => {
    async function doGetMeusProjetos() 
    {
      setComponentLoading(true);

      const res = await getMeusProjetos();
      if (res.status === 200) 
        setMeusProjetos(res.data);

      setComponentLoading(false);
    }

    doGetMeusProjetos();
  }, []);

  return (
    <>
      {!componentLoading && (
        <Grid spacing={0.5}>
          {meusProjetos.length > 0 ? 
          ( <Cards valores={meusProjetos} cardsType="meusprojetos" />) : 
          ( <Typography variant="subtitle1" color="textSecondary" className={classes.font}>
              Você ainda não criou nenhum projeto.
            </Typography>
          )}
        </Grid>
      )}

      {componentLoading && <LoadingBox />}
    </>
  );
};

export default MeusProjetos;
