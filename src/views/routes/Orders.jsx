import React from 'react';
import {
  Box,
  Button,
  Collapse,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MobileStepper,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  ListItemAvatar,
  Radio,
  FormControlLabel,
  RadioGroup,
  Slide,
  Checkbox,
  styled,
  alpha,
  InputBase,
  Divider,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import axios from 'axios';
import Moment from 'react-moment';
import {
  ArrowForwardIos,
  Check,
  Close,
  FilterList,
  Search,
} from '@mui/icons-material';
import NumberFormat from 'react-number-format';
import { autoPlay } from 'react-swipeable-views-utils';
import SwipeableViews from 'react-swipeable-views';
import ShowMoreText from 'react-show-more-text';
import nl2br from 'react-nl2br';
import { grey } from '@mui/material/colors';
import ImageIcon from '../../files/image.png';
import FileIcon from '../../files/file.png';
import SocketContext from '../../context/socket';
import { useSearchParams } from 'react-router-dom';

const AutoSwipeableViews = autoPlay(SwipeableViews);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

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

export default function Orders({ onAction }) {
  const { reload, handleReload } = React.useContext(SocketContext);
  const [orders, setOrders] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkboxes, setCheckboxes] = React.useState({
    cancel: false,
    approval: false,
    preparing: false,
    ready: false,
    complete: false,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_URL}orders/get-all-orders`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setOrders(data);
      });
  };

  const handleStatus = e => {
    const value = e.target.value;
    let temp = filter.status || [];
    if (temp.some(status => status === value)) {
      temp = temp.filter(status => status !== value);
      return setFilter({ ...filter, status: temp });
    }
    temp.push(value);
    setFilter({ ...filter, status: temp });
  };

  const handleParams = e => {
    if (e.target.value !== null || e.target.value !== undefined) {
      setSearchParams({ search: e.target.value });
    }
    let query = '';
    query += e.target.value ? `search=${e.target.value}` : '';
    query += filter.method ? `method=${filter.method}&` : '';
    query += filter.paid ? `paid=${filter.paid}&` : '';
    query += filter.status ? `status=${JSON.stringify(filter.status)}&` : '';
    query += filter.date ? `date=${filter.date}` : '';
    axios
      .get(`${process.env.REACT_APP_URL}orders/get-all-orders?${query}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setPage(0);
        setOrders(data);
        setOpen(false);
      });
  };

  React.useEffect(() => {
    fetchData();
    if (reload) {
      fetchData();
      handleReload(false);
    }
  }, [reload, handleReload]);

  return (
    <Box
      p={1}
      overflow='auto'
      flex={1}
      flexBasis={0}
      minHeight={0}
      minWidth={0}>
      <TableContainer
        component={Paper}
        sx={{
          '&::-webkit-scrollbar': {
            height: 20,
            width: 20,
          },
          '&::-webkit-scrollbar-thumb': {
            border: 'solid 6px transparent',
            bgcolor: grey[700],
            backgroundClip: 'content-box',
            borderRadius: 10,
          },
        }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={10}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'>
                  <Typography variant='h6'>Orders</Typography>
                  <Stack
                    direction='row'
                    justifyContent='flex-start'
                    alignItems='center'>
                    <MuiSearch>
                      <SearchIconWrapper>
                        <Search />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder='Search…'
                        value={searchParams.get('search') || ''}
                        onInput={handleParams}
                        inputProps={{ 'aria-label': 'search' }}
                      />
                    </MuiSearch>
                    &nbsp;
                    <IconButton onClick={() => setOpen(true)}>
                      <FilterList />
                    </IconButton>
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Payment ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Transaction Date</TableCell>
              <TableCell width={160}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map(transaction => (
                  <CollapsingRow
                    key={transaction.id}
                    data={transaction}
                    onReload={fetchData}
                    onAction={onAction}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={10}>
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
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen
        TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
            <Typography sx={{ flex: 1, ml: 2 }} variant='h6' component='div'>
              Filters
            </Typography>
            {Object.keys(filter).length > 0 ? (
              <Button
                onClick={() => {
                  setFilter({});
                  setCheckboxes({
                    cancel: false,
                    approval: false,
                    preparing: false,
                    ready: false,
                    complete: false,
                  });
                }}>
                Remove filters
              </Button>
            ) : null}
            <Button
              onClick={
                Object.keys(filter).length > 0
                  ? handleParams
                  : () => setOpen(false)
              }>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List sx={{ p: 1 }}>
          <Typography variant='h6'>Payment Method</Typography>
          <RadioGroup
            value={filter.method || ''}
            onChange={e => setFilter({ ...filter, method: e.target.value })}>
            <ListItem>
              <ListItemAvatar>
                <FormControlLabel value='card' control={<Radio />} label='' />
              </ListItemAvatar>
              <ListItemText>Credit card</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <FormControlLabel
                  value='Cash on pick up'
                  control={<Radio />}
                  label=''
                />
              </ListItemAvatar>
              <ListItemText>Cash on pick up</ListItemText>
            </ListItem>
          </RadioGroup>
          <Typography variant='h6'>Payment status</Typography>
          <RadioGroup
            value={filter.paid || ''}
            onChange={e => setFilter({ ...filter, paid: e.target.value })}>
            <ListItem>
              <ListItemAvatar>
                <FormControlLabel value={1} control={<Radio />} label='' />
              </ListItemAvatar>
              <ListItemText>Paid</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <FormControlLabel value={0} control={<Radio />} label='' />
              </ListItemAvatar>
              <ListItemText>Not paid</ListItemText>
            </ListItem>
          </RadioGroup>
          <Typography variant='h6'>Order status</Typography>
          <ListItem>
            <ListItemAvatar>
              <FormControlLabel
                value={0}
                control={
                  <Checkbox
                    checked={checkboxes.cancel}
                    onInput={e => {
                      setCheckboxes({
                        ...checkboxes,
                        cancel: !checkboxes.cancel,
                      });
                      handleStatus(e);
                    }}
                  />
                }
                label=''
              />
            </ListItemAvatar>
            <ListItemText>Canceled</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <FormControlLabel
                value={1}
                control={
                  <Checkbox
                    checked={checkboxes.approval}
                    onInput={e => {
                      setCheckboxes({
                        ...checkboxes,
                        approval: !checkboxes.approval,
                      });
                      handleStatus(e);
                    }}
                  />
                }
                label=''
              />
            </ListItemAvatar>
            <ListItemText>For approval</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <FormControlLabel
                value={2}
                control={
                  <Checkbox
                    checked={checkboxes.preparing}
                    onInput={e => {
                      setCheckboxes({
                        ...checkboxes,
                        preparing: !checkboxes.preparing,
                      });
                      handleStatus(e);
                    }}
                  />
                }
                label=''
              />
            </ListItemAvatar>
            <ListItemText>Preparing</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <FormControlLabel
                value={3}
                control={
                  <Checkbox
                    checked={checkboxes.ready}
                    onInput={e => {
                      setCheckboxes({
                        ...checkboxes,
                        ready: !checkboxes.ready,
                      });
                      handleStatus(e);
                    }}
                  />
                }
                label=''
              />
            </ListItemAvatar>
            <ListItemText>Ready for pick up</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <FormControlLabel
                value={4}
                control={
                  <Checkbox
                    checked={checkboxes.complete}
                    onInput={e => {
                      setCheckboxes({
                        ...checkboxes,
                        complete: !checkboxes.complete,
                      });
                      handleStatus(e);
                    }}
                  />
                }
                label=''
              />
            </ListItemAvatar>
            <ListItemText>Completed</ListItemText>
          </ListItem>
          <Typography variant='h6'>Dates</Typography>
          <RadioGroup
            value={filter.date || ''}
            onChange={e => setFilter({ ...filter, date: e.target.value })}>
            <ListItem>
              <ListItemAvatar>
                <FormControlLabel value='today' control={<Radio />} label='' />
              </ListItemAvatar>
              <ListItemText>Today</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <FormControlLabel value='week' control={<Radio />} label='' />
              </ListItemAvatar>
              <ListItemText>This week</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <FormControlLabel value='month' control={<Radio />} label='' />
              </ListItemAvatar>
              <ListItemText>This month</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <FormControlLabel value='year' control={<Radio />} label='' />
              </ListItemAvatar>
              <ListItemText>This year</ListItemText>
            </ListItem>
          </RadioGroup>
        </List>
      </Dialog>
    </Box>
  );
}

function CollapsingRow({ data, onReload, onAction }) {
  const [open, setOpen] = React.useState(false);

  var status = '';

  switch (data.status) {
    case 0:
      status = 'Canceled';
      break;
    case 1:
      status = 'For approval';
      break;
    case 2:
      status = 'Preparing';
      break;
    case 3:
      status = 'Ready for pick up';
      break;
    case 4:
      status = 'Order completed';
      break;
    default:
      status = '';
      break;
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            <ArrowForwardIos
              sx={{ transform: `rotate(${open ? 90 : 0}deg)` }}
            />
          </IconButton>
        </TableCell>
        <TableCell>{data.id}</TableCell>
        <TableCell>
          {data.buyer.firstname} {data.buyer.lastname}
        </TableCell>
        <TableCell>
          <NumberFormat
            value={data.amount}
            displayType='text'
            thousandSeparator
            decimalSeparator='.'
            fixedDecimalScale
            decimalScale={2}
            prefix='₱'
          />
        </TableCell>
        <TableCell>
          <Typography variant='button'>{data.method}</Typography>
        </TableCell>
        <TableCell>{data.payment_id ? data.payment_id : 'N/A'}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>
          {data.isPaid === 1 ? (
            <Check color='success' />
          ) : (
            <Close color='error' />
          )}
        </TableCell>
        <TableCell>
          <Moment format='MMMM DD, YYYY \at hh:mm a'>{data.createdAt}</Moment>
        </TableCell>
        <TableCell>
          <Actions
            status={data.status}
            id={data.id}
            onReload={onReload}
            onAction={onAction}
            reason={data.reason}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={10} sx={{ p: 0, m: 0 }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box p={1}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell>Color</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.orders.map((order, i) => (
                      <CollapsingOrder key={i} data={order} />
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function Actions({ status, id, reason, onReload, onAction }) {
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [errors, setErrors] = React.useState([]);

  const handleApprove = () => {
    axios
      .patch(
        `${process.env.REACT_APP_URL}orders/approve-order/${id}`,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => {
        setOpen(false);
        onAction(data);
        onReload();
      })
      .catch(e => {
        onAction('Something went wrong', 'error');
      });
  };

  const handleReady = () => {
    axios
      .patch(
        `${process.env.REACT_APP_URL}orders/ready-order/${id}`,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => {
        setOpen(false);
        onAction(data);
        onReload();
      })
      .catch(e => {
        onAction('Something went wrong', 'error');
      });
  };

  const handleComplete = () => {
    const formData = new FormData();
    formData.append('image', image);
    axios
      .patch(
        `${process.env.REACT_APP_URL}orders/complete-order/${id}`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setOpen(false);
        onAction(data);
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        if (data.file) {
          return setErrors(data);
        }
        onAction('Something went wrong', 'error');
      });
  };

  const handleImage = e => {
    if (!e.target.files[0]) return;
    setImage(e.target.files[0]);
  };

  switch (status) {
    case 0:
      return (
        <React.Fragment>
          <Button
            size='small'
            variant='contained'
            color='error'
            onClick={() => setOpen(true)}>
            show reason
          </Button>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth='xs'>
            <DialogContent>
              <DialogContentText>{reason.reason}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>close</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      );
    case 1:
      return (
        <React.Fragment>
          <Button
            size='small'
            variant='contained'
            color='success'
            onClick={() => setOpen(true)}>
            Approve
          </Button>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth='xs'>
            <DialogTitle>Approve Order</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to approve this order?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>cancel</Button>
              <Button
                onClick={handleApprove}
                variant='contained'
                color='success'>
                approve
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      );
    case 2:
      return (
        <React.Fragment>
          <Button
            onClick={() => setOpen(true)}
            size='small'
            variant='contained'
            color='info'>
            Set as ready
          </Button>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth='xs'>
            <DialogTitle>Ready for pick up</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure this order is ready to be picked up?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>cancel</Button>
              <Button onClick={handleReady} variant='contained' color='success'>
                confirm
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      );
    case 3:
      return (
        <React.Fragment>
          <Button
            onClick={() => setOpen(true)}
            size='small'
            variant='contained'
            color='info'>
            Complete order
          </Button>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth='xs'>
            <DialogTitle>Complete Order</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Provide an image of pick up (proof of pick up is required)
              </DialogContentText>
              <Box
                sx={{
                  height: 255,
                  width: '100%',
                  aspectRatio: '16/9',
                  background: `url(${
                    image
                      ? image?.type?.split('/')[0] === 'image'
                        ? URL.createObjectURL(image)
                        : FileIcon
                      : ImageIcon
                  }) no-repeat center`,
                  backgroundSize: 'contain',
                }}
              />
              <TextField
                type='file'
                onInput={handleImage}
                fullWidth
                error={errors.file ? true : false}
                helperText={errors.file}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>cancel</Button>
              <Button
                onClick={handleComplete}
                variant='contained'
                color='success'>
                confirm
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      );
    default:
      return <Box></Box>;
  }
}

function CollapsingOrder({ data }) {
  const [open, setOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep < data.product.images.length - 1) {
      return setActiveStep(activeStep + 1);
    }
    setActiveStep(0);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      return setActiveStep(activeStep - 1);
    }
    setActiveStep(data.product.images.length - 1);
  };

  const list = {
    1: [
      {
        label: 'Product name',
        value: data.product.name,
      },
      {
        label: 'Product type',
        value: data.product.type === 1 ? 'Bike' : 'Bike part',
      },
    ],
    2: [
      {
        label: 'Added By',
        value:
          data.product.addedBy.firstname + ' ' + data.product.addedBy.lastname,
      },
      {
        label: 'Created At',
        value: (
          <Moment format='MMMM DD, YYYY \at hh:mm a'>
            {data.product.createdAt}
          </Moment>
        ),
      },
    ],
  };

  console.log(data.addons);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            <ArrowForwardIos
              sx={{ transform: `rotate(${open ? 90 : 0}deg)` }}
            />
          </IconButton>
        </TableCell>
        <TableCell>{data.product.name}</TableCell>
        <TableCell>{data.color.value}</TableCell>
        <TableCell>{data.price}</TableCell>
        <TableCell>x{data.quantity}</TableCell>
        <TableCell>x{data.price * data.quantity}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ p: 0, m: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Container maxWidth='sm' sx={{ py: 1 }}>
              <Box mx='auto' maxWidth={400}>
                <AutoSwipeableViews
                  axis='x'
                  index={activeStep}
                  onChangeIndex={step => setActiveStep(step)}
                  enableMouseEvents>
                  {data.product.images.map((image, index) => (
                    <div key={index}>
                      {Math.abs(activeStep - index) <= 2 ? (
                        <Box
                          component='img'
                          sx={{
                            height: 255,
                            display: 'block',
                            maxWidth: 400,
                            overflow: 'hidden',
                            width: '100%',
                            objectFit: 'contain',
                          }}
                          src={process.env.REACT_APP_UPLOAD_URL + image.value}
                          alt={image.value}
                        />
                      ) : null}
                    </div>
                  ))}
                </AutoSwipeableViews>
                {data.product.images.length > 1 ? (
                  <MobileStepper
                    steps={data.product.images.length}
                    position='static'
                    activeStep={activeStep}
                    nextButton={
                      <Button size='small' onClick={handleNext}>
                        Next
                      </Button>
                    }
                    backButton={
                      <Button size='small' onClick={handleBack}>
                        Back
                      </Button>
                    }
                  />
                ) : null}
              </Box>
              <Stack direction='row'>
                {Object.keys(list).map(key => (
                  <List key={key} sx={{ flex: 1 }} disablePadding>
                    {list[key].map(({ label, value }) => (
                      <ListItem key={label} disableGutters disablePadding>
                        <ListItemText primary={value} secondary={label} />
                      </ListItem>
                    ))}
                  </List>
                ))}
              </Stack>
              <br />
              <Typography variant='caption' sx={{ textTransform: 'uppercase' }}>
                Description
              </Typography>
              <ShowMoreText
                lines={3}
                more='Show more'
                less='Show less'
                expanded={false}
                truncatedEndingComponent={'... '}
                anchorClass='custom-anchor-class'>
                {nl2br(data.product.description)}
              </ShowMoreText>
              <Divider />
              {data?.addons?.length > 0 &&
                data?.addons?.map(({ addon, option, price }, i) => (
                  <Stack
                    my={1}
                    key={i}
                    elevation={3}
                    component={Paper}
                    alignItems='center'
                    direction='row'>
                    <ListItem>
                      {addon?.image && (
                        <ListItemIcon>
                          <Avatar
                            alt={addon.title}
                            src={
                              process.env.REACT_APP_UPLOAD_URL +
                              addon?.image?.value
                            }
                          />
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={addon.title}
                        secondary={
                          <>
                            +{' '}
                            <NumberFormat
                              value={price}
                              displayType='text'
                              thousandSeparator
                              decimalSeparator='.'
                              decimalScale={2}
                              fixedDecimalScale={2}
                              prefix='₱'
                            />
                          </>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      {option?.image && (
                        <ListItemIcon>
                          <Avatar
                            alt={option.option}
                            src={
                              process.env.REACT_APP_UPLOAD_URL +
                              option?.image?.value
                            }
                          />
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={option.option}
                        secondary='Selected'
                      />
                    </ListItem>
                  </Stack>
                ))}
            </Container>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
