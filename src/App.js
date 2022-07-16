import React from 'react';
import './App.css';
import {
  Box,
  createTheme,
  Stack,
  ThemeProvider,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SignIn from './views/auth/SignIn';
import Drawer from './views/navigation/Drawer';
import Dashboard from './views/routes/Dashboard';
import Profile from './views/routes/Profile';
import Products from './views/routes/Products';
import Staffs from './views/routes/Staffs';
import Users from './views/routes/Users';
import Calendar from './views/routes/Calendar';
import ViewStaff from './views/routes/subroutes/ViewStaff';
import AddProduct from './views/routes/subroutes/AddProduct';
import Trashbin from './views/routes/Trashbin';
import ViewProduct from './views/routes/subroutes/ViewProduct';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import Tags from './views/routes/Tags';
import Fullscreen from './views/components/Fullscreen';
import Orders from './views/routes/Orders';
import SocketContext from './context/socket';
import { ws } from './socket';
import Settings from './views/routes/Settings';
import Reset from './views/auth/Reset';

function App() {
  const log = useSelector(state => state.LOG);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(true);
  const preferences = useSelector(state => state.PREFERENCE);
  const [fullscreen, setFullscreen] = React.useState({
    show: false,
    image: null,
  });
  const [snackbar, setSnackbar] = React.useState({
    show: false,
    message: '',
    variant: 'success',
  });
  const [reload, setReload] = React.useState(false);

  const theme = createTheme({
    palette: {
      mode: preferences.mode,
    },
  });

  const handleReload = data => setReload(data);
  const handleSnackbarClose = () =>
    setSnackbar({ show: false, message: '', variant: 'success' });
  const handleSnackbarOpen = (message, variant) =>
    setSnackbar({ show: true, message, variant });
  const handleFullscreenOpen = image => setFullscreen({ show: true, image });
  const handleFullscreenClose = () =>
    setFullscreen({ show: false, image: null });

  React.useEffect(() => {
    (async () => {
      await axios
        .get(`${process.env.REACT_APP_URL}auth/verification`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          if (data.loggedIn) {
            dispatch({ type: 'SIGNIN', payload: data.user });
            setIsLoading(false);
            return;
          }
          dispatch({ type: 'SIGNOUT' });
          setIsLoading(false);
        });
    })();
    ws.off('create-order').on('create-order', ({ message, type }) => {
      handleSnackbarOpen(message);
      setReload(true);
    });
    ws.off('cancel-order').on('cancel-order', ({ message, type }) => {
      handleSnackbarOpen(message, 'error');
      setReload(true);
    });
  }, [dispatch, reload]);

  return isLoading ? (
    <Box sx={{ position: 'fixed', inset: 0 }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          m: 'auto',
          height: 'min-content',
          width: 'min-content',
        }}>
        <Oval color='#000' height={160} width={160} secondaryColor='#a9a9a9' />
        <Typography variant='h6' textAlign='center'>
          Loading...
        </Typography>
      </Box>
    </Box>
  ) : (
    <ThemeProvider theme={theme}>
      <SocketContext.Provider value={{ reload, handleReload }}>
        <Fullscreen fullscreen={fullscreen} onClose={handleFullscreenClose} />
        <Stack
          bgcolor='background.default'
          color='text.primary'
          sx={{ position: 'fixed', inset: 0 }}>
          <Drawer>
            <Routes>
              <Route
                path='/'
                element={
                  log.signed ? <Dashboard /> : <Navigate to='/signin' replace />
                }
              />
              <Route
                path='/signin'
                element={
                  log.signed ? (
                    <Navigate to='/' replace />
                  ) : (
                    <SignIn onAction={handleSnackbarOpen} />
                  )
                }
              />
              <Route
                path='/reset-password/:code'
                element={
                  log.signed ? (
                    <Navigate to='/' replace />
                  ) : (
                    <Reset onAction={handleSnackbarOpen} />
                  )
                }
              />
              <Route
                path='/profile'
                element={
                  log.signed ? (
                    <Profile
                      onAction={handleSnackbarOpen}
                      onFullscreen={handleFullscreenOpen}
                    />
                  ) : (
                    <Navigate to='/signin' replace />
                  )
                }
              />
              <Route
                path='/products/add-product'
                element={
                  log.signed ? (
                    <AddProduct onAction={handleSnackbarOpen} />
                  ) : (
                    <Navigate to='/signin' replace />
                  )
                }
              />
              <Route
                path='/trashbin'
                element={
                  log.signed ? (
                    <Trashbin onNotify={handleSnackbarOpen} />
                  ) : (
                    <Navigate to='/signin' replace />
                  )
                }
              />
              <Route
                path='/products'
                element={
                  log.signed ? (
                    <Products onNotify={handleSnackbarOpen} />
                  ) : (
                    <Navigate to='/signin' replace />
                  )
                }
              />
              <Route
                path='/products/view-item/:name'
                element={
                  log.signed ? (
                    <ViewProduct onAction={handleSnackbarOpen} />
                  ) : (
                    <Navigate to='/signin' replace />
                  )
                }
              />
              <Route
                path='/orders'
                element={
                  log.signed ? (
                    <Orders onAction={handleSnackbarOpen} />
                  ) : (
                    <Navigate to='/signin' replace />
                  )
                }
              />
              <Route
                path='/staffs'
                element={
                  log.signed ? (
                    <Staffs onAction={handleSnackbarOpen} />
                  ) : (
                    <Navigate to='/signin' replace />
                  )
                }
              />
              <Route
                path='/staffs/view-staff/:name'
                element={
                  log.signed ? <ViewStaff /> : <Navigate to='/signin' replace />
                }
              />
              <Route
                path='/users'
                element={
                  log.signed ? <Users /> : <Navigate to='/signin' replace />
                }
              />
              <Route
                path='/tags'
                element={
                  log.signed ? (
                    <Tags onAction={handleSnackbarOpen} />
                  ) : (
                    <Navigate to='/signin' replace />
                  )
                }
              />
              <Route
                path='/appointments'
                element={
                  log.signed ? (
                    <Calendar onAction={handleSnackbarOpen} />
                  ) : (
                    <Navigate to='/signin' replace />
                  )
                }
              />
              <Route
                path='/settings'
                element={
                  log.signed ? (
                    <Settings onAction={handleSnackbarOpen} />
                  ) : (
                    <Navigate to='/signin' replace />
                  )
                }
              />
            </Routes>
          </Drawer>

          <Snackbar
            open={snackbar.show}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert severity={snackbar.variant} onClose={handleSnackbarClose}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Stack>
      </SocketContext.Provider>
    </ThemeProvider>
  );
}

export default App;
