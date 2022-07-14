import React, { useRef, useState } from "react";
import { useEffect, useContext } from "react";
import { NavLink as RouterLink, useHistory } from "react-router-dom";

import { AppBar, Toolbar, Typography } from "@mui/material";
import { useTheme, Menu, MenuItem } from "@mui/material";
import { Avatar, Box, Divider, Badge } from "@mui/material";
import { IconButton, Drawer, Link, useMediaQuery } from "@mui/material";

import { makeStyles } from "@mui/styles";
import { logout } from "../services/auth";
import { ColorModeContext } from "../index";

import MenuIcon from "@mui/icons-material/Menu";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { doGetDataUser } from "../services/api_perfil";
import { setNotificationsAsRead } from "../services/api_notifications";
import { getNotifications } from "../services/api_notifications";

import DialogNotification from "./dialogs/DialogNotification";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { getPrefMode } from "../services/util";

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
  const [ntfSelected, setNtfSelected] = useState(null);
  const [notifsNotRead, setNotifsNotRead] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [user, setUser] = useState(null);
  const [view, setView] = useState({ mobileView: false, drawerOpen: false });
  const classes = useStyles();
  const history = useHistory();
  const matches = useMediaQuery("(max-width: 900px)");

  const markNotificationsAsRead = async () => {
    if (notifsNotRead.length <= 0) return;

    let aux = notifsNotRead.map((ntf) => ntf.id);

    await setNotificationsAsRead(aux).then((res) => {
      if (res.status === 200) setNotifsNotRead([]);
    });
  };

  async function getUser() {
    await doGetDataUser().then((res) => {
      if (res.status === 200) setUser(res.data);
    });
  }

  function getLetterAvatar(ntf) {
    let letter = "";
    //console.log(ntf.tipo);
    switch (ntf.tipo) {
      case "MATCH_PROJETO":
        letter = "MP";
        break;

      case "MATCH_USUARIO":
        letter = "MU";
        break;

      case "INTERESSE_USUARIO_PROJETO":
        let user = ntf.json_details?.user;
        if (user) letter = user.username.length > 0 ? user.username[0] : "U";
        else letter = "U";
        break;

      case "INTERESSE_PROJETO_USUARIO":
        letter = "P";
        break;

      default:
        letter = "A";
    }

    return letter.toUpperCase();
  }

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1)
      hash = string.charCodeAt(i) + ((hash << 5) - hash);

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(ntf) {
    let string =
      ntf.tipo === "INTERESSE_USUARIO_PROJETO"
        ? ntf.json_details.user
        : ntf.tipo;

    return {
      sx: {
        bgcolor: stringToColor(string),
        color: "#ffffff",
      },
    };
  }

  useEffect(() => {
    getUser();

    async function fetchNotificationsNotRead() {
      await getNotifications(false).then((res) => {
        if (res.status === 200) {
          const noti = res.data.reverse();
          setNotifsNotRead(noti);
          setNotifs((current) => [...noti, ...current]);
        }
      });
    }

    async function fetchNotificationsRead() {
      await getNotifications(true).then((res) => {
        if (res.status === 200)
          setNotifs((current) => [...current, ...res.data.reverse()]);
      });
    }

    setInterval(fetchNotificationsNotRead, 60000);
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

  const HeaderTitle = () => {
    return (
      <Typography
        className={classes.brand}
        variant="h6"
        onClick={() => history.push("/")}
      >
        {" "}
        Match de Projetos{" "}
      </Typography>
    );
  };

  const IconBox = (props) => {
    const event = props.Event;
    const anchorElNotif = props.anchor;
    const notificacoesRef = props.refPass;

    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          title={theme.palette.mode === "light" ? "Tema escuro" : "Tema claro"}
          onClick={colorMode.toggleColorMode}
          sx={{ mr: 1, ml: 1, transform: "translateY(5%)" }}
        >
          {theme.palette.mode === "light" ? (
            <DarkModeOutlinedIcon fontSize="small" sx={{ color: "#ffffff" }} />
          ) : (
            <LightModeOutlinedIcon fontSize="small" sx={{ color: "#ffffff" }} />
          )}
        </IconButton>

        <IconButton
          onClick={(e) => {
            event(e);
          }}
          sx={{ mr: 1, ml: 1, transform: "translateY(5%)" }}
        >
          <Badge
            badgeContent={anchorElNotif ? 0 : notifsNotRead.length}
            color="error"
          >
            <NotificationsIcon
              ref={notificacoesRef}
              sx={{ color: "#ffffff" }}
            />
          </Badge>
        </IconButton>
      </Box>
    );
  };

  const NotifDrawer = (props) => {
    const anchorElNotif = props.anchorElNotif;
    const handleMenuNotif = props.handleMenuNotif;

    const notifPaper = {
      height: "80vh",
      mt: 1.5,
      border: "1px solid #e1e1e1",
      borderTop: "0px",
      maxWidth: "650px",
      overflowX: "initial",
      overflowY: "initial",

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

      "& .MuiList-root": {
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
      },
    };

    return (
      <Menu
        anchorEl={anchorElNotif}
        id="account-menu-notif"
        open={Boolean(anchorElNotif)}
        onClose={() => handleMenuNotif(false)}
        onClick={() => handleMenuNotif(false)}
        PaperProps={{ elevation: 0, sx: notifPaper }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ width: "100%", p: 1, pl: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "700" }}>
            Notificações
          </Typography>
        </Box>

        <Divider />

        <OverlayScrollbarsComponent
          className={
            getPrefMode() === "dark" ? "os-theme-light" : "os-theme-dark"
          }
          resize="b"
          options={{
            scrollbars: { autoHide: matches ? "scroll" : "never" },
            overflowBehavior: { x: "s", y: "s" },
          }}
        >
          {notifs.map((notif, i) => (
            <MenuItem
              key={i}
              component="button"
              sx={{ width: "100%", p: 1.5 }}
              onClick={() => setNtfSelected(notif)}
            >
              <Avatar {...stringAvatar(notif)}>{getLetterAvatar(notif)}</Avatar>

              <Typography
                sx={{ ml: 1, whiteSpace: "normal", textAlign: "justify" }}
              >
                {notif.conteudo}
              </Typography>
            </MenuItem>
          ))}
        </OverlayScrollbarsComponent>
      </Menu>
    );
  };

  const menuList = [
    {
      link: "/home",
      txt: "Home",
    },
    {
      link: "/projetos",
      txt: "Projetos",
    },
  ];

  const DisplayDesktop = () => {
    const notificacoesRef = useRef();
    const menuRef = useRef();
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElNotif, setAnchorElNotif] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = () => {
      setAnchorEl(menuRef.current);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleClickNotif = (e) => {
      setAnchorElNotif(e.currentTarget);
    };
    const handdleCloseNotif = () => {
      setAnchorElNotif(null);
      markNotificationsAsRead();
    };

    return (
      <Toolbar className={classes.toolbar}>
        <HeaderTitle />

        <nav className={classes.nav}>
          <IconBox
            Event={handleClickNotif}
            anchor={anchorElNotif}
            refPass={notificacoesRef}
          />

          <NotifDrawer
            anchorElNotif={anchorElNotif}
            handleMenuNotif={handdleCloseNotif}
          />

          {menuList.map((v, i) => (
            <Link
              key={i}
              component={RouterLink}
              to={v.link}
              className={classes.navLink}
              activeClassName={classes.activeNav}
            >
              {v.txt}
            </Link>
          ))}

          <IconButton onClick={handleClick} sx={{ ml: 4 }}>
            <Avatar ref={menuRef}>
              {user && user.nome_exibicao && user.nome_exibicao.length >= 1
                ? user.nome_exibicao[0].toUpperCase()
                : "U"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={() => handleClose}
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
        </nav>
      </Toolbar>
    );
  };

  const DisplayMobile = () => {
    const notificacoesRef = useRef();
    const [anchorElNotif, setAnchorElNotif] = useState(null);

    const handleDrawerOpen = () => {
      setView((previous) => ({ ...previous, drawerOpen: true }));
    };
    const handleDrawerClose = () => {
      setView((previous) => ({ ...previous, drawerOpen: false }));
    };

    const handleMenuNotif = (open) => {
      if (open) {
        setAnchorElNotif(notificacoesRef.current);
      } else {
        setAnchorElNotif(null);
        markNotificationsAsRead();
      }
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
                {user && user.nome_exibicao && user.nome_exibicao.length >= 1
                  ? user.nome_exibicao[0].toUpperCase()
                  : "U"}
              </Avatar>
            </IconButton>
          </Box>

          {menuList.map((v, i) => (
            <Link
              key={i}
              component={RouterLink}
              to={v.link}
              className={classes.navLinkMobile}
              activeClassName={classes.activeMobile}
            >
              {v.txt}
            </Link>
          ))}

          <Link
            role="button"
            onClick={() => logout()}
            className={classes.navLinkMobile}
          >
            {" "}
            Sair{" "}
          </Link>
        </Drawer>

        <HeaderTitle />

        <IconBox
          Event={handleMenuNotif}
          anchor={anchorElNotif}
          refPass={notificacoesRef}
        />

        <NotifDrawer
          anchorElNotif={anchorElNotif}
          handleMenuNotif={handleMenuNotif}
        />
      </Toolbar>
    );
  };

  return (
    <>
      {ntfSelected && (
        <DialogNotification
          notif={ntfSelected}
          setOpen={setNtfSelected}
          user={user}
        />
      )}

      <AppBar position="static">
        {view.mobileView ? <DisplayMobile /> : <DisplayDesktop />}
      </AppBar>
    </>
  );
};

export default Header;
