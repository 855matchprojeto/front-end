import React, { useState, useEffect, useContext } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, useTheme } from "@mui/material";
import { IconButton, Drawer, Link, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { logout } from "../services/auth";
import { ColorModeContext } from "../index";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

//--estilo--
const useStyles = makeStyles(theme => ({
  toolbar: {
    display: "flex",
    height: "64px",
    width: "100%",
    paddingLeft: "5%",
    paddingRight: "5%",
  },

  brand: {
    flexGrow: 1,
    "&:hover": {
      cursor: "pointer",
      textDecoration: "none",
    },
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
    transition: "all 0.5s",

    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.15)",
      cursor: "pointer",
    },
  },
  activeNav: {
    borderBottom: "1px solid " + (theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.contrastText),
  },

  "@media (max-width: 900px)": {
    paddingLeft: 0,
  },
  drawer: {
    backgroundColor: (theme.palette.mode === "dark" ? theme.palette.background.paper : theme.palette.primary.main),
    width: "40%",
    maxWidth: "200px",
    display: "flex",
    flexDirection: "column",
  },
  navLinkMobile: {
    margin: 8,
    padding: theme.spacing(1),
    textDecoration: "none",
    color: theme.palette.common.white,
    fontSize: "1rem",
    fontWeight: "bold",
    borderLeft: "1px solid rgba(0,0,0,0)",

    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.15)",
      cursor: "pointer",
    },
  },
  activeMobile: {
    borderLeft: "1px solid" + theme.palette.common.white,
  },
  btnMenu: {
    "&:hover": {
      transition: "transform .4s ease-in-out",
      transform: "rotate(360deg)",
    },
  },
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
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    return (
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.brand} variant="h6">
          {" "}
          Match de Projetos{" "}
        </Typography>

        <nav className={classes.nav}>
          <IconButton 
            title={theme.palette.mode === 'light' ? 'Tema escuro' : 'Tema claro'} variant="outlined" 
            onClick={colorMode.toggleColorMode}
            sx={{
              border: '1px solid #ffffff',
              borderRadius: '8px',
              padding: '5px !important',
              marginLeft: -5
            }}
          >
              {theme.palette.mode === 'light' ? (
              <DarkModeOutlinedIcon 
                fontSize="small"
                sx={{
                  color: '#ffffff'
                }} 
                />
              )  : (
              <LightModeOutlinedIcon
                fontSize="small"
                sx={{
                  color: '#f4f4f4'
                }}
              />)}
          </IconButton>
          <Link
            component={RouterLink}
            to="/home"
            className={classes.navLink}
            activeClassName={classes.activeNav}
          >
            {" "}
            Home{" "}
          </Link>
          <Link
            component={RouterLink}
            to="/projetos"
            className={classes.navLink}
            activeClassName={classes.activeNav}
          >
            Projetos
          </Link>
          <Link
            component={RouterLink}
            to="/perfil"
            className={classes.navLink}
            activeClassName={classes.activeNav}
          >
            {" "}
            Perfil{" "}
          </Link>
          <Link
            role="Button"
            onClick={() => logout()}
            className={classes.navLink}
          >
            {" "}
            Sair{" "}
          </Link>
        </nav>
      </Toolbar>
    );
  };

  const DisplayMobile = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    
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
          <MenuIcon className={classes.btnMenu} />
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
          <Link
            component={RouterLink}
            to="/home"
            className={classes.navLinkMobile}
            activeClassName={classes.activeMobile}
          >
            {" "}
            Home{" "}
          </Link>
          <Link
            component={RouterLink}
            to="/projetos"
            className={classes.navLinkMobile}
            activeClassName={classes.activeMobile}
          >
            Projetos
          </Link>
          <Link
            component={RouterLink}
            to="/perfil"
            className={classes.navLinkMobile}
            activeClassName={classes.activeMobile}
          >
            {" "}
            Perfil{" "}
          </Link>
          <Link
            role="button"
            onClick={() => logout()}
            className={classes.navLinkMobile}
          >
            {" "}
            Sair{" "}
          </Link>
        </Drawer>

        <Typography className={classes.brand} variant="h6">
          {" "}
          Match de Projetos{" "}
        </Typography>
        <IconButton 
          
          title={theme.palette.mode === 'light' ? 'Tema escuro' : 'Tema claro'} variant="outlined" 
          onClick={colorMode.toggleColorMode}
          sx={{
            border: '1px solid #ffffff',
            borderRadius: '8px',
            padding: '5px !important',
          }}
        >
          {theme.palette.mode === 'light' ? (
            <DarkModeOutlinedIcon 
              fontSize="small"
              sx={{
                color: '#ffffff'
              }} 
              />
            )  : (
            <LightModeOutlinedIcon
              fontSize="small"
              sx={{
                color: '#f4f4f4'
              }}
            />)}
        </IconButton>
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
