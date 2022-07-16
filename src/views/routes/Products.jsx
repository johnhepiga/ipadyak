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
  useTheme,
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
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { Add, MoreVert, Search } from '@mui/icons-material';
import NumberFormat from 'react-number-format';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';

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

export default function Products({ onNotify }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_URL}products/get-all-products`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setProducts(data);
      });
  };

  const handleSearch = e => {
    setSearchParams({ query: e.target.value });
    axios
      .get(
        `${process.env.REACT_APP_URL}products/get-all-products?query=${e.target.value}`,
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setProducts(data);
      });
  };

  const reload = () => {
    fetchData();
  };

  React.useEffect(() => {
    fetchData();
  }, []);

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
                  <Typography variant='h6'>Products</Typography>
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
                    <Tooltip title='Add product'>
                      <IconButton onClick={() => navigate('add-product')}>
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, i) => {
                  return (
                    <CollapsingRow
                      key={i}
                      index={i + 1}
                      product={product}
                      theme={theme}
                      onReload={reload}
                      notify={onNotify}
                      navigate={navigate}
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
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

function CollapsingRow({ product, index, onReload, notify, navigate }) {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const show = Boolean(anchorEl);

  const handleRemove = () => {
    axios
      .delete(
        `${process.env.REACT_APP_URL}products/remove-product/${product.id}`,
        { withCredentials: true }
      )
      .then(({ data }) => {
        setOpen(false);
        onReload();
        notify(data, 'error');
      });
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{ bgcolor: product.quantity <= 50 ? '#e5737355' : 'initial' }}>
        <TableCell>{index}</TableCell>
        <TableCell>{product.id}</TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.type === 1 ? 'Bicycle' : 'Bike parts'}</TableCell>
        <TableCell>
          <NumberFormat
            value={product.price}
            displayType='text'
            decimalScale={2}
            fixedDecimalScale={2}
            thousandSeparator
            prefix='₱'
          />
        </TableCell>
        <TableCell>{product.quantity}</TableCell>
        <TableCell>
          <Moment format='MMM DD, YYYY'>{product.createdAt}</Moment>
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
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate('view-item/' + product.name, {
              state: {
                id: product.id,
              },
            });
          }}>
          View Item
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpen(true);
            setAnchorEl(null);
          }}>
          Delete Item
        </MenuItem>
      </Menu>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Are you sure you want to remove this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleRemove} variant='contained' color='error'>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
