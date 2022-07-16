import React from 'react';
import { Add, Delete, Edit, Update } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  TextField,
  DialogContentText,
} from '@mui/material';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { grey } from '@mui/material/colors';

export default function Tags({ onAction }) {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    setLoading(true);
    await axios
      .get(`${process.env.REACT_APP_URL}tags/get-all-configurations`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const reload = () => fetchData();

  return loading ? (
    <Box sx={{ position: 'fixed', inset: 0 }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          m: 'auto',
          height: 'min-content',
          width: 'max-content',
        }}>
        <Stack justifyContent='center' alignItems='center'>
          <Oval
            color='#000'
            height={160}
            width={160}
            secondaryColor='#a9a9a9'
          />
          <Typography variant='h6' textAlign='center'>
            Loading Configurations...
          </Typography>
        </Stack>
      </Box>
    </Box>
  ) : (
    <Box p={1} overflow='hidden auto' flex={1}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box>
            <Grid container direction='row' spacing={1}>
              <Grid item md={4} xs={12}>
                <Box component={Paper} p={1} height='100%'>
                  <Stack
                    pb={0.5}
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'>
                    <Typography variant='body1'>Types of Bikes</Typography>
                    <AddTags
                      type='bikes'
                      title='Add a type of bike'
                      label='Bike type'
                      onAction={onAction}
                      onReload={reload}
                    />
                  </Stack>
                  <Divider />
                  <ListView
                    onAction={onAction}
                    onReload={reload}
                    data={data?.tags?.bikes}
                    emptyText='No bike type found.'
                  />
                </Box>
              </Grid>
              <Grid item md={4} xs={12}>
                <Box component={Paper} p={1} height='100%'>
                  <Stack
                    pb={0.5}
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'>
                    <Typography variant='body1'>Types of Cyclists</Typography>
                    <AddTags
                      type='cyclists'
                      title='Add a type of cyclist'
                      label='Cyclist type'
                      onAction={onAction}
                      onReload={reload}
                    />
                  </Stack>
                  <Divider />
                  <ListView
                    onAction={onAction}
                    onReload={reload}
                    data={data?.tags?.cyclists}
                    emptyText='No cyclist type found.'
                  />
                </Box>
              </Grid>
              <Grid item md={4} xs={12}>
                <Box component={Paper} p={1} height='100%'>
                  <Stack
                    pb={0.5}
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'>
                    <Typography variant='body1'>Gender Tags</Typography>
                    <AddTags
                      type='genders'
                      title='Add a gender'
                      label='Gender'
                      onAction={onAction}
                      onReload={reload}
                    />
                  </Stack>
                  <Divider />
                  <ListView
                    onAction={onAction}
                    onReload={reload}
                    data={data?.tags?.genders}
                    emptyText='No gender tag.'
                  />
                </Box>
              </Grid>
              <Grid item md={4} xs={12}>
                <Box component={Paper} p={1} height='100%'>
                  <Stack
                    pb={0.5}
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'>
                    <Typography variant='body1'>
                      Customer Experience Level
                    </Typography>
                    <AddTags
                      type='experiences'
                      title='Add an experience level'
                      label='Experience Level'
                      onAction={onAction}
                      onReload={reload}
                    />
                  </Stack>
                  <Divider />
                  <ListView
                    onAction={onAction}
                    onReload={reload}
                    data={data?.tags?.experiences}
                    emptyText='No experience level found.'
                  />
                </Box>
              </Grid>
              <Grid item md={4} xs={12}>
                <Box component={Paper} p={1} height='100%'>
                  <Stack
                    pb={0.5}
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'>
                    <Typography variant='body1'>Color Variants</Typography>
                    <AddTags
                      type='variants'
                      title='Add a variant'
                      label='Color variant'
                      onAction={onAction}
                      onReload={reload}
                    />
                  </Stack>
                  <Divider />
                  <ListView
                    onAction={onAction}
                    onReload={reload}
                    data={data?.tags?.variants}
                    emptyText='No color variant found.'
                  />
                </Box>
              </Grid>
              <Grid item md={4} xs={12}>
                <Box component={Paper} p={1} height='100%'>
                  <Stack
                    pb={0.5}
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'>
                    <Typography variant='body1'>Services</Typography>
                    <AddTags
                      type='services'
                      title='Add a service'
                      label='Service name'
                      onAction={onAction}
                      onReload={reload}
                    />
                  </Stack>
                  <Divider />
                  <ListView
                    onAction={onAction}
                    onReload={reload}
                    data={data?.tags?.services}
                    emptyText='No services found.'
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function ListView({ data, emptyText, onAction, onReload }) {
  return data?.length <= 0 ? (
    <Typography variant='h6' textAlign='center'>
      {emptyText}
    </Typography>
  ) : (
    <List
      sx={{
        maxHeight: 235,
        overflow: 'hidden auto',
        '&::-webkit-scrollbar': {
          width: 20,
        },
        '&::-webkit-scrollbar-thumb': {
          border: 'solid 6px transparent',
          bgcolor: grey[700],
          borderRadius: 10,
          backgroundClip: 'content-box',
        },
      }}>
      {data?.map(({ id, value, description }, i) => {
        return (
          <ListItem key={i}>
            <ListItemText primary={value} />
            <DeleteTag id={id} onAction={onAction} onReload={onReload} />
            <UpdateTag
              id={id}
              current={{ value, description }}
              onAction={onAction}
              onReload={onReload}
            />
          </ListItem>
        );
      })}
    </List>
  );
}

function AddTags({ type, title, label, onAction, onReload }) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({ value: '', description: '' });
  const [errors, setErrors] = React.useState([]);

  const handleClose = () => {
    setOpen(false);
    setData({ value: '', description: '' });
  };

  const addTags = () => {
    setErrors([]);
    data.type = type;
    axios
      .post(`${process.env.REACT_APP_URL}tags/add-tags`, data, {
        withCredentials: true,
      })
      .then(({ data }) => {
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
      <Button onClick={() => setOpen(true)}>
        <Add /> Add
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          <FormHelperText
            error={errors?.some(obj => obj.param === 'type')}
            sx={{ textAlign: 'center' }}>
            {errors?.find(obj => obj.param === 'type')?.msg}
          </FormHelperText>
          <Box p={1}>
            <TextField
              label={label}
              fullWidth
              value={data.value}
              onInput={e => setData({ ...data, value: e.target.value })}
              autoComplete='off'
              error={errors?.some(obj => obj.param === 'value')}
              helperText={errors?.find(obj => obj.param === 'value')?.msg}
            />
          </Box>
          <Box p={1}>
            {type === 'genders' ? null : type === 'variants' ? (
              <TextField
                type='color'
                label='Color'
                fullWidth
                value={data.description}
                onInput={e => setData({ ...data, description: e.target.value })}
              />
            ) : (
              <TextField
                label='Description'
                fullWidth
                value={data.description}
                onInput={e => setData({ ...data, description: e.target.value })}
                multiline
                rows={5}
                error={errors?.some(obj => obj.param === 'description')}
                helperText={
                  errors?.find(obj => obj.param === 'description')?.msg
                }
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant='contained' color='success' onClick={addTags}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function DeleteTag({ id, onAction, onReload }) {
  const [open, setOpen] = React.useState(false);

  const deleteTag = () => {
    axios
      .delete(`${process.env.REACT_APP_URL}tags/delete-tag/${id}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        onAction(data, 'error');
        onReload();
      });
  };

  const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <IconButton size='small' onClick={() => setOpen(true)}>
        <Delete />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>Delete Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tag?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant='contained'
            color='error'
            onClick={deleteTag}
            startIcon={<Delete />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function UpdateTag({ current, id, onAction, onReload }) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({ value: '', description: '' });
  const [errors, setErrors] = React.useState([]);

  React.useEffect(() => {
    setData(current);
  }, [current]);

  const handleClose = () => {
    setData(current);
    setOpen(false);
  };

  const updateTag = () => {
    axios
      .patch(`${process.env.REACT_APP_URL}tags/update-tag/${id}`, data, {
        withCredentials: true,
      })
      .then(({ data }) => {
        onAction(data, 'warning');
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  return (
    <React.Fragment>
      <IconButton size='small' onClick={() => setOpen(true)}>
        <Edit />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>Update Tag</DialogTitle>
        <DialogContent>
          <FormHelperText
            error={errors?.some(obj => obj.param === 'type')}
            sx={{ textAlign: 'center' }}>
            {errors?.find(obj => obj.param === 'type')?.msg}
          </FormHelperText>
          <Box p={1}>
            <TextField
              label='New value'
              value={data.value}
              fullWidth
              onInput={e => setData({ ...data, value: e.target.value })}
              autoComplete='off'
              error={errors?.some(obj => obj.param === 'value')}
              helperText={errors?.find(obj => obj.param === 'value')?.msg}
            />
          </Box>
          <Box p={1}>
            <TextField
              label='Description'
              value={data.description}
              fullWidth
              multiline
              rows={5}
              onInput={e => setData({ ...data, description: e.target.value })}
              autoComplete='off'
              error={errors?.some(obj => obj.param === 'description')}
              helperText={errors?.find(obj => obj.param === 'description')?.msg}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant='contained'
            color='primary'
            onClick={updateTag}
            startIcon={<Update />}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
