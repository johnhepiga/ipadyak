import React from 'react';
import {
  Box,
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
  Avatar,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import Moment from 'react-moment';
import axios from 'axios';
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

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_URL}users/get-users`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setUsers(data);
      });
  };

  const handleSearch = e => {
    setSearchParams({ query: e.target.value });
    axios
      .get(
        `${process.env.REACT_APP_URL}users/get-users?query=${e.target.value}`,
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setUsers(data);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                  <Typography variant='h6'>Users</Typography>
                  <Stack direction='row'>
                    <MuiSearch>
                      <SearchIconWrapper>
                        <Search />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder='Search…'
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchParams.get('query') || ''}
                        onInput={handleSearch}
                      />
                    </MuiSearch>
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>First name</TableCell>
              <TableCell>Last name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Date Registered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.length > 0 ? (
              users
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map(
                  (
                    { firstname, lastname, email, number, profile, createdAt },
                    i
                  ) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Avatar
                          alt={firstname + ' ' + lastname}
                          src={
                            profile &&
                            process.env.REACT_APP_UPLOAD_URL + profile.value
                          }
                        />
                      </TableCell>
                      <TableCell>{firstname}</TableCell>
                      <TableCell>{lastname}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>
                        {number
                          ? '+63 ' +
                            `${number.substring(0, 3)} ` +
                            `${number.substring(3, 7)} ` +
                            number.substring(7)
                          : 'Not set'}
                      </TableCell>
                      <TableCell>
                        <Moment format='MMMM DD, YYYY'>{createdAt}</Moment>
                      </TableCell>
                    </TableRow>
                  )
                )
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
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
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}
