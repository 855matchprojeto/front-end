import React,{ useState, useEffect } from "react";
import {Box, Typography, CardContent, Card } from "@mui/material";
import {Grid, Chip, CardMedia } from "@mui/material";
import { useLocation } from "react-router";
import LoadingBox from "../components/LoadingBox";
import { makeStyles } from "@mui/styles";
import { getProfilesGUID } from "../services/api_perfil";
import PersonIcon from '@mui/icons-material/Person';

const useStyles = makeStyles((theme) => ({
  grid: {
    maxWidth: "1400px",
    border: "1px solid black",
    alignSelf: "center"
  },

  card: {
    width: "100%",
    display:"flex", 
    flexDirection: "column", 
    alignItems: "center",
    boxShadow: "none",
  },

  cardContent: {
    display: "flex", 
    flexDirection: "column", 
    width: "100%"
  },

  media: {
    width: "150px", 
    height: "150px", 
    border: "1px solid black", 
    padding: "0"
  }
}));

const ProfileInfo = () => {
  const [profInfo, getProfileInfo] = useState([]);
  const classes = useStyles();

  // pagina carregando, esconde conteudo
  const [pageLoading, setPageLoading] = useState(true);

  const location =  useLocation();
  //const uid = location.state?.data[0];
  const guid = location.state?.data[1];

   useEffect(() => 
   {
       async function getInfos() 
       {
        setPageLoading(true);
        const info = await getProfilesGUID(guid);
        getProfileInfo(info);
        setPageLoading(false);
       }
       
       getInfos();

   }, [guid])

  return (
    <>
      { !pageLoading &&
        <Grid container className={classes.grid}>
          { profInfo &&
            <Card className={classes.card}>

              <CardMedia
                  alt="Not Found"
                  component={(profInfo.imagem_perfil !== null) ? "img" : PersonIcon}
                  image={(profInfo.imagem_perfil !== null) ? profInfo.imagem_perfil.url : ""} 
                  className={classes.media}
              />
        
              <CardContent className={classes.cardContent}>
                <Grid container spacing={2} sx={{p: 3}}>
                
                  <Grid item xs={12}>
                    <Typography variant="h5" sx={{ color: "text.secondary" }}>
                      {profInfo.nome_exibicao}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sx={{mt: 2}}>
                    <Typography variant="subtitle1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                      Bio:
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body" align="justify" sx={{ color: "text.secondary" }}>
                      {profInfo.bio}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
                      Cursos:
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex" }}>
                      { 
                        profInfo.cursos.map((crs, index) => (
                          <Chip variant="outlined" key={index} label={crs.nome_exibicao} sx={{ mr: 1 }} />                            
                      ))}
                      </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
                      Interesses:
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex" }}>
                      { 
                        profInfo.interesses.map((its, index) => (
                          <Chip variant="outlined" key={index} label={its.nome_exibicao} sx={{ mr: 1 }} />
                      ))}
                      </Box>
                  </Grid>

                </Grid>
              </CardContent>

            </Card>
          }
        </Grid>
      }

      { pageLoading && <LoadingBox/>}
    </>
  );

};

export default ProfileInfo;