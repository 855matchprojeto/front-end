import {
  Container,
  Box,
  Typography,
  CardHeader,
  CardContent,
  Card,
  Grid,
  CardMedia,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import React, { useState } from "react";

const ProjetoInfo = () => {
  const [tenhoInteresse, setTenhoInteresse] = useState(false);
  const [projeto, setProjeto] = useState({
    id: 4,
    title: "Título 4",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. cumque incidunt magnam cum vero repellendus tempore quasi deserunt.",
    image: "https://source.unsplash.com/random",
    areas: [
      "Machine Learning",
      "Data Science",
      "Resistência dos Materiais",
      "Cálculo",
    ],
    cursos: [
      "Engenharia de Computação",
      "Ciência da Computação",
      "Matemática",
      "Física",
    ],
  });
  const defaultUrl =
    "https://blog.handtalk.me/wp-content/uploads/2018/11/capa-blog-2.png";
  const handleInteresse = () => {
    // Faz a requisição para adicionar para os projetos do perfil
    setTenhoInteresse(!tenhoInteresse);
  };

  return (
    <Container maxWidh="lg" sx={{ mb: 5 }}>
      <Box>
        <Card sx={{ mt: 2 }}>
          <CardMedia
            component="img"
            image={projeto.image}
            height="300"
            sx={{ margin: "auto", width: "50%" }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ color: "text.secondary" }}>
                  {projeto.title}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Descrição:</Typography>
              </Grid>
              <Grid item xs={12}>
                {projeto.description}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Cursos Envolvidos:</Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex" }}>
                  {projeto.cursos.map((curso) => (
                    <>
                      <Chip variant="outlined" label={curso} sx={{ mr: 1 }} />
                    </>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Áreas Envolvidas:</Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex" }}>
                  {projeto.areas.map((area) => (
                    <>
                      <Chip variant="outlined" label={area} sx={{ mr: 1 }} />
                    </>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="outlined"
              color={!tenhoInteresse ? "primary" : "error"}
              onClick={() => handleInteresse()}
              sx={{ mr: 3, mb: 2 }}
              size="small"
            >
              {tenhoInteresse ? "REMOVER INTERESSE" : "TENHO INTERESSE"}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default ProjetoInfo;
