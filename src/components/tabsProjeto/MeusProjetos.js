import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getMeusProjetos } from "../../services/api_projetos";
import LoadingBox from "../LoadingBox";
import Cards from "../Cards";
import { ReactComponent as AddIcon } from "../../icons/add-icon.svg";
const useStyles = makeStyles((theme) => ({
  font: {
    margin: 16,
    marginBottom: 8,
    fontSize: "1.3rem",
  },
}));

const MeusProjetos = ({ setTabValue }) => {
  const classes = useStyles();
  const [meusProjetos, setMeusProjetos] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);

  useEffect(() => {
    async function doGetMeusProjetos() {
      setComponentLoading(true);

      const res = await getMeusProjetos();
      if (res.status === 200) setMeusProjetos(res.data);

      setComponentLoading(false);
    }

    doGetMeusProjetos();
  }, []);

  return (
    <>
      {!componentLoading && (
        <>
          {meusProjetos.length > 0 ? (
            <Grid container spacing={0.5} sx={{ py: 1.5, pl: 1 }}>
              <Cards valores={meusProjetos} cardsType="meusprojetos" />
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
                Você ainda não criou nenhum projeto.
              </Typography>
              <IconButton
                title="Criar Projeto"
                onClick={() => setTabValue("criarprojeto")}
              >
                <AddIcon
                  fill="rgba(0, 0, 0, 0.6)"
                  style={{
                    width: 50,
                    height: 50,
                  }}
                />
              </IconButton>
            </Box>
          )}
        </>
      )}

      {componentLoading && <LoadingBox />}
    </>
  );
};

export default MeusProjetos;
