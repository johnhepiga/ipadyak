import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Avatar,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  DialogContentText,
  FormHelperText,
  IconButton,
  Tooltip,
  TextField,
  Chip,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import Moment from 'react-moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DoNotDisturb } from '@mui/icons-material';
import { TimePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import SocketContext from '../../context/socket';
import { useSelector } from 'react-redux';

export default function Calendar({ onAction }) {
  const [appointments, setAppointments] = React.useState([]);
  const [reminders, setReminders] = React.useState([]);
  const [open, setOpen] = React.useState('');
  const [event, setEvent] = React.useState(0);
  const [date, setDate] = React.useState(new Date());

  const handleEventClick = id => {
    setEvent(id);
    setOpen('event');
  };

  const handleDateClick = e => {
    setOpen('reminder');
    setDate(e.date);
  };

  const handleReminderClick = id => {
    setEvent(id);
    setOpen('view-reminder');
  };

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_URL}appointments/get-appointments`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        const { appointments, reminders } = data;
        setAppointments(appointments);
        setReminders(reminders);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box p={1} flex={1} minHeight={0} overflow='hidden auto'>
      <Grid container spacing={1} height='100%'>
        <Grid item lg={9} md={8} xs={12} height='100%'>
          <Stack height='100%' overflow='hidden auto' component={Paper} p={1}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              dateClick={handleDateClick}
              height='100%'
              allDaySlot={false}
              initialView='dayGridMonth'
              events={[
                ...reminders?.map(({ id, datetime }) => ({
                  title: 'Reminder',
                  date: datetime,
                  id,
                })),
                ...appointments?.map(({ id, datetime, type }) => ({
                  title: type?.value,
                  date: datetime,
                  id,
                })),
              ]}
              eventClick={e =>
                appointments.some(obj => obj.id === e.event.id)
                  ? handleEventClick(e.event.id)
                  : handleReminderClick(e.event.id)
              }
            />
          </Stack>
        </Grid>
        <Grid item lg={3} md={4} xs={12} height='100%'>
          <Stack component={Paper} flex={1} height='100%'>
            <Stack flex={1}>
              <Box
                flex={1}
                flexBasis={100}
                minHeight={100}
                p={0.5}
                overflow='hidden auto'
                sx={{
                  '&::-webkit-scrollbar': {
                    width: 10,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    border: 'solid 3px transparent',
                    bgcolor: grey[700],
                    backgroundClip: 'content-box',
                    borderRadius: 10,
                  },
                }}>
                {reminders?.map((data, i) => (
                  <AppointmentView
                    key={i}
                    data={data}
                    i={i}
                    onEventClick={handleReminderClick}
                  />
                ))}
                {appointments?.map((data, i) => (
                  <AppointmentView
                    key={i}
                    data={data}
                    i={i}
                    onEventClick={handleEventClick}
                  />
                ))}
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Dialog
        open={
          open === 'event' || open === 'reminder' || open === 'view-reminder'
        }
        onClose={() => setOpen('')}
        fullWidth
        sx={{
          ...(open === 'reminder' && {
            '& .MuiPaper-root': {
              position: 'absolute',
              top: 2,
            },
          }),
        }}
        maxWidth='xs'>
        {open === 'event' || open === 'view-reminder' ? (
          <ViewEvent
            data={
              open === 'event'
                ? appointments.find(obj => obj.id === parseInt(event))
                : reminders.find(obj => obj.id === parseInt(event))
            }
            onClose={() => setOpen('')}
            onAction={onAction}
            onReload={fetchData}
          />
        ) : open === 'reminder' ? (
          <AddReminder
            onReload={fetchData}
            onAction={onAction}
            onClose={() => setOpen('')}
            date={date}
          />
        ) : null}
      </Dialog>
    </Box>
  );
}

function ViewEvent({ data, onClose, onAction, onReload }) {
  const log = useSelector(state => state.LOG);
  const { setter, type, datetime, id, isNoShow, reason } = data;
  const { handleReload } = React.useContext(SocketContext);
  const [open, setOpen] = React.useState(false);
  const [errors, setErrors] = React.useState([]);

  const handleNoShow = () => {
    axios
      .patch(
        `${process.env.REACT_APP_URL}appointments/set-no-show/${id}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setOpen(false);
        onClose();
        onAction(data, 'error');
        onReload();
        handleReload(true);
      })
      .catch(e => {
        const { data } = e.response;
        if (Array.isArray(data)) {
          return setErrors(data);
        }
        onAction('Something went wrong.', 'error');
      });
  };

  const handleDelete = () => {
    axios
      .delete(
        `${process.env.REACT_APP_URL}appointments/delete-reminder/${id}`,
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setOpen(false);
        onClose();
        onAction(data, 'error');
        onReload();
      })
      .catch(e => {
        onAction('Something went wrong.', 'error');
      });
  };

  return (
    <React.Fragment>
      <React.Fragment>
        <DialogTitle>Appointment</DialogTitle>
        <DialogContent>
          <Paper elevation={2}>
            <Stack direction='row' p={1} columnGap={1} alignItems='center'>
              <Avatar
                alt={setter?.firstname + ' ' + setter?.lastname}
                src={
                  setter?.profile &&
                  process.env.REACT_APP_UPLOAD_URL + setter?.profile?.value
                }
                sx={{ height: 56, width: 56 }}
              />
              <Box flex={1}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'>
                  <Typography variant='body1' noWrap>
                    {setter.firstname + ' ' + setter.lastname}
                  </Typography>
                  {type === 'reminder' ? (
                    <Chip
                      label={setter.level === 1 ? 'Admin' : 'Staff'}
                      color={setter.level === 1 ? 'error' : 'info'}
                      size='small'
                    />
                  ) : null}
                  {isNoShow === 1 ? (
                    <Tooltip title='Tagged as no show' placement='top' arrow>
                      <IconButton size='small' color='error'>
                        <DoNotDisturb fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Stack>
                <Typography variant='body2'>{setter.email}</Typography>
                <Typography variant='body2'>
                  {setter.number
                    ? '+63 ' +
                      `${setter.number.substring(0, 3)} ` +
                      `${setter.number.substring(3, 7)} ` +
                      setter.number.substring(7)
                    : 'No number registered'}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {type !== 'reminder' ? (
            <>
              <Typography variant='body1'>
                {setter?.firstname + ' ' + setter?.lastname} has set an
                appointment of {type?.value} on{' '}
                <Moment format='MMMM DD, YYYY \at hh:mm a'>{datetime}</Moment>
              </Typography>
              <br />
              <Typography variant='body2'>
                Description: <br />
                {type?.description}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant='body1'>
                {setter?.firstname + ' ' + setter?.lastname} has set a reminder
                for{' '}
                <Moment format='MMMM DD, YYYY \at hh:mm a'>{datetime}</Moment>
              </Typography>
              {reason ? (
                <>
                  <br />
                  <Typography variant='body2'>Message</Typography>
                  <Typography variant='body2'>{reason?.reason}</Typography>
                </>
              ) : null}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          {type === 'reminder' && log?.user[0]?.id === setter?.id ? (
            <Button onClick={() => setOpen(true)} color='error'>
              Delete Reminder
            </Button>
          ) : type !== 'reminder' ? (
            <Button onClick={() => setOpen(true)} color='error'>
              Set as no show
            </Button>
          ) : null}
          <Button onClick={onClose} sx={{ ml: 'auto' }}>
            close
          </Button>
        </DialogActions>
      </React.Fragment>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {type !== 'reminder' ? 'Set as no show' : 'Delete Reminder'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to perform this action?
          </DialogContentText>
          <FormHelperText
            sx={{ textAlign: 'center' }}
            error={errors?.some(obj => obj.param === 'datetime')}>
            {errors?.find(obj => obj.param === 'datetime')?.msg}
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>cancel</Button>
          <Button
            onClick={type !== 'reminder' ? handleNoShow : handleDelete}
            variant='contained'
            color='error'>
            confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function AppointmentView({ data, i, onEventClick }) {
  const { setter, type, datetime, id, isNoShow } = data;
  return (
    <React.Fragment key={i}>
      <Paper
        key={i}
        elevation={3}
        sx={{ mb: 1, cursor: 'pointer' }}
        onClick={() => onEventClick(id)}>
        <Stack direction='row' p={1} columnGap={1} alignItems='center'>
          <Avatar
            alt={setter.firstname + ' ' + setter.lastname}
            src={
              setter.profile &&
              process.env.REACT_APP_UPLOAD_URL + setter.profile.value
            }
            sx={{ height: 56, width: 56 }}
          />
          <Box flex={1}>
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='center'>
              <Typography variant='body1' noWrap>
                {setter.firstname + ' ' + setter.lastname}
              </Typography>
              {isNoShow === 1 ? (
                <Tooltip title='Tagged as no show' placement='left' arrow>
                  <IconButton size='small' color='error'>
                    <DoNotDisturb fontSize='small' />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Stack>
            <Typography variant='body1'>{type?.value}</Typography>
            <Typography variant='caption' sx={{ display: 'block' }}>
              <Moment format='MMMM DD, YYYY \at hh:mm a'>{datetime}</Moment>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </React.Fragment>
  );
}

function AddReminder({ date, onReload, onAction, onClose }) {
  const [data, setData] = React.useState({ time: new Date(), text: '' });
  const [errors, setErrors] = React.useState([]);

  const handleAdd = () => {
    setErrors([]);
    data.date = date;
    axios
      .post(`${process.env.REACT_APP_URL}appointments/add-reminder`, data, {
        withCredentials: true,
      })
      .then(({ data }) => {
        onClose();
        onReload();
        onAction(data);
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  return (
    <React.Fragment>
      <DialogTitle>Add a reminder</DialogTitle>
      <DialogContent>
        <Box my={1}>
          <Typography variant='h6' sx={{ textAlign: 'center' }}>
            <Moment format='MMMM DD, YYYY'>{date}</Moment>
          </Typography>
          <FormHelperText
            sx={{ textAlign: 'center' }}
            error={
              Array.isArray(errors) && errors?.some(obj => obj.param === 'date')
            }>
            {Array.isArray(errors) &&
              errors?.find(obj => obj.param === 'date')?.msg}
          </FormHelperText>
        </Box>
        <Box my={1}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              value={data.time}
              onChange={newValue => {
                setData({ ...data, time: newValue });
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  fullWidth
                  error={
                    Array.isArray(errors) &&
                    errors?.some(obj => obj.param === 'time')
                  }
                  helperText={
                    Array.isArray(errors) &&
                    errors?.find(obj => obj.param === 'time')?.msg
                  }
                />
              )}
            />
          </LocalizationProvider>
        </Box>
        <Box my={1}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={data.text}
            onInput={e => setData({ ...data, text: e.target.value })}
            label='Reminder for (optional)'
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>cancel</Button>
        <Button onClick={handleAdd} variant='contained' color='success'>
          Set reminder
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
