import {
  Stack,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  Divider,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  InputAdornment,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Phone,
  Today,
  Email,
  AdminPanelSettings,
  AccountCircle,
  MoreVert,
} from '@mui/icons-material';
import React from 'react';
import axios from 'axios';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Moment from 'react-moment';
import { useDispatch } from 'react-redux';

export default function ProfileInfo({ onAction, profile, onReload }) {
  const [show, setShow] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const details = {
    1: [
      {
        label: 'First name',
        value: profile?.firstname,
        icon: <AccountCircle />,
      },
      {
        label: 'Last name',
        value: profile?.lastname,
        icon: <AccountCircle />,
      },
      {
        label: 'Birthdate',
        value: profile?.birthdate ? (
          <Moment format='MMMM DD, YYYY'>{profile?.birthdate}</Moment>
        ) : (
          'Not set'
        ),
        icon: <Today />,
      },
    ],
    2: [
      {
        label: 'Email address',
        value: profile?.email,
        icon: <Email />,
      },
      {
        label: 'Phone number',
        value:
          '+63 ' +
          `${profile?.number?.substring(0, 3)} ` +
          `${profile?.number?.substring(3, 7)} ` +
          profile?.number?.substring(7),
        icon: <Phone />,
      },
      {
        label: 'Administrative Level',
        value: profile?.level === 1 ? 'Admin' : 'Staff',
        icon: <AdminPanelSettings />,
      },
    ],
  };

  return (
    <React.Fragment>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        p={1}>
        <Typography variant='h6'>Personal Information</Typography>
        <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
          <MoreVert />
        </IconButton>
      </Stack>
      <Divider />
      <Stack direction='row'>
        {Object.keys(details).map(key => {
          return (
            <List key={key} sx={{ flex: 1 }}>
              {details[key].map(({ icon, label, value }, i) => {
                return (
                  <ListItem key={i}>
                    <ListItemIcon>
                      <Avatar>{icon}</Avatar>
                    </ListItemIcon>
                    <ListItemText primary={value} secondary={label} />
                  </ListItem>
                );
              })}
            </List>
          );
        })}
      </Stack>

      <Box p={1}>
        {profile?.isDisabled === 1 ? (
          <Typography variant='caption' color='error'>
            Your account has been disabled by{' '}
            {profile?.reason?.actionBy?.firstname}{' '}
            {profile?.reason?.actionBy?.lastname} with the reason of "
            {profile?.reason?.reason}". Your access to the admin website is now
            limited, please settle the issue with the admin to bring back your
            privileges.
          </Typography>
        ) : null}
      </Box>

      <Menu
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorEl={anchorEl}>
        <MenuItem
          onClick={() => {
            setShow('personal');
            setAnchorEl(null);
          }}>
          Update Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            setShow('password');
            setAnchorEl(null);
          }}>
          Change password
        </MenuItem>
      </Menu>

      <Dialog
        open={show === 'personal' || show === 'password'}
        onClose={() => setShow('')}
        fullWidth
        maxWidth='sm'>
        {show === 'personal' ? (
          <UpdatePersonal
            current={profile}
            onAction={onAction}
            onReload={onReload}
            onClose={() => setShow('')}
          />
        ) : show === 'password' ? (
          <UpdatePassword
            onAction={onAction}
            onReload={onReload}
            onClose={() => setShow('')}
          />
        ) : null}
      </Dialog>
    </React.Fragment>
  );
}

function UpdatePersonal({ current, onAction, onReload, onClose }) {
  const dispatch = useDispatch();
  const [errors, setErrors] = React.useState([]);
  const [edit, setEdit] = React.useState({
    firstname: '',
    lastname: '',
    birthdate: '',
    email: '',
    number: '',
  });

  const handleSubmit = () => {
    axios
      .patch(`${process.env.REACT_APP_URL}profile/update-personal-info`, edit, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setEdit({
          firstname: current?.firstname,
          lastname: current?.lastname,
          email: current?.email,
          number: current?.number,
          birthdate: current?.birthdate
            ? new Date(current?.birthdate)
            : Date.now(),
        });
        dispatch({ type: 'UPDATEUSER', payload: data.user });
        onClose();
        onAction(data.message);
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  React.useEffect(() => {
    setEdit({
      firstname: current?.firstname,
      lastname: current?.lastname,
      email: current?.email,
      number: current?.number,
      birthdate: current?.birthdate ? new Date(current?.birthdate) : Date.now(),
    });
  }, [current]);

  return (
    <React.Fragment>
      <DialogTitle>Update Personal Information</DialogTitle>
      <DialogContent dividers>
        <Box py={1}>
          <Box my={1}>
            <TextField
              fullWidth
              type='text'
              label='First name'
              value={edit.firstname}
              onInput={e => setEdit({ ...edit, firstname: e.target.value })}
              error={errors?.some(obj => obj.param === 'firstname')}
              helperText={errors?.find(obj => obj.param === 'firstname')?.msg}
            />
          </Box>
          <Box my={1}>
            <TextField
              fullWidth
              type='text'
              label='Last name'
              value={edit.lastname}
              onInput={e => setEdit({ ...edit, lastname: e.target.value })}
              error={errors?.some(obj => obj.param === 'lastname')}
              helperText={errors?.find(obj => obj.param === 'lastname')?.msg}
            />
          </Box>
          <Box my={1}>
            <TextField
              fullWidth
              type='email'
              label='Email address'
              value={edit.email}
              onInput={e => setEdit({ ...edit, email: e.target.value })}
              error={errors?.some(obj => obj.param === 'email')}
              helperText={errors?.find(obj => obj.param === 'email')?.msg}
            />
          </Box>
          <Box my={1}>
            <TextField
              fullWidth
              type='number'
              label='Phone number'
              value={edit.number}
              onInput={e => setEdit({ ...edit, number: e.target.value })}
              error={errors?.some(obj => obj.param === 'number')}
              helperText={errors?.find(obj => obj.param === 'number')?.msg}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <IconButton size='small' disabled>
                      +63
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box my={1}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label='Birthdate'
                inputFormat='MM/dd/yyyy'
                value={edit.birthdate}
                onChange={date => setEdit({ ...edit, birthdate: date })}
                renderInput={params => (
                  <TextField
                    {...params}
                    fullWidth
                    error={errors?.some(obj => obj.param === 'birthdate')}
                    helperText={
                      errors?.find(obj => obj.param === 'birthdate')?.msg
                    }
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' color='success'>
          Update
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}

function UpdatePassword({ onAction, onReload, onClose }) {
  const [data, setData] = React.useState({ old: '', new: '', confirm: '' });
  const [secured, setSecured] = React.useState({
    old: true,
    new: true,
    confirm: true,
  });
  const [errors, setErrors] = React.useState([]);

  const handleSubmit = () => {
    setErrors([]);
    axios
      .patch(`${process.env.REACT_APP_URL}profile/update-password`, data, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setData({ old: '', new: '', confirm: '' });
        setSecured({ old: true, new: true, confirm: true });
        onClose();
        onAction(data);
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  return (
    <React.Fragment>
      <DialogTitle>Update Password</DialogTitle>
      <DialogContent dividers>
        <Box py={1}>
          <Box my={1}>
            <TextField
              fullWidth
              type={secured.old ? 'password' : 'text'}
              label='Old password'
              value={data.old}
              onInput={e => setData({ ...data, old: e.target.value })}
              error={errors?.some(obj => obj.param === 'old')}
              helperText={errors?.find(obj => obj.param === 'old')?.msg}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() =>
                        setSecured({ ...secured, old: !secured.old })
                      }>
                      {secured.old ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box my={1}>
            <TextField
              fullWidth
              type={secured.new ? 'password' : 'text'}
              label='New password'
              value={data.new}
              onInput={e => setData({ ...data, new: e.target.value })}
              error={errors?.some(obj => obj.param === 'new')}
              helperText={errors?.find(obj => obj.param === 'new')?.msg}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() =>
                        setSecured({ ...secured, new: !secured.new })
                      }>
                      {secured.new ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box my={1}>
            <TextField
              fullWidth
              type={secured.confirm ? 'password' : 'text'}
              label='Confirm password'
              value={data.confirm}
              onInput={e => setData({ ...data, confirm: e.target.value })}
              error={errors?.some(obj => obj.param === 'confirm')}
              helperText={errors?.find(obj => obj.param === 'confirm')?.msg}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() =>
                        setSecured({ ...secured, confirm: !secured.confirm })
                      }>
                      {secured.confirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' color='success'>
          Update
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
