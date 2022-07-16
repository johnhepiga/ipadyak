import { LocalizationProvider, TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
  DialogActions,
  FormLabel,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import FileIcon from '../../files/file.png';
import ImageIcon from '../../files/image.png';

const BootstrapDialogTitle = props => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}>
          <Close />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function Settings({ onAction }) {
  const [settings, setSettings] = React.useState([]);

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_URL}settings/get-settings`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setSettings(data);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box p={1} overflow='hidden auto' flex={1}>
      <Box component={Paper} p={1} height='100%'>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'>
          <Typography variant='h6'>Operating hours</Typography>
          <OperatingHours
            onAction={onAction}
            onReload={fetchData}
            settings={settings}
          />
        </Stack>
        <Divider />
        <Container maxWidth='lg'>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            py={1}>
            <Typography variant='subtitle1'>Opening hour</Typography>
            <Typography variant='body1'>
              <Moment format='hh:mm a'>
                {settings?.find(obj => obj.setting === 'opening')?.value}
              </Moment>
            </Typography>
          </Stack>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            py={1}>
            <Typography variant='subtitle1'>Closing hour</Typography>
            <Typography variant='body1'>
              <Moment format='hh:mm a'>
                {settings?.find(obj => obj.setting === 'closing')?.value}
              </Moment>
            </Typography>
          </Stack>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            py={1}>
            <Typography variant='subtitle1'>Lunch break start</Typography>
            <Typography variant='body1'>
              <Moment format='hh:mm a'>
                {settings?.find(obj => obj.setting === 'start')?.value}
              </Moment>
            </Typography>
          </Stack>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            py={1}>
            <Typography variant='subtitle1'>Lunch break end</Typography>
            <Typography variant='body1'>
              <Moment format='hh:mm a'>
                {settings?.find(obj => obj.setting === 'end')?.value}
              </Moment>
            </Typography>
          </Stack>
        </Container>
        <Divider />
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'>
          <Typography variant='h6'>User Home Page</Typography>
          <Box display='flex'>
            <CMS onAction={onAction} onReload={fetchData} settings={settings} />
          </Box>
        </Stack>
        <Divider />
        <Container maxWidth='lg'>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            py={1}>
            <Typography variant='subtitle1'>Image display</Typography>
            <img
              src={
                process.env.REACT_APP_UPLOAD_URL +
                settings?.find(obj => obj.setting === 'image')?.value
              }
              alt='Home page display'
              style={{ width: 100, height: 55, objectFit: 'contain' }}
            />
          </Stack>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            py={1}>
            <Typography variant='subtitle1'>Title</Typography>
            <Typography variant='body1'>
              {settings?.find(obj => obj.setting === 'title')?.value}
            </Typography>
          </Stack>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            py={1}>
            <Typography variant='subtitle1'>Tagline</Typography>
            <Typography variant='body1'>
              {settings?.find(obj => obj.setting === 'description')?.value}
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

function OperatingHours({ onAction, onReload, settings }) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
    opening: '',
    closing: '',
    start: '',
    end: '',
  });
  const [errors, setErrors] = React.useState([]);

  const labels = {
    opening: 'Opening hour',
    closing: 'Closing hour',
    start: 'Lunch break start',
    end: 'Lunch break end',
  };

  const handleSubmit = () => {
    setErrors([]);
    axios
      .post(
        `${process.env.REACT_APP_URL}settings/update-operating-hours`,
        data,
        { withCredentials: true }
      )
      .then(({ data }) => {
        setOpen(false);
        onAction(data);
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  React.useEffect(() => {
    setData({
      opening: settings?.find(obj => obj.setting === 'opening')?.value,
      closing: settings?.find(obj => obj.setting === 'closing')?.value,
      start: settings?.find(obj => obj.setting === 'start')?.value,
      end: settings?.find(obj => obj.setting === 'end')?.value,
    });
  }, [settings]);

  return (
    <React.Fragment>
      <Button onClick={() => setOpen(true)}>Edit</Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth='sm'>
        <BootstrapDialogTitle onClose={() => setOpen(false)}>
          Update Operating Hours
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {Object.keys(data).map(key => (
            <Box key={key} py={1}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label={labels[key]}
                  value={data[key]}
                  onChange={e => setData({ ...data, [key]: e })}
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      error={
                        Array.isArray(errors) &&
                        errors.some(obj => obj.param === key)
                      }
                      helperText={
                        Array.isArray(errors) &&
                        errors?.find(obj => obj.param === key)?.msg
                      }
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>cancel</Button>
          <Button onClick={handleSubmit} variant='contained' color='success'>
            update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function CMS({ onAction, onReload, settings }) {
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [data, setData] = React.useState({
    title: '',
    description: '',
  });
  const [errors, setErrors] = React.useState([]);

  const handleImage = e => {
    if (!e.target.files[0]) return;
    setImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    setErrors([]);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', data.title);
    formData.append('description', data.description);
    axios
      .post(`${process.env.REACT_APP_URL}settings/cms`, formData, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setOpen(false);
        onAction(data);
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  React.useEffect(() => {
    setData({
      title: settings?.find(obj => obj.setting === 'title')?.value,
      description: settings?.find(obj => obj.setting === 'description')?.value,
    });
  }, [settings]);

  return (
    <React.Fragment>
      <Button onClick={() => setOpen(true)}>edit</Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth='sm'>
        <BootstrapDialogTitle onClose={() => setOpen(false)}>
          Content Management
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <img
            src={
              image
                ? image?.type?.split('/')[0] === 'image'
                  ? URL.createObjectURL(image)
                  : FileIcon
                : ImageIcon
            }
            alt='Home page display'
            style={{ width: '100%', height: 300, objectFit: 'contain' }}
          />
          <FormLabel>Select an image</FormLabel>
          <TextField
            type='file'
            fullWidth
            onInput={handleImage}
            error={errors?.file ? true : false}
            helperText={errors.file}
          />
          <Box my={1}>
            <TextField
              type='text'
              label='Title'
              fullWidth
              value={data.title}
              onInput={e => setData({ ...data, title: e.target.value })}
              error={
                Array.isArray(errors) &&
                errors.some(obj => obj.param === 'title')
              }
              helperText={
                Array.isArray(errors) &&
                errors.find(obj => obj.param === 'title')?.msg
              }
            />
          </Box>
          <Box my={1}>
            <TextField
              type='text'
              label='tagline'
              fullWidth
              value={data.description}
              onInput={e => setData({ ...data, description: e.target.value })}
              error={
                Array.isArray(errors) &&
                errors.some(obj => obj.param === 'description')
              }
              helperText={
                Array.isArray(errors) &&
                errors.find(obj => obj.param === 'description')?.msg
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>cancel</Button>
          <Button onClick={handleSubmit} variant='contained' color='success'>
            update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
