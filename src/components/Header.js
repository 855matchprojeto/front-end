import React, { useRef, useState, useEffect, useContext } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  Badge,
  Dialog,
  DialogContent,
} from "@mui/material";
import { IconButton, Drawer, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { logout } from "../services/auth";
import { ColorModeContext } from "../index";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  getNotifications,
  setNotificationsAsRead,
} from "../services/api_notifications";
import DialogNotification from "./DialogNotification";
//--estilo--
const useStyles = makeStyles((theme) => ({
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

  themeBox: {
    display: "flex",
    alignItems: "center",
  },

  navLink: {
    marginLeft: theme.spacing(3),
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
    borderBottom:
      "1px solid " +
      (theme.palette.mode === "dark"
        ? theme.palette.primary.light
        : theme.palette.primary.contrastText),
  },

  "@media (max-width: 900px)": {
    paddingLeft: 0,
  },
  drawer: {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.background.paper
        : theme.palette.primary.main,
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
  const [notificationSelected, setNotificationSelected] = useState(null);
  const [notificationsRead, setNotificationsRead] = useState([]);
  const [notificationsNotRead, setNotificationsNotRead] = useState([]);
  const classes = useStyles();
  const [view, setView] = useState({ mobileView: false, drawerOpen: false });

  const markNotificationsAsRead = async () => {
    const res = await setNotificationsAsRead(
      notificationsNotRead.map((notifications) => notifications.guid)
    );
    if (res.status === 200) {
      const notificationsNotReadAux = [...notificationsNotRead];
      setNotificationsRead([...notificationsNotReadAux, ...notificationsRead]);
      setNotificationsNotRead([]);
    }
  };

  useEffect(() => {
    const fetchNotificationsNotRead = async () => {
      const res = await getNotifications(false);
      setNotificationsNotRead(res.data.reverse());
    };

    const fetchNotificationsRead = async () => {
      const res = await getNotifications(true);
      setNotificationsRead(res.data.reverse());
    };

    setInterval(fetchNotificationsNotRead, 6000000);
    fetchNotificationsNotRead();
    fetchNotificationsRead();

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
      clearInterval(fetchNotificationsNotRead);
    };
  }, []);

  const DisplayDesktop = () => {
    const notificacoesRef = useRef();
    const menuRef = useRef();
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElNotifications, setAnchorElNotifications] =
      React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = () => {
      setAnchorEl(menuRef.current);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleMenuNotificacoes = (open) => {
      if (open) setAnchorElNotifications(notificacoesRef.current);
      else setAnchorElNotifications(null);
    };
    return (
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.brand} variant="h6">
          {" "}
          Match de Projetos{" "}
        </Typography>

        <nav className={classes.nav}>
          <div className={classes.themeBox}>
            <IconButton
              title={
                theme.palette.mode === "light" ? "Tema escuro" : "Tema claro"
              }
              variant="outlined"
              onClick={colorMode.toggleColorMode}
              sx={{
                padding: "3px",
                border: "1px solid #f4f4f4",
                borderRadius: "8px",
              }}
            >
              {theme.palette.mode === "light" ? (
                <DarkModeOutlinedIcon
                  fontSize="small"
                  sx={{
                    color: "#ffffff",
                  }}
                />
              ) : (
                <LightModeOutlinedIcon
                  fontSize="small"
                  sx={{
                    color: "#f4f4f4",
                  }}
                />
              )}
            </IconButton>
          </div>
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
          <IconButton
            onClick={() => {
              markNotificationsAsRead();
              handleMenuNotificacoes(true);
            }}
            sx={{
              ml: 3,
              transform: "translateY(5%)",
            }}
          >
            <Badge
              badgeContent={notificationsNotRead && notificationsNotRead.length}
              color="error"
            >
              <NotificationsIcon
                ref={notificacoesRef}
                sx={{ color: "#ffffff" }}
              />
            </Badge>
          </IconButton>
          <IconButton
            onClick={handleClick}
            sx={{
              ml: 4,
            }}
          >
            <Avatar ref={menuRef}>C</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                mt: 1.5,
                border: "1px solid #e1e1e1",
                borderTop: "0px",
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
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              component={RouterLink}
              to="/perfil"
              sx={{
                px: 3,
              }}
            >
              <Avatar /> Perfil
            </MenuItem>
            <Divider />
            <MenuItem
              component="button"
              onClick={logout}
              sx={{ width: "100%", px: 3 }}
            >
              <LogoutIcon sx={{ mr: 1.3 }} /> Sair
            </MenuItem>
          </Menu>
          {/* // Notificacoes */}
          <Menu
            anchorEl={anchorElNotifications}
            id="account-menu-notifications"
            open={Boolean(anchorElNotifications)}
            onClose={() => handleMenuNotificacoes(false)}
            onClick={() => handleMenuNotificacoes(false)}
            PaperProps={{
              elevation: 0,
              sx: {
                maxHeight: "300px",
                maxWidth: "650px",
                overflowY: "auto",
                border: "1px solid #e1e1e1",
                borderTop: "0px",
                mt: 1.5,
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
                  right: 10,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ width: "100%", p: 1, pl: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "700",
                }}
              >
                Notificações
              </Typography>
            </Box>
            <Divider />
            {[...notificationsNotRead, ...notificationsRead].map(
              (notification) => (
                <MenuItem
                  key={notification.guid_usuario}
                  component="button"
                  sx={{ width: "100%", p: 2 }}
                  onClick={() => setNotificationSelected(notification)}
                >
                  <Avatar>C</Avatar>
                  <Typography
                    sx={{
                      ml: 1,
                      whiteSpace: "normal",
                      textAlign: "justify",
                    }}
                  >
                    {notification.conteudo}
                  </Typography>
                </MenuItem>
              )
            )}
          </Menu>
        </nav>
      </Toolbar>
    );
  };

  const DisplayMobile = () => {
    const notificacoesRef = useRef();
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const [anchorElNotifications, setAnchorElNotifications] =
      React.useState(null);

    const handleDrawerOpen = () => {
      setView((previous) => ({ ...previous, drawerOpen: true }));
    };
    const handleDrawerClose = () => {
      setView((previous) => ({ ...previous, drawerOpen: false }));
    };

    const handleMenuNotificacoes = (open) => {
      if (open) setAnchorElNotifications(notificacoesRef.current);
      else setAnchorElNotifications(null);
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
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              component={RouterLink}
              to="/perfil"
              sx={{
                mt: 2,
              }}
            >
              <Avatar
                sx={{
                  width: "50px",
                  height: "50px",
                }}
              >
                C
              </Avatar>
            </IconButton>
          </Box>

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            title={
              theme.palette.mode === "light" ? "Tema escuro" : "Tema claro"
            }
            variant="outlined"
            onClick={colorMode.toggleColorMode}
            sx={{
              border: "1px solid #ffffff",
              borderRadius: "8px",
              padding: "5px !important",
            }}
          >
            {theme.palette.mode === "light" ? (
              <DarkModeOutlinedIcon
                fontSize="small"
                sx={{
                  color: "#ffffff",
                }}
              />
            ) : (
              <LightModeOutlinedIcon
                fontSize="small"
                sx={{
                  color: "#f4f4f4",
                }}
              />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              handleMenuNotificacoes(true);
              markNotificationsAsRead();
            }}
            sx={{
              mr: 2,
              ml: 3,
              transform: "translateY(5%)",
            }}
          >
            <Badge
              badgeContent={notificationsNotRead && notificationsNotRead.length}
              color="error"
            >
              <NotificationsIcon
                ref={notificacoesRef}
                sx={{ color: "#ffffff" }}
              />
            </Badge>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorElNotifications}
          id="account-menu-notifications"
          open={Boolean(anchorElNotifications)}
          onClose={() => handleMenuNotificacoes(false)}
          onClick={() => handleMenuNotificacoes(false)}
          PaperProps={{
            elevation: 0,
            sx: {
              maxHeight: "300px",
              overflowY: "auto",
              mt: 1.5,
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
                right: 10,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ width: "100%", p: 1, pl: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "700",
              }}
            >
              Notificações
            </Typography>
          </Box>
          <Divider />
          {[...notificationsNotRead, ...notificationsRead].map(
            (notification) => (
              <MenuItem
                key={notification.guid_usuario}
                component="button"
                sx={{ width: "100%", p: 2 }}
                onClick={() => setNotificationSelected(notification)}
              >
                <Avatar>C</Avatar>
                <Typography
                  sx={{
                    ml: 1,
                    whiteSpace: "normal",
                    textAlign: "justify",
                  }}
                >
                  {notification.conteudo}
                </Typography>
              </MenuItem>
            )
          )}
        </Menu>
      </Toolbar>
    );
  };

  return (
    <>
      {notificationSelected && (
        <DialogNotification
          notification={notificationSelected}
          setOpen={setNotificationSelected}
        />
      )}
      <AppBar position="static">
        {view.mobileView ? <DisplayMobile /> : <DisplayDesktop />}
      </AppBar>
    </>
  );
};

export default Header;
