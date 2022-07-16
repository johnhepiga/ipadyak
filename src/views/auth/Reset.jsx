import React from 'react';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Reset({ onAction }) {
  const navigate = useNavigate();
  const { code } = useParams();
  const [data, setData] = React.useState({
    new: '',
    confirm: '',
  });
  const [secure, setSecure] = React.useState({
    new: true,
    confirm: true,
  });
  const [errors, setErrors] = React.useState();

  const handleSubmit = () => {
    axios
      .post(`${process.env.REACT_APP_URL}auth/reset-password/${code}`, data, {
        withCredentials: true,
      })
      .then(({ data }) => {
        onAction(data);
        navigate('/', { replace: true });
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  React.useEffect(() => {
    if (!code) {
      return navigate('/', { replace: true });
    }
    (async () => {
      axios
        .get(`${process.env.REACT_APP_URL}auth/get-code/${code}`, {
          withCredentials: true,
        })
        .then(({ data }) => {})
        .catch(e => {
          return navigate('/', { replace: true });
        });
    })();
  }, [code, navigate]);

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth='xs' component={Paper}>
        <Typography variant='h4' textAlign='center' elevation={3}>
          Reset password
        </Typography>
        <Box my={3}>
          <Box py={1}>
            <TextField
              type={secure.new ? 'password' : 'text'}
              fullWidth
              value={data.new}
              onInput={e => setData({ ...data, new: e.target.value })}
              label='New password'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() =>
                        setSecure({ ...secure, new: !secure.new })
                      }>
                      {secure.new ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={
                Array.isArray(errors) &&
                errors?.some(obj => obj.param === 'new')
              }
              helperText={
                Array.isArray(errors) &&
                errors?.find(obj => obj.param === 'new')?.msg
              }
            />
          </Box>
          <Box py={1}>
            <TextField
              type={secure.confirm ? 'password' : 'text'}
              fullWidth
              value={data.confirm}
              onInput={e => setData({ ...data, confirm: e.target.value })}
              label='Confirm password'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() =>
                        setSecure({ ...secure, confirm: !secure.confirm })
                      }>
                      {secure.confirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={
                Array.isArray(errors) &&
                errors?.some(obj => obj.param === 'confirm')
              }
              helperText={
                Array.isArray(errors) &&
                errors?.find(obj => obj.param === 'confirm')?.msg
              }
            />
          </Box>
        </Box>
        <Button
          onClick={handleSubmit}
          variant='contained'
          color='primary'
          fullWidth
          sx={{ mb: 1 }}>
          change password
        </Button>
      </Container>
    </Box>
  );
}
