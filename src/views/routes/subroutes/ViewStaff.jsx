import React from 'react';
import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AccountCircle,
  ArrowBack,
  Email,
  Phone,
  SupervisorAccount,
  Today,
} from '@mui/icons-material';
import Moment from 'react-moment';
import ProfileIcon from '../../../files/profile.png';

export default function ViewStaff() {
  const location = useLocation();
  const navigate = useNavigate();
  const [staff, setStaff] = React.useState({});

  const { state } = location;

  const list = {
    1: [
      {
        label: 'First name',
        value: staff?.firstname,
        icon: <AccountCircle />,
      },
      {
        label: 'Last name',
        value: staff?.lastname,
        icon: <AccountCircle />,
      },
      {
        label: 'Birthdate',
        value: staff?.birthdate ? (
          <Moment format='MMMM DD, YYYY'>{staff.birthdate}</Moment>
        ) : (
          'Not set'
        ),
        icon: <Today />,
      },
    ],
    2: [
      {
        label: 'Email address',
        value: staff?.email,
        icon: <Email />,
      },
      {
        label: 'Phone number',
        value:
          '+63 ' +
          `${staff?.number?.substring(0, 3)} ` +
          `${staff?.number?.substring(3, 7)} ` +
          `${staff?.number?.substring(7)}`,
        icon: <Phone />,
      },
      {
        label: 'Role',
        value: staff?.level === 1 ? 'Admin' : 'Staff',
        icon: <SupervisorAccount />,
      },
    ],
  };

  React.useEffect(() => {
    (async () =>
      await axios
        .get(`${process.env.REACT_APP_URL}staffs/get-staff/${state.id}`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          setStaff(data);
        }))();
  }, [state.id]);

  return (
    <Box overflow='hidden auto' p={1} flex={1} flexBasis={0} minHeight={0}>
      <Grid container spacing={1} height='100%'>
        <Grid item md={3} xs={12} height='100%'>
          <Box p={2} component={Paper} height='100%'>
            <Stack
              direction='row'
              width='fit-content'
              justifyContent='flex-start'
              alignItems='center'
              mb={2}
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/staffs', { replace: true })}>
              <ArrowBack fontSize='small' />
              <Typography variant='body1'>Return to staffs</Typography>
            </Stack>
            <Box
              sx={{
                aspectRatio: '1/1',
                margin: 'auto',
                width: '100%',
                borderRadius: '50%',
                objectFit: 'contain',
                maxWidth: 400,
                maxHeight: 400,
                background: '#ccc',
                border: 'solid 3px #000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                p: 0.1,
              }}>
              <img
                src={
                  staff?.profile
                    ? process.env.REACT_APP_UPLOAD_URL + staff?.profile?.value
                    : ProfileIcon
                }
                alt='Profile'
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Typography variant='h6' noWrap textAlign='center'>
              {staff?.firstname} {staff?.lastname}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={9} xs={12} height='100%'>
          <Box p={2} component={Paper} height='100%'>
            <Stack direction='row'>
              {Object.keys(list).map(key => {
                return (
                  <List key={key} sx={{ flex: 1 }}>
                    {list[key].map(({ label, value, icon }, i) => {
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
