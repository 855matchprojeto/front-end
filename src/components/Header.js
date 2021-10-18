import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import { AppBar, Toolbar, Typography, IconButton, Drawer, Link, createTheme} from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";

import { logout } from "../services/auth";

//--estilo--
const theme = createTheme();

const useStyles = makeStyles( ({
  toolbar: {
    display: "flex",
    height: "64px",
    width: "100%",
    paddingLeft: "5%",
    paddingRight: "5%",
  },

  brand: {
    flexGrow: 1,
  },
  nav: {
    flexGrow: 3,
    display: "flex",
    justifyContent: "flex-end",
  },

  navLink: {
    marginLeft: theme.spacing(5),
    padding: theme.spacing(1),
    textDecoration: "none",
    color: "inherit",
    fontSize: "1rem",
    borderLeft: "1px solid "+theme.palette.primary.main,
    transition: "all 0.5s",

    "&::before":{
      content: '"»"',
      top: "14px",
      transition: "0.1s",
      opacity: 0
    },
    "&::after":{
      content: '"«"',
      top: "14px",
      transition: "0.1s",
      opacity: 0
    },

    "&:hover":{
      "&::before":{
        content: '"»"',
        color: theme.palette.primary.contrastText,
        top: "14px",
        transition: "0.5s",
        opacity: 1
      },
      "&::after":{
        content: '"«"',
        color: theme.palette.primary.contrastText,
        top: "14px",
        transition: "0.5s",
        opacity: 1
      },
      cursor: 'pointer'
    },
    
    
  },
  "@media (max-width: 900px)": {
    paddingLeft: 0,
  },
  drawer: {
    backgroundColor: theme.palette.primary.main,
    width: "40%",
    maxWidth: "200px",
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
    
    "&::before":{
      content: '"»"',
      top: "14px",
      transition: "0.1s",
      opacity: 0
    },
    "&::after":{
      content: '"«"',
      top: "14px",
      transition: "0.1s",
      opacity: 0
    },

    "&:hover":{
      "&::before":{
        content: '"»"',
        color: theme.palette.primary.contrastText,
        top: "14px",
        transition: "0.5s",
        opacity: 1
      },
      "&::after":{
        content: '"«"',
        color: theme.palette.primary.contrastText,
        top: "14px",
        transition: "0.5s",
        opacity: 1
      }
    },

  },
  btnMenu:{
    "&:hover":{
      transition: "transform .4s ease-in-out",
      transform: "rotate(360deg)",
    }
  }
}));
//---------

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
        <Typography className={classes.brand} variant="h6"> Match de Projetos </Typography>

        <nav className={classes.nav}>
          <Link component={RouterLink} to="/home" className={classes.navLink}> Home </Link>
          <Link component={RouterLink} to="/projetos" className={classes.navLink}> Projetos </Link>
          <Link component={RouterLink} to="/interesses" className={classes.navLink}> Interesses </Link>
          <Link component={RouterLink} to="/perfil" className={classes.navLink}> Perfil </Link>
          <Link role='Button' onClick={() => logout()} className={classes.navLink}> Sair </Link>
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

        <IconButton {...{ color: "inherit", edge: "start", onClick: handleDrawerOpen }}>
          <MenuIcon className={classes.btnMenu}/>
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
          <Link component={RouterLink} to="/home" className={classes.navLinkMobile}> Home </Link>
          <Link component={RouterLink} to="/projetos" className={classes.navLinkMobile}> Projetos </Link>
          <Link component={RouterLink} to="/interesses" className={classes.navLinkMobile}> Interesses </Link>
          <Link component={RouterLink} to="/perfil" className={classes.navLinkMobile}> Perfil </Link>
          <Link role='button' onClick={() => logout()} className={classes.navLinkMobile}> Sair </Link>
        </Drawer>

        <Typography className={classes.brand} variant="h6"> Match de Projetos </Typography>
      </Toolbar>
    );
  };

  return (
      <AppBar position="static">
        {view.mobileView ? <DisplayMobile /> : <DisplayDesktop />}
      </AppBar>
  );
};

export default Header;
