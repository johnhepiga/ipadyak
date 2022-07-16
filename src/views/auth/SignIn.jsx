import React from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormHelperText,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import Logo from '../../files/logo.png';

export default function SignIn() {
  const [data, setData] = React.useState({ account: '', password: '' });
  const [secured, setSecured] = React.useState(true);
  const [errors, setErrors] = React.useState([]);
  const dispatch = useDispatch();

  const handleSignIn = e => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_URL}auth/signin`, data, {
        withCredentials: true,
      })
      .then(({ data }) => {
        dispatch({ type: 'SIGNIN', payload: data });
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  return (
    <Box
      display='flex'
      alignItems='center'
      py={1}
      overflow='hidden auto'
      flex={1}>
      <Container maxWidth='xs'>
        <form onSubmit={handleSignIn}>
          <Box
            sx={{
              height: 300,
              width: '100%',
              aspectRatio: '1/1',
              background: `url(${Logo}) center no-repeat`,
              backgroundSize: 'contain',
            }}
          />
          <FormHelperText
            error={errors?.removed ? true : false}
            sx={{ textAlign: 'center' }}>
            {errors?.removed}
          </FormHelperText>
          <Box my={1}>
            <TextField
              type='text'
              fullWidth
              label='Email address or phone number'
              autoComplete='off'
              error={
                Array.isArray(errors) &&
                errors?.find(obj => obj.param === 'account')
                  ? true
                  : false
              }
              helperText={
                Array.isArray(errors) &&
                errors?.find(obj => obj.param === 'account')?.msg
              }
              value={data.account}
              onInput={e => setData({ ...data, account: e.target.value })}
            />
          </Box>
          <Box my={1}>
            <TextField
              type={secured ? 'password' : 'text'}
              fullWidth
              label='Password'
              error={
                Array.isArray(errors) &&
                errors?.find(obj => obj.param === 'password')
                  ? true
                  : false
              }
              helperText={
                Array.isArray(errors) &&
                errors?.find(obj => obj.param === 'password')?.msg
              }
              value={data.password}
              onInput={e => setData({ ...data, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setSecured(!secured)}>
                      {secured ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Forgot />
          <Button
            type='submit'
            variant='contained'
            color='success'
            fullWidth
            onClick={handleSignIn}>
            Sign In
          </Button>
        </form>
      </Container>
    </Box>
  );
}

function Forgot({ onAction }) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState('');
  const [errors, setErrors] = React.useState([]);

  const handleSubmit = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}auth/forgot-password`,
        { email: data },
        { withCredentials: true }
      )
      .then(({ data }) => {
        onAction(data);
        setOpen(false);
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  return (
    <React.Fragment>
      <Link
        href='#'
        onClick={e => {
          e.preventDefault();
          setOpen(true);
        }}
        sx={{ textAlign: 'center', display: 'block', my: 1.5 }}>
        Forgot password?
      </Link>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth='xs'>
        <DialogTitle sx={{ textAlign: 'center' }}>Forgot password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', mb: 2 }}>
            Enter your email address
          </DialogContentText>
          <Box my={1}>
            <TextField
              value={data}
              onInput={e => setData(e.target.value)}
              fullWidth
              autoComplete='off'
              placeholder='Enter email address'
              error={
                Array.isArray(errors) &&
                errors?.some(obj => obj.param === 'email')
              }
              helperText={
                Array.isArray(errors) &&
                errors?.find(obj => obj.param === 'email')?.msg
              }
            />
          </Box>
          <Button
            onClick={handleSubmit}
            fullWidth
            variant='contained'
            color='primary'>
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
