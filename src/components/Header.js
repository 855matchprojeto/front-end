import React from "react";
import { AppBar, Toolbar, Typography, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },

  brand: {
    flexGrow: 1,
  },
  nav: {
    flexGrow: 3,
    display: "flex",
  },

  navLink: {
    margin: theme.spacing(1, 5),
    textDecoration: "none",
    color: "white",
    fontSize: "1rem",
  },

  //   nav: {
  //     backgroundColor: "red",
  //     display: "flex",
  //     justifyContent: "space-between",
  //   },

  //   navLink: {
  //     display: "inline-block",
  //   },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <header>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.brand} variant="h5">
            Match de Projetos
          </Typography>
          <nav className={classes.nav}>
            <Link to="/" className={classes.navLink}>
              Home
            </Link>
            <Link to="/" className={classes.navLink}>
              Projetos
            </Link>
            <Link to="/" className={classes.navLink}>
              Interesses
            </Link>
          </nav>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
