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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { MoreVert, RestoreFromTrash, Search } from '@mui/icons-material';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import Moment from 'react-moment';
import { useSearchParams } from 'react-router-dom';

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

export default function Trashbin({ onNotify }) {
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
      .get(`${process.env.REACT_APP_URL}products/get-removed-products`, {
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
        `${process.env.REACT_APP_URL}products/get-removed-products?query=${e.target.value}`,
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
                  <Typography variant='h6'>Trash bin</Typography>
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
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow>
              {/* <TableCell>
                <Checkbox
                  color='primary'
                  inputProps={{
                    'aria-label': 'select all desserts',
                  }}
                />
              </TableCell> */}
              <TableCell>#</TableCell>
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
                      onReload={reload}
                      notify={onNotify}
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

function CollapsingRow({ product, index, onReload, notify }) {
  const [showDialog, setShowDialog] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const show = Boolean(anchorEl);

  const handleRetrieve = () => {
    axios
      .get(
        `${process.env.REACT_APP_URL}products/retrieve-product/${product.id}`,
        { withCredentials: true }
      )
      .then(({ data }) => {
        setShowDialog(false);
        onReload();
        notify(data, 'success');
      });
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{ bgcolor: product.quantity <= 50 ? '#e5737355' : 'initial' }}>
        {/* <TableCell width={30}>
          <Checkbox
            color='primary'
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell> */}
        <TableCell>{index}</TableCell>
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
            setShowDialog(true);
            setAnchorEl(null);
          }}>
          <RestoreFromTrash />
          &emsp;Retrieve Item
        </MenuItem>
      </Menu>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>Retrieve Item</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Are you sure you want to retrieve this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button onClick={handleRetrieve} variant='contained' color='success'>
            Retrieve
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
