import React from 'react';
import {
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Avatar,
  Switch,
  Menu as MuiMenu,
  Collapse,
  MenuItem,
  Box,
  Badge,
  Alert,
  Link,
} from '@mui/material';
import {
  Menu,
  Dashboard,
  AccountCircle,
  Inventory,
  Logout,
  SettingsOutlined,
  SettingsBrightnessSharp,
  Close,
  Group,
  AccountBox,
  InventorySharp,
  DeleteOutlined,
  Settings,
  LocalOffer,
  CalendarToday,
  ReceiptLong,
  SettingsApplications,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deepOrange, grey, red } from '@mui/material/colors';
import axios from 'axios';
import SocketContext from '../../context/socket';

const drawerWidth = 240;

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = theme => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function MiniDrawer({ children }) {
  const { reload, handleReload } = React.useContext(SocketContext);
  const log = useSelector(state => state.LOG);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [reset, setReset] = React.useState(false);
  const [settings, setSettings] = React.useState(false);
  const [checked, setChecked] = React.useState(true);
  const [notifs, setNotifs] = React.useState({});

  const navigations = [
    {
      label: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
    },
    {
      label: 'Profile',
      icon: <AccountCircle />,
      path: '/profile',
    },
    {
      label: 'Inventory',
      icon: <Inventory />,
      path: null,
      ...(log.user && log?.user[0]?.isDisabled === 1 && { inaccessible: 2 }),
      group: [
        {
          label: 'Products',
          icon: <InventorySharp />,
          path: '/products',
        },
        {
          label: 'Trash bin',
          icon: <DeleteOutlined />,
          path: '/trashbin',
        },
      ],
    },
    {
      label: 'Orders',
      icon: <ReceiptLong />,
      path: '/orders',
      ...(log.user && log?.user[0]?.isDisabled === 1 && { inaccessible: 2 }),
    },
    {
      label: 'Appointments',
      icon: <CalendarToday />,
      path: '/appointments',
      ...(log.user && log?.user[0]?.isDisabled === 1 && { inaccessible: 2 }),
    },
    {
      label: 'Community',
      icon: <Group />,
      path: null,
      inaccessible: 2,
      group: [
        {
          label: 'Staffs',
          icon: <Group />,
          path: '/staffs',
          inaccessible: 2,
        },
        {
          label: 'Users',
          icon: <AccountBox />,
          path: '/users',
          inaccessible: 2,
        },
      ],
    },
    {
      label: 'Configurations',
      icon: <Settings />,
      path: null,
      inaccessible: 2,
      group: [
        {
          label: 'Tags',
          icon: <LocalOffer />,
          path: '/tags',
        },
        {
          label: 'App Settings',
          icon: <SettingsApplications />,
          path: '/settings',
        },
      ],
    },
  ];

  const websiteName = 'i-Padyak Admin Panel';

  const handleDrawerOpen = () => {
    setOpen(!open);
    setReset(true);
  };

  const handleSignout = () => {
    axios
      .delete(`${process.env.REACT_APP_URL}auth/signout`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        dispatch({ type: 'SIGNOUT' });
        setShow(false);
      });
  };

  let title = 'i-Padyak';
  switch (true) {
    case /\/$/.test(location.pathname):
      title = 'Dashboard';
      document.title = `${websiteName} - Dashboard`;
      break;
    case /\/profile$/.test(location.pathname):
      title = 'Profile';
      document.title = `${websiteName} - Profile`;
      break;
    case /\/products$/.test(location.pathname):
      title = 'Products';
      document.title = `${websiteName} - Products`;
      break;
    case /\/products\/view-item\/./.test(location.pathname):
      title = 'View Product';
      document.title = `${websiteName} - View Product`;
      break;
    case /\/products\/add-product$/.test(location.pathname):
      title = 'Add product';
      document.title = `${websiteName} - Add Product`;
      break;
    case /\/trashbin$/.test(location.pathname):
      title = 'Trashbin';
      document.title = `${websiteName} - Trashbin`;
      break;
    case /\/staffs$/.test(location.pathname):
      title = 'Staffs';
      document.title = `${websiteName} - Staffs`;
      break;
    case /\/staffs\/view-staff\/./.test(location.pathname):
      title = 'View Staff';
      document.title = `${websiteName} - View Staff`;
      break;
    case /\/users$/.test(location.pathname):
      title = 'Users';
      document.title = `${websiteName} - Users`;
      break;
    case /\/tags$/.test(location.pathname):
      title = 'Tags';
      document.title = `${websiteName} - Tags`;
      break;
    case /\/calendar$/.test(location.pathname):
      title = 'Calendar';
      document.title = `${websiteName} - Calendar`;
      break;
    case /\/blogs$/.test(location.pathname):
      title = 'Blogs';
      document.title = `${websiteName} - Blogs`;
      break;
    case /\/appointments$/.test(location.pathname):
      title = 'Appointments';
      document.title = `${websiteName} - Appointments`;
      break;
    case /\/orders$/.test(location.pathname):
      title = 'Orders';
      document.title = `${websiteName} - Orders`;
      break;
    case /\/settings$/.test(location.pathname):
      title = 'App settings';
      document.title = `${websiteName} - App settings`;
      break;
    default:
      break;
  }

  const handleDarkMode = e => {
    setChecked(!checked);
    dispatch({
      type: 'UPDATEPREFERENCE',
      key: 'mode',
      payload: e.target.checked ? 'light' : 'dark',
    });
  };

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_URL}get-notifications`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setNotifs(data);
      });
  };

  React.useEffect(() => {
    if (reload || log.signed) {
      fetchData();
      handleReload(false);
    }
  }, [log, reload, handleReload]);

  return (
    <Stack direction='row' flex={1} height={0} flexBasis={0}>
      <CssBaseline />
      {log.signed ? (
        <React.Fragment>
          <AppBar position='fixed' open={open}>
            <Toolbar>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={handleDrawerOpen}
                edge='start'
                sx={{
                  marginRight: '36px',
                }}>
                <Menu />
              </IconButton>
              <Typography variant='h6' noWrap component='div'>
                {title}
              </Typography>

              <Stack
                direction='row'
                ml='auto'
                alignItems='center'
                px={1}
                columnGap={2}>
                {notifs?.reminders > 0 ? (
                  <Alert
                    severity='error'
                    variant='filled'
                    icon={false}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate('/appointments')}>
                    <Typography variant='caption' textTransform='uppercase'>
                      {notifs?.reminders} reminders set
                    </Typography>
                  </Alert>
                ) : null}
                <IconButton color='inherit' onClick={() => setSettings(true)}>
                  <SettingsOutlined />
                </IconButton>
                <Avatar
                  src={
                    log?.user[0]?.profile?.value &&
                    process.env.REACT_APP_UPLOAD_URL +
                      log?.user[0]?.profile?.value
                  }
                  alt={log?.user[0]?.firstname + ' ' + log?.user[0]?.lastname}
                  sx={{
                    bgcolor: log?.user[0]?.profile
                      ? grey[100]
                      : deepOrange[500],
                  }}
                />
                <Stack direction='column'>
                  <Typography variant='subtitle1'>
                    {log?.user[0]?.firstname} {log?.user[0]?.lastname}
                  </Typography>
                  <Typography variant='caption'>
                    {log?.user[0]?.level === 1 ? 'Admin' : 'Staff'}
                  </Typography>
                </Stack>
              </Stack>
            </Toolbar>
          </AppBar>
          <Drawer variant='permanent' open={open}>
            <DrawerHeader>
              <List disablePadding>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant='subtitle1'>i-Padyak</Typography>
                    }
                  />
                </ListItem>
              </List>
            </DrawerHeader>
            <Divider />
            <List
              sx={{
                flex: 1,
                flexBasis: 0,
                minHeight: 0,
                overflow: 'hidden auto',
                '&::-webkit-scrollbar': {
                  width: 20,
                },
                '&::-webkit-scrollbar-thumb': {
                  border: 'solid 6px transparent',
                  bgcolor: grey[800],
                  borderRadius: 10,
                  backgroundClip: 'content-box',
                },
              }}>
              {navigations.map(
                ({ label, icon, path, group, inaccessible }, i) => {
                  return inaccessible === log?.user[0]?.level ? null : (
                    <Navigation
                      label={label}
                      icon={icon}
                      path={path}
                      navigate={navigate}
                      open={open}
                      key={i}
                      group={group}
                      reset={reset}
                      onReset={() => setReset(false)}
                      notifs={notifs}
                    />
                  );
                }
              )}
            </List>
            <Divider />
            <List>
              <Tooltip
                title={open ? '' : 'Sign Out'}
                placement='right'
                arrow
                onClick={() => setShow(true)}>
                <ListItem button>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary='Sign Out' />
                </ListItem>
              </Tooltip>
            </List>
          </Drawer>
          <MuiDrawer
            open={settings}
            onClose={() => setSettings(false)}
            anchor='right'>
            <Stack direction='column' width={270}>
              <DrawerHeader>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  width='100%'
                  pl={1}>
                  <Typography variant='subtitle1' textTransform='uppercase'>
                    Settings
                  </Typography>
                  <IconButton onClick={() => setSettings(false)}>
                    <Close />
                  </IconButton>
                </Stack>
              </DrawerHeader>
              <Divider />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SettingsBrightnessSharp />
                  </ListItemIcon>
                  <ListItemText primary='Dark mode' />
                  <Switch checked={checked} onInput={handleDarkMode} />
                </ListItem>
              </List>
            </Stack>
          </MuiDrawer>
        </React.Fragment>
      ) : null}
      <Stack
        component='main'
        flex={1}
        width={0}
        flexBasis={0}
        direction='column'>
        {log.signed ? <DrawerHeader /> : null}
        {log.user && log.user[0]?.isDisabled === 1 ? (
          <Box p={1}>
            <Alert severity='error'>
              Your account is currently disabled, access is now limited.{' '}
              <Link
                href='#'
                onClick={e => {
                  e.preventDefault();
                  navigate('/profile');
                }}>
                View reason
              </Link>
            </Alert>
          </Box>
        ) : null}
        {children}
      </Stack>

      <Dialog
        open={show}
        onClose={() => setShow(false)}
        fullWidth
        maxWidth='xs'>
        <DialogTitle>Sign out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShow(false)}>Cancel</Button>
          <Button onClick={handleSignout} variant='contained' color='error'>
            sign out
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

const Navigation = ({
  label,
  icon,
  path,
  navigate,
  group,
  open,
  reset,
  onReset,
  notifs,
}) => {
  const [show, setShow] = React.useState(false);
  const ref = React.useRef();
  const location = useLocation();

  React.useEffect(() => {
    if (reset) {
      setShow(false);
      onReset();
    }
  }, [reset, onReset]);

  return (
    <React.Fragment>
      {path === null ? (
        <React.Fragment>
          <ListItem button onClick={() => setShow(!show)} ref={ref}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
          {open ? (
            <Collapse in={show} timeout='auto' unmountOnExit>
              <List sx={{ pl: 3 }}>
                {group.map(({ label, icon, path }, i) => {
                  return (
                    <ListItem
                      button
                      key={i}
                      onClick={() => {
                        if (location.pathname !== path) {
                          navigate(path);
                          setShow(false);
                        }
                      }}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={label} />
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          ) : (
            <MuiMenu
              open={show}
              onClose={() => setShow(false)}
              anchorEl={ref.current}
              anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
              transformOrigin={{ vertical: 'center', horizontal: 'left' }}
              sx={{ ml: 1 }}>
              {group.map(({ label, icon, path }, i) => {
                return (
                  <MenuItem
                    key={i}
                    onClick={() => {
                      if (location.pathname !== path) {
                        navigate(path);
                        setShow(false);
                      }
                    }}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={label} />
                  </MenuItem>
                );
              })}
            </MuiMenu>
          )}
        </React.Fragment>
      ) : (
        <Tooltip title={open ? '' : label} arrow placement='right'>
          <ListItem
            button
            onClick={() =>
              location.pathname === path ? null : navigate(path)
            }>
            <ListItemIcon>
              {!open ? (
                path === '/orders' ? (
                  <Badge badgeContent={notifs?.orders || 0} color='error'>
                    {icon}
                  </Badge>
                ) : path === '/appointments' ? (
                  <Badge badgeContent={notifs?.appointments || 0} color='error'>
                    {icon}
                  </Badge>
                ) : (
                  icon
                )
              ) : (
                icon
              )}
            </ListItemIcon>
            <ListItemText primary={label} />
            {path === '/orders' ? (
              <Box sx={{ bgcolor: red[500], px: 0.5, borderRadius: 1 }}>
                {notifs?.orders > 0 && notifs?.orders}
              </Box>
            ) : path === '/appointments' ? (
              <Box sx={{ bgcolor: red[500], px: 0.5, borderRadius: 1 }}>
                {notifs?.appointments > 0 && notifs?.appointments}
              </Box>
            ) : null}
          </ListItem>
        </Tooltip>
      )}
    </React.Fragment>
  );
};
