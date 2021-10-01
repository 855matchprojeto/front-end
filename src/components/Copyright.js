import { Typography, Link } from "@mui/material";

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">

      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/"> Match de Projetos </Link>
      {` ${new Date().getFullYear()}.`} 
    </Typography>
  );
}

export default Copyright;