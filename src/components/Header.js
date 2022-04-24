import React, { useState, useEffect, useRef } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Badge,
  Button,
} from "@mui/material";
import { IconButton, Drawer, Link, createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { logout } from "../services/auth";
import Logout from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import { getToken } from "../services/auth";

//--estilo--
const theme = createTheme();

const useStyles = makeStyles({
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
    alignItems: "center",
  },

  navLink: {
    marginLeft: theme.spacing(5),
    padding: theme.spacing(1),
    textDecoration: "none",
    color: "inherit",
    fontSize: "1rem",
    borderLeft: "1px solid " + theme.palette.primary.main,
    transition: "all 0.5s",

    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.15)",
      cursor: "pointer",
    },
  },
  activeNav: {
    borderBottom: "1px solid white",
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
    padding: theme.spacing(1),
    textDecoration: "none",
    color: "white",
    fontSize: "1rem",
    fontWeight: "bold",
    borderLeft: "1px solid " + theme.palette.primary.main,

    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.15)",
      cursor: "pointer",
    },
  },
  activeMobile: {
    borderLeft: "1px solid white",
  },
  btnMenu: {
    "&:hover": {
      transition: "transform .4s ease-in-out",
      transform: "rotate(360deg)",
    },
  },
});
//---------

const Header = () => {
  const classes = useStyles();
  const [view, setView] = useState({ mobileView: false, drawerOpen: false });
  const [notifications, setNotifications] = useState([]);

  const getNotifications = async () => {
    const res = await axios.get(
      "https://notification-match-projetos.herokuapp.com/users/user/me/get-notifications?is_read=false",
      {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      }
    );

    if (res.status === 200) {
      setNotifications(res.data);
    }
    console.log(res);
  };

  useEffect(() => {
    getNotifications();

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
    const [anchorEl, setAnchorEl] = useState(null);
    const avatarMenu = useRef();
    const handleOpen = () => {
      setAnchorEl(avatarMenu.current);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <Toolbar className={classes.toolbar}>
        <Link
          component={RouterLink}
          className={classes.brand}
          to="/"
          sx={{ color: "inherit" }}
        >
          <Typography variant="h6">Match de Projetos</Typography>
        </Link>
        <nav className={classes.nav}>
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
            ref={avatarMenu}
            component={Button}
            onClick={() => handleOpen()}
            sx={{
              ml: 5,
            }}
          >
            <Badge
              color="error"
              badgeContent={notifications.length}
              sx={{ cursor: "pointer" }}
            >
              <Avatar />
            </Badge>
          </Link>
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => handleClose()}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                overflow: "visible",
                py: 0.7,
                px: 1,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 20,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem component={RouterLink} to="/perfil" sx={{ mb: 1 }}>
              <Avatar /> Perfil
            </MenuItem>
            <MenuItem component={RouterLink} to="/perfil" sx={{ mb: 1 }}>
              <ListItemIcon>
                <Badge
                  color="error"
                  variant="dot"
                  badgeContent={notifications.length}
                >
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </ListItemIcon>
              Notificações
            </MenuItem>
            <MenuItem
              component="button"
              onClick={() => logout()}
              sx={{ width: "100%" }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Sair
            </MenuItem>
          </Menu>
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
