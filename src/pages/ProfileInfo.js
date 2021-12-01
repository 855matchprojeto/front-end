import React,{ useState, useEffect } from "react";
import {Container, Box, Typography, CardContent, Card } from "@mui/material";
import {Grid, CardMedia } from "@mui/material";
import { useLocation } from "react-router";
import LoadingBox from "../components/LoadingBox";
import { getProfilesGUID } from "../services/api_perfil";

const ProfileInfo = () => {
  const [profInfo, getProfileInfo] = useState(false);

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
        <Container maxWidth="md" sx={{mb: 5}}>
          { profInfo &&
                        <Box sx={{color: "text.secondary"}}>

                        <Card sx={{ mt: 2 }}>
          
                          <Box sx={{width: "100%", bgcolor: "#dedede"}}>
                            <CardMedia component="img" image={profInfo.image} height="300" sx={{ margin: "auto", width: "100%", backgroundSize: "cover" }}/>
                          </Box>
          
                          <CardContent>
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
          
                            </Grid>
                          </CardContent>
          
                        </Card>
          
                        </Box>
          }
        </Container>
      }

      { pageLoading && <LoadingBox/>}
    </>
  );

};

export default ProfileInfo;