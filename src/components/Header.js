import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  IconButton,
  Drawer,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    height: "5vh",
  },

  brand: {
    flexGrow: 1,
    marginLeft: theme.spacing(3),
  },
  nav: {
    flexGrow: 3,
    display: "flex",
  },

  navLink: {
    margin: theme.spacing(1, 5),
    padding: theme.spacing(1),
    textDecoration: "none",
    color: "inherit",
    fontSize: "1rem",
    borderLeft: "1px solid "+theme.palette.primary.main,

    "&:hover":{
      borderLeft: "1px solid white",
      transition: "transform .4s ease-in-out",
      transform: "rotate(360deg)",
    }
  },
  "@media (max-width: 900px)": {
    paddingLeft: 0,
  },
  drawer: {
    backgroundColor: theme.palette.primary.main,
    width: "40%",
    display: "flex",
    flexDirection: "column",
  },
  navLinkMobile: {
    margin: 8,
    textDecoration: "none",
    color: "white",
    fontSize: "1rem",
    padding: theme.spacing(1),
    fontWeight: "bold",
    borderLeft: "1px solid "+theme.palette.primary.main,

    "&:hover":{
      borderLeft: "1px solid white",
    }
  },
}));

const Header = () => {
  const classes = useStyles();
  const [view, setView] = useState({ mobileView: false, drawerOpen: false });

  useEffect(() => {
    const setResponsiveView = () => {
      if (window.innerWidth < 900) {
        setView((previous) => ({ ...previous, mobileView: true }));
      } else {
        setView((previous) => ({ ...previous, mobileView: false }));
      }
    };

    setResponsiveView();
    window.addEventListener("resize", () => setResponsiveView());

    return () => {
      window.removeEventListener("resize", () => setResponsiveView());
    };
  }, []);

  const DisplayDesktop = () => {
    return (
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.brand} variant="h5">
          Match de Projetos
        </Typography>
        <nav className={classes.nav}>
          <Link to="/home" className={classes.navLink}>
            Home
          </Link>
          <Link to="/projetos" className={classes.navLink}>
            Projetos
          </Link>
          <Link to="/interesses" className={classes.navLink}>
            Interesses
          </Link>
          <Link to="/perfil" className={classes.navLink}>
            Perfil
          </Link>
          <Link to="/" className={classes.navLink}>
            Sair
          </Link>
        </nav>
      </Toolbar>
    );
  };

  const DisplayMobile = () => {
    const handleDrawerOpen = () => {
      setView((previous) => ({ ...previous, drawerOpen: true }));
    };
    const handleDrawerClose = () => {
      setView((previous) => ({ ...previous, drawerOpen: false }));
    };
    return (
      <Toolbar>
        <IconButton
          {...{ color: "inherit", edge: "start", onClick: handleDrawerOpen }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          {...{
            anchor: "left",
            open: view.drawerOpen,
            onClose: handleDrawerClose,
            classes: {
              paper: classes.drawer,
            },
          }}
        >
          <Link to="/home" className={classes.navLinkMobile}>
            Home
          </Link>
          <Link to="/projetos" className={classes.navLinkMobile}>
            Projetos
          </Link>
          <Link to="/interesses" className={classes.navLinkMobile}>
            Interesses
          </Link>
          <Link to="/perfil" className={classes.navLinkMobile}>
            Perfil
          </Link>
          <Link to="/" className={classes.navLinkMobile}>
            Sair
          </Link>
        </Drawer>
        <Typography className={classes.brand} variant="h5">
          Match de Projetos
        </Typography>
      </Toolbar>
    );
  };

  return (
    <header>
      <AppBar position="static">
        {view.mobileView ? <DisplayMobile /> : <DisplayDesktop />}
      </AppBar>
    </header>
  );
};

export default Header;
