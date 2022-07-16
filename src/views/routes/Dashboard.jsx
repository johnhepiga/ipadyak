import React from 'react';
import {
  Box,
  Stack,
  Paper,
  Typography,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ButtonGroup,
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { blue, green, indigo, pink, red, yellow } from '@mui/material/colors';
import {
  MoreVert,
  Cached,
  FileDownload,
  SsidChart,
  BarChart,
} from '@mui/icons-material';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import ReactToPdf from 'react-to-pdf';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const theme = useTheme();
  const [date, setDate] = React.useState(new Date());
  const [type, setType] = React.useState('day');
  const [data, setData] = React.useState({});

  const fetchData = () => {
    axios
      .get(process.env.REACT_APP_URL + `?date=${date}&type=${type}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setData(data);
      });
  };

  const handleTypeChange = type => {
    axios
      .get(process.env.REACT_APP_URL + `?date=${date}&type=${type}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setData(data);
        setType(type);
      });
  };

  React.useState(() => {
    fetchData();
  }, []);

  return (
    <Box overflow='hidden auto' p={1}>
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        mb={2}>
        <Typography variant='h6'>
          <Moment format='MMMM DD, YYYY'>{new Date()}</Moment>
        </Typography>
        <Stack direction='row'>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={date}
              onChange={newValue => {
                setDate(newValue);
                fetchData();
              }}
              renderInput={params => <TextField {...params} size='small' />}
            />
          </LocalizationProvider>
          &nbsp;
          <Button variant='contained' size='small'>
            <Cached fontSize='small' />
          </Button>
        </Stack>
      </Stack>
      <Grid container spacing={1}>
        <Area1
          theme={theme}
          data={data}
          type={type}
          date={date}
          onTypeChange={handleTypeChange}
        />
        <Area2 data={data} />
      </Grid>
    </Box>
  );
}

const Area1 = ({ theme, data, type, date, onTypeChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [chart, setChart] = React.useState('line');
  const show = Boolean(anchorEl);
  const ref = React.useRef();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Sales',
      },
    },
  };

  let labels = [];
  let count = 0;

  switch (type) {
    case 'month':
      labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      break;
    case 'year':
      while (count <= 5) {
        labels.push(new Date().getFullYear() - count);
        count++;
      }
      break;
    case 'day':
      count = 0;
      while (count <= 7) {
        const d = new Date(date).getDate() - count;
        labels.push(
          new Date(new Date().setDate(d)).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
            day: '2-digit',
          })
        );
        count++;
      }
      break;
    default:
      break;
  }

  const dataSet = {
    labels,
    datasets: [
      {
        label: 'Bikes sold',
        data: data?.bikesGraph,
        borderColor: blue[900],
        backgroundColor: blue[500],
      },
      {
        label: 'Parts sold',
        data: data?.partsGraph,
        borderColor: red[900],
        backgroundColor: red[500],
      },
    ],
  };

  return (
    <React.Fragment>
      <Grid item md={4} xs={12}>
        <Grid container spacing={1}>
          {['Customers', 'Orders'].map((text, i) => {
            return (
              <Grid item sm={6} xs={12} key={i} zeroMinWidth>
                <Box component={Paper} p={2} height='100%' overflow='hidden'>
                  <Typography variant='subtitle2'>{text}</Typography>
                  <Typography variant='h5' my={2} noWrap>
                    {text === 'Customers' ? (
                      data?.customers || 0
                    ) : (
                      <NumberFormat
                        value={data?.sales?.total || 0}
                        displayType='text'
                        thousandSeparator
                        decimalSeparator='.'
                        fixedDecimalScale
                        decimalScale={2}
                        prefix='₱'
                      />
                    )}
                  </Typography>
                  <Typography variant='body2'>
                    {text === 'Customers' ? 'Customers count' : 'Overall sales'}
                  </Typography>
                  <Typography variant='caption'>
                    {text === 'Customers'
                      ? 'Total orders'
                      : 'Overall total sales'}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
        <Grid container spacing={1} mt={1}>
          {['Bike sales', 'Part sales'].map((text, i) => {
            return (
              <Grid item sm={6} xs={12} key={i}>
                <Box component={Paper} p={2}>
                  <Typography variant='subtitle2'>{text}</Typography>
                  <Typography variant='h5' my={2} noWrap>
                    <NumberFormat
                      value={
                        (text === 'Bike sales'
                          ? data?.bikes?.total
                          : data?.parts?.total) || 0
                      }
                      displayType='text'
                      thousandSeparator
                      decimalSeparator='.'
                      fixedDecimalScale
                      decimalScale={2}
                      prefix='₱'
                    />
                  </Typography>
                  <Typography variant='body2'>
                    {text === 'Bike sales' ? 'Bike sales' : 'Part sales'}
                  </Typography>
                  <Typography variant='caption'>
                    {text === 'Bike sales'
                      ? 'Overall total sales'
                      : 'Overall total sales'}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid item md={8} xs={12}>
        <Stack
          component={Paper}
          p={2}
          height='100%'
          direction='column'
          ref={ref}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <ButtonGroup size='small'>
              <Button
                variant='contained'
                color={type === 'day' ? 'info' : 'primary'}
                onClick={() => onTypeChange('day')}>
                Daily
              </Button>
              <Button
                variant='contained'
                color={type === 'month' ? 'info' : 'primary'}
                onClick={() => onTypeChange('month')}>
                Monthly
              </Button>
              <Button
                variant='contained'
                color={type === 'year' ? 'info' : 'primary'}
                onClick={() => onTypeChange('year')}>
                Annually
              </Button>
            </ButtonGroup>
            <ButtonGroup size='small'>
              <Button
                variant='contained'
                onClick={() => setChart('line')}
                color={chart === 'line' ? 'info' : 'primary'}>
                <SsidChart />
              </Button>
              <Button
                variant='contained'
                onClick={() => setChart('bar')}
                color={chart === 'bar' ? 'info' : 'primary'}>
                <BarChart />
              </Button>
            </ButtonGroup>
          </Stack>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <Typography variant='subtitle1'>Total sales</Typography>
            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
              <MoreVert />
            </IconButton>
          </Stack>
          <Box flex={1}>
            {chart === 'line' ? (
              <Line options={options} data={dataSet} height={240} />
            ) : (
              <Bar options={options} data={dataSet} height={240} />
            )}
          </Box>
        </Stack>
      </Grid>

      <Menu
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={show}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}>
        <ReactToPdf
          targetRef={ref}
          filename='top-selling-products.pdf'
          x={0}
          y={0}
          scale={1.3}
          options={{
            orientation: 'landscape',
            unit: 'px',
          }}>
          {({ toPdf }) => (
            <MenuItem
              onClick={() => {
                toPdf();
                setAnchorEl(null);
              }}>
              Download as PDF
            </MenuItem>
          )}
        </ReactToPdf>
      </Menu>
    </React.Fragment>
  );
};

const Area2 = ({ data }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const ref = React.useRef();
  const doughnutRef = React.useRef();

  Chart.register(ArcElement, Tooltip, Legend);
  const dataset = {
    labels: [
      `Bikes (${data?.typeCount?.find(obj => obj.type === 1)?.count || 0})`,
      `Parts (${data?.typeCount?.find(obj => obj.type === 2)?.count || 0})`,
      `Bike Upgrade (${
        data?.appointmentCount?.find(obj => obj.type === 'upgrade')?.count || 0
      })`,
      `Bike Repair (${
        data?.appointmentCount?.find(obj => obj.type === 'repair')?.count || 0
      })`,
      `Bike Maintenance (${
        data?.appointmentCount?.find(obj => obj.type === 'maintenance')
          ?.count || 0
      })`,
    ],
    datasets: [
      {
        label: 'Activity',
        data: [
          data?.typeCount?.find(obj => obj.type === 1)?.count || 0,
          data?.typeCount?.find(obj => obj.type === 2)?.count || 0,
          data?.appointmentCount?.find(obj => obj.type === 'upgrade')?.count ||
            0,
          data?.appointmentCount?.find(obj => obj.type === 'repair')?.count ||
            0,
          data?.appointmentCount?.find(obj => obj.type === 'maintenance')
            ?.count || 0,
        ],
        backgroundColor: [
          blue[500],
          pink[500],
          yellow[500],
          indigo[500],
          green[500],
        ],
        borderColor: [
          blue[900],
          pink[900],
          yellow[900],
          indigo[900],
          green[900],
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <React.Fragment>
      <Grid item md={8} xs={12}>
        <Box
          component={Paper}
          p={2}
          height='100%'
          maxHeight={500}
          overflow='hidden auto'
          ref={ref}
          sx={{
            '&::-webkit-scrollbar': {
              width: 0,
            },
          }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <Typography variant='button'>top selling products</Typography>
            <ReactToPdf
              targetRef={ref}
              filename='top-selling-products.pdf'
              x={0}
              y={0}
              scale={1.8}
              options={{
                orientation: 'landscape',
                unit: 'px',
              }}>
              {({ toPdf }) => (
                <Button endIcon={<FileDownload />} onClick={toPdf}>
                  Export
                </Button>
              )}
            </ReactToPdf>
          </Stack>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.topSelling?.map((data, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{data['Products.name']}</TableCell>
                    <TableCell>
                      <NumberFormat
                        value={data.price}
                        displayType='text'
                        thousandSeparator
                        decimalScale={2}
                        fixedDecimalScale
                        decimalSeparator='.'
                        prefix='₱'
                      />
                    </TableCell>
                    <TableCell>{data.count}</TableCell>
                    <TableCell>
                      <NumberFormat
                        value={data.price * data.count}
                        displayType='text'
                        thousandSeparator
                        decimalScale={2}
                        fixedDecimalScale
                        decimalSeparator='.'
                        prefix='₱'
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Grid>
      <Grid item md={4} xs={12}>
        <Box
          component={Paper}
          p={2}
          height='100%'
          maxHeight={500}
          overflow='hidden auto'
          sx={{
            '&::-webkit-scrollbar': {
              width: 0,
            },
          }}
          ref={doughnutRef}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <Typography variant='subtitle1'>
              Products and Appointments
            </Typography>
            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
              <MoreVert />
            </IconButton>
          </Stack>
          <Doughnut
            data={dataset}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: 'top',
                  display: true,
                  align: 'center',
                  labels: {
                    boxWidth: 10,
                  },
                },
              },
            }}
          />
        </Box>
      </Grid>

      <Menu
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}>
        <ReactToPdf
          targetRef={doughnutRef}
          filename='top-selling-products.pdf'
          x={0}
          y={0}
          scale={1.5}
          options={{
            orientation: 'portrait',
            unit: 'px',
          }}>
          {({ toPdf }) => (
            <MenuItem
              onClick={() => {
                toPdf();
                setAnchorEl(null);
              }}>
              Download as PDF
            </MenuItem>
          )}
        </ReactToPdf>
      </Menu>
    </React.Fragment>
  );
};
