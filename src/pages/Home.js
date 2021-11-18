import React, { useState, useEffect } from "react";
import Cards from "../components/Cards";
import { Container, createTheme, Typography, Pagination } from "@mui/material";
import { makeStyles } from "@mui/styles";

import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

//--estilo--
const theme = createTheme();

const SearchBox = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",

  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchField = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#CFCFCF",
  "&:hover": {
    backgroundColor: alpha("#CFCFCF", 0.5),
  },
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    backgroundColor: "inherit",

    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const useStyles = makeStyles({
  grid: {
    marginTop: theme.spacing(2),
  },

  pagination: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
  },
});
//---------

const valores = [
  // Estado apenas para simular as informações de projetos
  {
    id: 1,
    title: "Título 1",
    description: "exemplo 1.",
    image: "https://source.unsplash.com/random",
  },
  {
    id: 2,
    title: "Título 2",
    description: "exemplo 2.",
    image: "https://source.unsplash.com/random",
  },
  {
    id: 3,
    title: "Título 3",
    description: "exemplo 3.",
    image: "https://source.unsplash.com/random",
  },
  {
    id: 4,
    title: "Título 4",
    description: "exemplo 4.",
    image: "https://source.unsplash.com/random",
  },
];

const Home = () => {
  const classes = useStyles();

  const [cardsProjetos, setCardsProjetos] = useState(false);

  useEffect(() => {
    async function getProjetos() {
      setCardsProjetos(valores);
    }

    getProjetos();
  }, []);

  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);

  const handlePage = (event, value) => {
    setPage(value);
  };

  return (
    <Container className={classes.grid} maxWidth="lg">
      <SearchBox>
        <SearchField>
          <SearchIcon />
          <StyledInput
            placeholder="Pesquisar"
            inputProps={{ "aria-label": "search" }}
          />
        </SearchField>
      </SearchBox>

      <Typography variant="h6"> Projetos </Typography>
      <Cards valores={valores} />

      <Container className={classes.pagination}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePage}
          shape="rounded"
          variant="outlined"
          color="primary"
          size="small"
          showFirstButton
          showLastButton
        />
      </Container>
    </Container>
  );
};

export default Home;
