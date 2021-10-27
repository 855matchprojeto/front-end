import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Stack,
  Chip,
} from "@mui/material";

const Projetos = () => {
  const [fields, setFields] = useState({
    titulo: "",
    descricao: "",
  });

  const [responsaveis, setResponsaveis] = useState([
    { name: "Lebron James", perfil: "Professor" },
  ]);

  const cursos = [
    { label: "Administração" },
    { label: "Matemática" },
    { label: "Engenharia de Computação" },
    { label: "Medicina" },
    { label: "Enfermagem" },
    { label: "Ciencia da Computação" },
    { label: "Física" },
    { label: "Engenharia Elétrica" },
  ];

  const areas = [
    { label: "Cálculo" },
    { label: "Mecânica" },
    { label: "Machine Learning" },
    { label: "Web Development" },
    { label: "Resistência dos Materiais" },
    { label: "Álgebra Linear" },
    { label: "Física Quântica" },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeFields = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleCreateProject = (e) => {
    // Faz as requisições para adicionar o projeto, e desativa o botao enquanto faz a requisição
    setIsLoading(true);

    console.log(fields);

    setIsLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mb: 2 }}>
      <Box sx={{ width: "80%", mx: "auto" }}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sx={{ mb: 1 }}>
            <Typography variant="h5" color="textSecondary">
              Criar novo projeto
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ mb: 1 }}>
            <TextField
              type="input"
              name="titulo"
              value={fields.titulo}
              fullWidth
              label="Título do projeto"
              onChange={handleChangeFields}
            />
          </Grid>
          <Grid item xs={12} sx={{ mb: 1 }}>
            <Stack spacing={3} sx={{ width: "100%" }}>
              <Autocomplete
                multiple
                options={cursos.map((curso) => curso.label)}
                defaultValue={[cursos[0].label]}
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cursos Envolvidos"
                    placeholder="Cursos"
                    fullWidth
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sx={{ mb: 1 }}>
            <Stack spacing={3} sx={{ width: "100%" }}>
              <Autocomplete
                multiple
                options={areas.map((area) => area.label)}
                defaultValue={[areas[0].label]}
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Áreas Envolvidas"
                    placeholder="Áreas"
                    fullWidth
                  />
                )}
              />
            </Stack>
          </Grid>
          {/* 
        <Grid item xs={12} sx={{ mb: 1 }}>
          <Typography variant="subtitle2">
            Responsáveis pela disciplina
          </Typography>
        </Grid> */}

          {/* <Grid item xs={12}></Grid> */}
          <Grid item xs={12}>
            <TextField
              type="input"
              name="descricao"
              multiline
              rows={6}
              value={fields.descricao}
              fullWidth
              label="Descrição do projeto"
              onChange={handleChangeFields}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleCreateProject}
              disabled={isLoading}
            >
              Criar projeto
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Projetos;
