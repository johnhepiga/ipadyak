import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Stack,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
} from '@mui/material';
import axios from 'axios';
import UserIcon from '../../files/profile.png';
import FileIcon from '../../files/file.png';
import ProfileAppbar from '../components/ProfileAppBar';
import ProfileInfo from './subroutes/ProfileInfo';
import Posts from './subroutes/Posts';
import { useSelector, useDispatch } from 'react-redux';

export default function Profile({ onAction, onFullscreen }) {
  const [profile, setProfile] = React.useState({});
  const [current, setCurrent] = React.useState('Profile');

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_URL}profile/get-user-profile`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setProfile(data);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box flex={1} p={1} flexBasis={0} minHeight={0} overflow='hidden auto'>
      <Grid container spacing={1} height='100%'>
        <Grid item md={3} xs={12} zeroMinWidth height='100%'>
          <Stack p={1} component={Paper} height='100%'>
            <Box flex={1} flexBasis={0} minHeight={0} overflow='hidden auto'>
              <Box
                sx={{
                  position: 'relative',
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
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    '&:hover button': {
                      opacity: 1,
                    },
                  }}>
                  <UploadProfile onAction={onAction} onReload={fetchData} />
                </Box>
                <img
                  src={
                    profile?.profile
                      ? process.env.REACT_APP_UPLOAD_URL +
                        profile?.profile?.value
                      : UserIcon
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
                {profile?.firstname} {profile?.lastname}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item md={9} xs={12} height='100%'>
          <Stack component={Paper} height='100%'>
            {console.log(profile?.level)}
            {profile?.level === 1 ? (
              <ProfileAppbar onChange={e => setCurrent(e)} />
            ) : null}
            <View
              current={current}
              profile={profile}
              onAction={onAction}
              posts={profile}
              onReload={fetchData}
              onFullscreen={onFullscreen}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

function View({ current, profile, onReload, onAction, onFullscreen }) {
  switch (current) {
    case 'Profile':
      return (
        <ProfileInfo
          profile={profile}
          onReload={onReload}
          onAction={onAction}
        />
      );
    case 'Posts':
      return (
        <Posts
          onReload={onReload}
          onAction={onAction}
          profile={profile}
          onFullscreen={onFullscreen}
        />
      );
    default:
      return <></>;
  }
}

function UploadProfile({ onAction, onReload }) {
  const log = useSelector(state => state.LOG);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  const handleSubmit = () => {
    setErrors({});
    const formData = new FormData();
    formData.append('profile', image);
    axios
      .patch(
        `${process.env.REACT_APP_URL}profile/update-profile-image`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setImage(null);
        const temp = log.user[0];
        temp.profile = data.user;
        dispatch({ type: 'UPDATEUSER', payload: temp });
        setOpen(false);
        onAction(data.message);
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  const handleSelect = e => {
    if (!e.target.files[0]) return;
    setImage(e.target.files[0]);
  };

  return (
    <React.Fragment>
      <Button
        variant='contained'
        color='primary'
        sx={{ opacity: 0, transition: '200ms linear' }}
        onClick={() => setOpen(true)}>
        Update Profile
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>Update Profile Image</DialogTitle>
        <DialogContent dividers>
          <Box
            height={300}
            width={300}
            border='solid 1px'
            borderRadius='50%'
            p={0.5}
            mx='auto'
            overflow='hidden'
            mb={1}>
            <img
              src={
                image
                  ? image?.type?.split('/')[0] === 'image'
                    ? URL.createObjectURL(image)
                    : FileIcon
                  : UserIcon
              }
              alt='Profile'
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '50%',
              }}
            />
          </Box>
          <TextField
            type='file'
            onInput={handleSelect}
            fullWidth
            error={errors?.hasOwnProperty('file')}
            helperText={errors?.file}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>cancel</Button>
          <Button onClick={handleSubmit} variant='contained' color='success'>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
