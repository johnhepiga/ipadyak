import React from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Stack,
  Paper,
  Typography,
  styled,
  alpha,
  InputBase,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormHelperText,
  Avatar,
  InputAdornment,
} from '@mui/material';
import { Add, MoreVert, Search } from '@mui/icons-material';
import Moment from 'react-moment';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MuiSearch = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 225,
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function Staffs({ onAction }) {
  const navigate = useNavigate();
  const [staffs, setStaffs] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_URL}staffs/get-all-staffs`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setStaffs(data);
      });
  };

  const handleSearch = e => {
    setSearchParams({ query: e.target.value });
    axios
      .get(
        `${process.env.REACT_APP_URL}staffs/get-all-staffs?query=${e.target.value}`,
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setStaffs(data);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const reload = () => fetchData();

  return (
    <Box overflow='hidden auto' p={1}>
      <TableContainer component={Paper}>
        <Table elevation={3}>
          <TableHead>
            <TableRow>
              <TableCell colSpan={9}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'>
                  <Typography variant='h6'>Staffs</Typography>
                  <Stack direction='row'>
                    <MuiSearch>
                      <SearchIconWrapper>
                        <Search />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder='Search…'
                        value={searchParams.get('query') || ''}
                        onInput={handleSearch}
                        inputProps={{ 'aria-label': 'search' }}
                      />
                    </MuiSearch>
                    &nbsp;
                    <AddNewStaff onAction={onAction} onReload={reload} />
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>First name</TableCell>
              <TableCell>Last name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Birthdate</TableCell>
              <TableCell>Created at</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {staffs.length > 0 ? (
              staffs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((staff, i) => {
                  return (
                    <CollapsingRow
                      key={i}
                      index={i}
                      staff={staff}
                      navigate={navigate}
                      onReload={reload}
                      onAction={onAction}
                    />
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={9}>
                  <Typography variant='h5' textAlign='center'>
                    No data found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={staffs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

function CollapsingRow(props) {
  const {
    id,
    firstname,
    lastname,
    birthdate,
    created,
    isDisabled,
    isRemoved,
    profile,
  } = props.staff;
  const [disable, setDisable] = React.useState(false);
  const [remove, setRemove] = React.useState(false);
  const [reason, setReason] = React.useState('');
  const [errors, setErrors] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const show = Boolean(anchorEl);

  const handleView = () => {
    props.navigate(`/staffs/view-staff/${firstname} ${lastname}`, {
      state: {
        id,
      },
    });
  };

  const handleDisable = () => {
    axios
      .patch(
        `${process.env.REACT_APP_URL}staffs/disable-account/${id}`,
        { reason },
        { withCredentials: true }
      )
      .then(({ data }) => {
        setDisable(false);
        props.onAction(data, 'error');
        props.onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  const handleEnable = () => {
    axios
      .patch(
        `${process.env.REACT_APP_URL}staffs/enable-account/${id}`,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => {
        setDisable(false);
        props.onAction(data);
        props.onReload();
      });
  };

  const handleRemove = () => {
    axios
      .patch(
        `${process.env.REACT_APP_URL}staffs/remove-account/${id}`,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => {
        setRemove(false);
        props.onAction(data, 'error');
        props.onReload();
      });
  };

  const handleRetrieve = () => {
    axios
      .patch(
        `${process.env.REACT_APP_URL}staffs/retrieve-account/${id}`,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => {
        setRemove(false);
        props.onAction(data);
        props.onReload();
      });
  };

  const handleCancel = () => {
    setReason('');
    setErrors([]);
    setDisable(false);
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{props.index + 1}</TableCell>
        <TableCell>
          <Avatar
            alt={firstname + ' ' + lastname}
            src={profile && process.env.REACT_APP_UPLOAD_URL + profile.value}
          />
        </TableCell>
        <TableCell>{firstname}</TableCell>
        <TableCell>{lastname}</TableCell>
        <TableCell>
          {isRemoved === 1
            ? 'Closed'
            : isDisabled === 1
            ? 'Disabled'
            : 'Active'}
        </TableCell>
        <TableCell>
          {birthdate ? (
            <Moment format='MMM DD, YYYY'>{birthdate}</Moment>
          ) : (
            'Not set'
          )}
        </TableCell>
        <TableCell>
          <Moment format='MMM DD, YYYY'>{created}</Moment>
        </TableCell>
        <TableCell width={30}>
          <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
        </TableCell>
      </TableRow>

      <Menu
        open={show}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuItem onClick={handleView}>View Account</MenuItem>
        <MenuItem
          onClick={() => {
            setDisable(true);
            setAnchorEl(null);
          }}>
          {isDisabled === 1 ? 'Enable' : 'Disable'} Account
        </MenuItem>
        <MenuItem
          onClick={() => {
            setRemove(true);
            setAnchorEl(null);
          }}>
          {isRemoved === 1 ? 'Retrieve' : 'Remove'} Account
        </MenuItem>
      </Menu>

      <Dialog
        open={disable}
        onClose={() => setDisable(false)}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>
          {isDisabled === 1 ? 'Enable' : 'Disable'} account
        </DialogTitle>
        <DialogContent>
          {isDisabled === 1 ? (
            <Typography variant='subtitle1'>
              Are you sure you want to enable this staff's account?
            </Typography>
          ) : (
            <React.Fragment>
              <FormHelperText error={errors?.hasOwnProperty('id')}>
                {errors?.id}
              </FormHelperText>
              <Box my={1}>
                <TextField
                  autoComplete='off'
                  label='Please provide a reason why you want to disable this account.'
                  value={reason}
                  onInput={e => setReason(e.target.value)}
                  multiline
                  rows={5}
                  fullWidth
                  error={errors?.some(obj => obj.param === 'reason')}
                  helperText={errors?.find(obj => obj.param === 'reason')?.msg}
                />
              </Box>
              <FormHelperText color='info'>
                Note: Disabled accounts will limit the staff's access
                privileges.
              </FormHelperText>
            </React.Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={isDisabled === 1 ? handleEnable : handleDisable}
            variant='contained'
            color={isDisabled === 1 ? 'success' : 'error'}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={remove}
        onClose={() => setRemove(false)}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>
          {isRemoved === 1 ? 'Retrieve' : 'Remove'} account
        </DialogTitle>
        <DialogContent>
          <Typography variant='subtitle1'>
            Are you sure you want to {isRemoved === 1 ? 'retrieve' : 'remove'}{' '}
            this account?
          </Typography>
          {isRemoved === 1 ? null : (
            <FormHelperText error={true}>
              Warning: Removed accounts will lock out staffs from their account.
            </FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemove(false)}>Cancel</Button>
          <Button
            onClick={isRemoved === 1 ? handleRetrieve : handleRemove}
            variant='contained'
            color={isRemoved === 1 ? 'success' : 'error'}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function AddNewStaff({ onAction, onReload }) {
  const [data, setData] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    number: '',
  });
  const [open, setOpen] = React.useState(false);
  const [errors, setErrors] = React.useState([]);

  const handleClose = () => {
    setData({ firstname: '', lastname: '', email: '', number: '' });
    setOpen(false);
  };

  const handleSubmit = () => {
    setErrors([]);
    axios
      .post(`${process.env.REACT_APP_URL}staffs/create-staff`, data, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setData({ firstname: '', lastname: '', email: '', number: '' });
        setOpen(false);
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
      <Tooltip title='Add Staff'>
        <IconButton onClick={() => setOpen(true)}>
          <Add />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>Create Staff Profile</DialogTitle>
        <DialogContent dividers>
          <Box>
            <Box my={1}>
              <TextField
                autoComplete='off'
                label='First name'
                value={data.firstname}
                onInput={e => setData({ ...data, firstname: e.target.value })}
                placeholder='e.g. John'
                fullWidth
                error={
                  Array.isArray(errors) &&
                  errors.some(obj => obj.param === 'firstname')
                }
                helperText={
                  Array.isArray(errors) &&
                  errors?.find(obj => obj.param === 'firstname')?.msg
                }
              />
            </Box>
            <Box my={1}>
              <TextField
                autoComplete='off'
                label='Last name'
                value={data.lastname}
                onInput={e => setData({ ...data, lastname: e.target.value })}
                placeholder='e.g. Doe'
                fullWidth
                error={
                  Array.isArray(errors) &&
                  Array.isArray(errors) &&
                  errors.some(obj => obj.param === 'lastname')
                }
                helperText={
                  Array.isArray(errors) &&
                  Array.isArray(errors) &&
                  errors?.find(obj => obj.param === 'lastname')?.msg
                }
              />
            </Box>
            <Box my={1}>
              <TextField
                autoComplete='off'
                label='Email address'
                value={data.email}
                onInput={e => setData({ ...data, email: e.target.value })}
                fullWidth
                placeholder='example@example.com'
                error={
                  Array.isArray(errors) &&
                  Array.isArray(errors) &&
                  errors.some(obj => obj.param === 'email')
                }
                helperText={
                  Array.isArray(errors) &&
                  Array.isArray(errors) &&
                  errors?.find(obj => obj.param === 'email')?.msg
                }
              />
            </Box>
            <Box my={1}>
              <TextField
                autoComplete='off'
                label='Phone number'
                value={data.number}
                onInput={e => setData({ ...data, number: e.target.value })}
                fullWidth
                placeholder='9XXXXXXXXX'
                error={
                  Array.isArray(errors) &&
                  Array.isArray(errors) &&
                  errors.some(obj => obj.param === 'number')
                }
                helperText={
                  Array.isArray(errors) &&
                  Array.isArray(errors) &&
                  errors?.find(obj => obj.param === 'number')?.msg
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Typography variant='body1'>+63</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant='contained' color='success'>
            Create staff
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
