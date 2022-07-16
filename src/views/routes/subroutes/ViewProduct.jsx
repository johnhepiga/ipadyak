import {
  Box,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Checkbox,
  ListItemIcon,
  Collapse,
  FormHelperText,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  DialogContentText,
  Badge,
} from '@mui/material';
import { TabContext } from '@mui/lab';
import PropTypes from 'prop-types';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowForwardIos,
  ArrowBack,
  MoreVert,
  Close,
  Image,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import ShowMoreText from 'react-show-more-text';
import nl2br from 'react-nl2br';
import { grey, red } from '@mui/material/colors';
import FileIcon from '../../../files/file.png';

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ViewProduct({ onAction }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = React.useState({});
  const [display, setDisplay] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const [show, setShow] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const IMAGE_HEIGHT = 100;

  const list = {
    1: [
      {
        label: 'Product name',
        value: data?.name,
      },
      {
        label: 'Price',
        value: (
          <NumberFormat
            value={data?.price}
            displayType='text'
            decimalScale={2}
            fixedDecimalScale={2}
            thousandSeparator
            decimalSeparator='.'
            prefix='₱ '
          />
        ),
      },
      {
        label: 'Quantity',
        value: data?.quantity,
      },
    ],
    2: [
      {
        label: 'Product type',
        value: data?.type === 1 ? 'Bicycle' : 'Bike part',
      },
      {
        label: 'Added By',
        value: data?.addedBy?.firstname + ' ' + data?.addedBy?.lastname,
      },
      {
        label: 'Age range',
        value:
          data?.min_age && data?.max_age
            ? data?.min_age + ' to ' + data?.max_age
            : 'N/A',
      },
    ],
  };

  const handleClick = type => {
    setDisplay(type);
  };

  const fetchData = React.useCallback(() => {
    axios
      .get(
        `${process.env.REACT_APP_URL}products/get-product/${location.state.id}`,
        { withCredentials: true }
      )
      .then(({ data }) => {
        setDisplay(data?.variants[0]?.variant_type);
        setData(data);
      });
  }, [location.state]);

  React.useEffect(() => {
    if (!location.state) {
      navigate('/products');
    }
    fetchData();
  }, [fetchData, location.state, navigate]);

  const reload = () => fetchData();

  return (
    <Box flex={1} p={1}>
      <Grid
        container
        spacing={1}
        height='100%'
        flex={1}
        flexBasis={100}
        minHeight={0}
        overflow='hidden auto'
        sx={{
          '&::-webkit-scrollbar': {
            width: 0,
          },
        }}>
        <Grid item md={7} xs={12} zeroMinWidth height='100%'>
          <Stack component={Paper} height='100%'>
            <Stack
              p={1}
              overflow='hidden auto'
              flex={1}
              flexBasis={100}
              minHeight={0}>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'>
                <Stack
                  direction='row'
                  alignItems='center'
                  width='fit-content'
                  mx={2}
                  mb={1}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate('/products', { replace: true })}>
                  <ArrowBack fontSize='small' />{' '}
                  <Typography variant='subtitle1'>
                    Return to products
                  </Typography>
                </Stack>
                <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                  <MoreVert />
                </IconButton>
              </Stack>
              <Stack
                direction='row'
                gap={0.2}
                flex={1}
                flexBasis={0}
                minHeight={0}>
                <Box
                  flex={1}
                  flexBasis={0}
                  minWidth={0}
                  position='relative'
                  overflow='hidden'
                  sx={{
                    '&:hover .delete-btn': {
                      transform: 'translateY(120px)',
                    },
                  }}>
                  <img
                    src={
                      display &&
                      process.env.REACT_APP_UPLOAD_URL +
                        data?.variants?.find(
                          obj => obj.variant_type === display
                        )?.variants[index]?.upload?.value
                    }
                    alt='selected product'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      aspectRatio: '9/16',
                    }}
                  />
                </Box>
                <Stack
                  width={IMAGE_HEIGHT}
                  justifyContent='space-between'
                  alignItems='center'>
                  <Stack
                    flex={1}
                    flexBasis={0}
                    minHeight={0}
                    overflow='hidden auto'
                    sx={{
                      '&::-webkit-scrollbar': {
                        width: 0,
                      },
                    }}>
                    <Box my='auto'>
                      {data?.variants
                        ?.find(obj => obj.variant_type === display)
                        ?.variants?.map(({ upload }, i) => {
                          return (
                            <Box
                              key={i}
                              height={IMAGE_HEIGHT}
                              width='100%'
                              onClick={() => setIndex(i)}
                              sx={{ cursor: 'pointer' }}>
                              <img
                                src={
                                  process.env.REACT_APP_UPLOAD_URL +
                                  upload?.value
                                }
                                alt={upload?.value}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  objectFit: 'cover',
                                  aspectRatio: '1/1',
                                }}
                              />
                            </Box>
                          );
                        })}
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction='row' alignItems='center'>
                <Stack
                  gap={0.5}
                  flexWrap='nowrap'
                  direction='row'
                  overflow='auto hidden'
                  justifyContent='center'
                  mx={1}
                  flex={1}
                  mt={1}>
                  <Stack
                    mx='auto'
                    direction='row'
                    overflow='auto'
                    flexWrap='nowrap'
                    sx={{
                      '&::-webkit-scrollbar': {
                        height: 18,
                      },
                      '&::-webkit-scrollbar-thumb': {
                        border: '6px solid #0000',
                        backgroundClip: 'padding-box',
                        bgcolor: grey[500],
                        borderRadius: 3,
                      },
                    }}>
                    {data?.variants?.map(({ variant_type, color }, i) => {
                      return (
                        <Box
                          height={50}
                          width={50}
                          bgcolor={color}
                          mx={0.3}
                          onClick={() => handleClick(variant_type)}
                          component={Button}
                          key={i}
                        />
                      );
                    })}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid item md={5} xs={12} zeroMinWidth height='100%'>
          <Stack component={Paper} height='100%'>
            <Box
              p={1}
              overflow='hidden auto'
              flex={1}
              flexBasis={100}
              minHeight={0}>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'>
                <Typography variant='body1' textTransform='uppercase'>
                  Product Information
                </Typography>
                <EditInfo
                  data={data}
                  id={location.state.id}
                  onAction={onAction}
                  onReload={reload}
                />
              </Stack>
              <Divider />
              <Grid container>
                {Object.keys(list).map(key => {
                  return (
                    <Grid item md={6} key={key}>
                      <List disablePadding>
                        {list[key].map(({ label, value }, i) => {
                          return (
                            <ListItem key={i}>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant='caption'
                                    textTransform='uppercase'>
                                    {label}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant='subtitle1' noWrap>
                                    {value}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>
                  );
                })}
              </Grid>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant='caption' textTransform='uppercase'>
                      Description
                    </Typography>
                  }
                />
              </ListItem>
              <Container maxWidth='lg'>
                <ShowMoreText
                  lines={3}
                  more='Show more'
                  less='Show less'
                  expanded={false}
                  truncatedEndingComponent={'... '}
                  anchorClass='custom-anchor-class'>
                  {nl2br(data?.description)}
                </ShowMoreText>
              </Container>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'>
                <Typography variant='body1' textTransform='uppercase'>
                  Tags
                </Typography>
                <EditTags
                  current={data?.tags}
                  id={location.state.id}
                  onAction={onAction}
                  onReload={reload}
                />
              </Stack>
              <Divider />
              <Stack direction='row' flexWrap='wrap' gap={1} my={1}>
                {data?.tags?.map((tag, i) => {
                  return <Chip label={tag.value} key={i} />;
                })}
              </Stack>

              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'>
                <Typography variant='body1' textTransform='uppercase'>
                  Add ons
                </Typography>
                <NewAddOn
                  id={location.state.id}
                  onReload={fetchData}
                  onAction={onAction}
                />
              </Stack>
              <Divider />
              {data?.addons?.length > 0 ? (
                data?.addons?.map((data, i) => (
                  <Addon
                    data={data}
                    onAction={onAction}
                    onReload={fetchData}
                    index={i}
                    key={i}
                  />
                ))
              ) : (
                <Typography variant='h6' textAlign='center' p={2}>
                  No add ons
                </Typography>
              )}
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <Menu
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setShow('add');
          }}>
          Add images
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setShow('delete');
          }}>
          Delete images
        </MenuItem>
      </Menu>

      <Dialog
        open={show === 'add' || show === 'delete'}
        onClose={() => setShow('')}
        fullWidth
        maxWidth='sm'>
        {show === 'add' ? (
          <AddImages
            id={location.state.id}
            onClose={() => setShow('')}
            onReload={reload}
            onAction={onAction}
          />
        ) : show === 'delete' ? (
          <DeleteImages
            images={data?.variants}
            onClose={() => setShow('')}
            onReload={reload}
            onAction={onAction}
            id={location.state.id}
          />
        ) : null}
      </Dialog>
    </Box>
  );
}

function EditInfo({ data, id, onAction, onReload }) {
  const [show, setShow] = React.useState(false);
  const [edit, setEdit] = React.useState({
    name: '',
    price: '',
    quantity: '',
    ages: null,
    description: '',
  });
  const [checked, setChecked] = React.useState(false);

  const MIN_DISTANCE = 10;

  const handleAgeRange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) return;
    let temp = edit.ages;
    if (activeThumb === 0) {
      temp = [Math.min(newValue[0], edit.ages[1] - MIN_DISTANCE), edit.ages[1]];
      setEdit({ ...edit, ages: temp });
    } else {
      temp = [edit.ages[0], Math.max(newValue[1], edit.ages[0] + MIN_DISTANCE)];
      setEdit({ ...edit, ages: temp });
    }
  };

  const handleSubmit = () => {
    axios
      .patch(
        `${process.env.REACT_APP_URL}products/update-product-info/${id}`,
        edit,
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setEdit({
          name: '',
          price: '',
          quantity: '',
          ages: null,
          description: '',
        });
        setShow(false);
        onAction(data);
        onReload();
      });
  };

  const handleAgeToggle = e => {
    setChecked(!checked);
    if (!checked) {
      setEdit({ ...edit, ages: [3, 13] });
      return;
    }
    setEdit({ ...edit, ages: null });
  };

  const handleClose = () => {
    setShow(false);
    setEdit({
      name: data?.name,
      price: data?.price,
      quantity: data?.quantity,
      ages:
        data?.min_age && data?.max_age ? [data?.min_age, data?.max_age] : null,
      description: data?.description,
    });
    setChecked(data?.min_age && data?.max_age ? true : false);
  };

  React.useEffect(() => {
    setEdit({
      name: data?.name,
      price: data?.price,
      quantity: data?.quantity,
      ages:
        data?.min_age && data?.max_age ? [data?.min_age, data?.max_age] : null,
      description: data?.description,
    });
    setChecked(data?.min_age && data?.max_age ? true : false);
  }, [data]);

  return (
    <React.Fragment>
      <Button onClick={() => setShow(true)}>Edit</Button>
      <Dialog open={show} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>Update Product Information</DialogTitle>
        <DialogContent dividers>
          <Box py={1}>
            <Box my={1}>
              <TextField
                type='text'
                value={edit?.name}
                onChange={e => setEdit({ ...edit, name: e.target.value })}
                label='Product name'
                fullWidth
              />
            </Box>
            <Box my={1}>
              <TextField
                type='number'
                label='Price'
                value={edit?.price}
                onChange={e => setEdit({ ...edit, price: e.target.value })}
                fullWidth
              />
            </Box>
            <Box my={1}>
              <TextField
                value={edit?.quantity}
                onChange={e => setEdit({ ...edit, quantity: e.target.value })}
                label='Quantity'
                fullWidth
              />
            </Box>
            {data?.type === 1 ? (
              <Box my={1}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'>
                  <Typography variant='subtitle2'>
                    Age range (
                    {checked
                      ? edit?.ages && edit?.ages[0] + '-' + edit?.ages[1]
                      : 'N/A'}
                    )
                  </Typography>
                  <Checkbox checked={checked} onClick={handleAgeToggle} />
                </Stack>
                {checked ? (
                  <Box px={1}>
                    <Slider
                      getAriaLabel={() => 'Minimum distance'}
                      value={edit?.ages ? edit?.ages : [3, 100]}
                      onChange={handleAgeRange}
                      valueLabelDisplay='auto'
                      min={3}
                      max={100}
                      disableSwap
                    />
                  </Box>
                ) : null}
              </Box>
            ) : null}
            <Box my={1}>
              <TextField
                type='text'
                multiline
                rows={5}
                value={edit?.description}
                label='Description'
                fullWidth
                onInput={e => setEdit({ ...edit, description: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant='contained' color='success' onClick={handleSubmit}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function EditTags({ current, id, onAction, onReload }) {
  const [open, setOpen] = React.useState(false);
  const [tags, setTags] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [errors, setErrors] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      axios
        .get(`${process.env.REACT_APP_URL}products/get-tags-list`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          setTags(data);
        });
    })();
    setSelected(current);
  }, [current]);

  const handleClose = () => {
    setOpen(false);
    setSelected(current);
  };

  const handleSelect = data => {
    setSelected([...selected, data]);
  };

  const handleRemove = id => {
    setSelected(selected.filter(obj => obj.id !== id));
  };

  const handleSubmit = () => {
    setErrors([]);
    axios
      .patch(
        `${process.env.REACT_APP_URL}products/update-product-tags/${id}`,
        { tags: selected },
        { withCredentials: true }
      )
      .then(({ data }) => {
        setSelected([]);
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
      <Button onClick={() => setOpen(true)}>Edit</Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle>Update Tags</DialogTitle>
        <DialogContent
          dividers
          sx={{
            '&::-webkit-scrollbar': {
              width: 6,
              borderRadius: 3,
            },
            '&::-webkit-scrollbar-thumb': {
              width: 6,
              borderRadius: 3,
              bgcolor: grey[900],
            },
            '&::-webkit-scrollbar-track': {
              width: 6,
              borderRadius: 3,
              bgcolor: grey[500],
            },
          }}>
          <Grid container spacing={1}>
            <Grid item md={8} xs={12}>
              <FormHelperText
                error={errors?.some(obj => obj.param === 'tags')}
                sx={{ textAlign: 'center' }}>
                {errors?.find(obj => obj.param === 'tags')?.msg}
              </FormHelperText>
              <Stack direction='row' flexWrap='wrap' gap={1}>
                {selected?.map((tag, i) => {
                  return (
                    <Chip
                      label={tag.value}
                      key={i}
                      onDelete={() => handleRemove(tag.id)}
                    />
                  );
                })}
              </Stack>
            </Grid>
            <Grid item md={4} xs={12}>
              <Stack>
                <Box
                  p={1}
                  overflow='hidden auto'
                  flex={1}
                  flexBasis={0}
                  minHeight={400}
                  sx={{
                    '&::-webkit-scrollbar': {
                      width: 6,
                      borderRadius: 3,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      width: 6,
                      borderRadius: 3,
                      bgcolor: grey[900],
                    },
                    '&::-webkit-scrollbar-track': {
                      width: 6,
                      borderRadius: 3,
                      bgcolor: grey[500],
                    },
                  }}>
                  {Object.keys(tags).map(key => {
                    return (
                      <CollapsingTags
                        data={tags[key]}
                        key={key}
                        type={key}
                        onSelect={handleSelect}
                        selected={selected}
                      />
                    );
                  })}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>cancel</Button>
          <Button variant='contained' color='success' onClick={handleSubmit}>
            update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function CollapsingTags({ data, type, onSelect, selected }) {
  const [open, setOpen] = React.useState(true);

  let title;

  switch (type) {
    case 'bikes':
      title = 'Bike types';
      break;
    case 'cyclists':
      title = 'Cyclist types';
      break;
    case 'genders':
      title = 'Gender';
      break;
    case 'experiences':
      title = 'Experience level';
      break;
    default:
      break;
  }

  return (
    <React.Fragment>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemIcon>
          <ArrowForwardIos
            sx={{
              transform: `rotate(${open ? 90 : 0}deg)`,
              transition: 'transform 200ms ease-in',
            }}
          />
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
      <Divider />
      <Collapse in={open} timeout='auto' unmountOnExit>
        <Box px={1} overflow='hidden auto'>
          <List disablePadding>
            {data?.map(({ value, id }, i) => {
              return (
                !selected.some(obj => obj.id === id) && (
                  <React.Fragment key={i}>
                    <ListItem
                      button
                      onClick={() => onSelect({ id, value, type })}>
                      <ListItemText primary={value} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                )
              );
            })}
          </List>
        </Box>
      </Collapse>
    </React.Fragment>
  );
}

function DeleteImages({ images, onClose, onAction, onReload, id }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [toRemove, setToRemove] = React.useState([]);
  const [errors, setErrors] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDelete = () => {
    setErrors([]);
    axios
      .patch(
        `${process.env.REACT_APP_URL}products/delete-product-images/${id}`,
        { toRemove },
        { withCredentials: true }
      )
      .then(({ data }) => {
        setToRemove([]);
        setOpen(false);
        onClose();
        onAction(data, 'error');
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
        setOpen(false);
      });
  };

  const handleToRemove = id => {
    let temp = toRemove;
    if (temp?.some(data => data === id)) {
      temp = temp?.filter(data => data !== id);
      setToRemove(temp);
    } else {
      setToRemove([...toRemove, id]);
    }
  };

  return (
    <React.Fragment>
      <BootstrapDialogTitle onClose={onClose}>
        Remove Image
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography variant='subtitle1'>Select images to remove</Typography>
        <TabContext value='Images tabs'>
          <Tabs
            value={value}
            onChange={handleChange}
            variant='scrollable'
            scrollButtons='auto'
            aria-label='scrollable auto tabs'
            sx={{ '& .MuiTabs-indicator': { display: 'none' } }}>
            {images?.map(({ color, variant_type }, i) => {
              return (
                <Tab
                  label={
                    <Typography
                      sx={{
                        borderBottom: `${
                          value === i ? '6px' : '3px'
                        } solid ${color}`,
                      }}>
                      {variant_type}
                    </Typography>
                  }
                  {...a11yProps(i)}
                  key={variant_type}
                />
              );
            })}
          </Tabs>
          {images?.map(({ variants }, i) => {
            return (
              <TabPanel value={value} key={i} index={i}>
                <Grid container spacing={1}>
                  {variants?.map(({ upload }) => {
                    return (
                      <ImageView
                        key={upload.id}
                        data={upload}
                        isChecked={toRemove?.some(id => id === upload?.id)}
                        onRemove={handleToRemove}
                      />
                    );
                  })}
                </Grid>
              </TabPanel>
            );
          })}
        </TabContext>
        <FormHelperText
          sx={{ textAlign: 'center' }}
          error={errors?.some(obj => obj.param === 'toRemove')}>
          {errors?.find(obj => obj.param === 'toRemove')?.msg}
        </FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>cancel</Button>
        <Button onClick={() => setOpen(true)} variant='contained' color='error'>
          delete
        </Button>
      </DialogActions>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to remove these images?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>cancel</Button>
          <Button onClick={handleDelete} variant='contained' color='error'>
            confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function AddImages({ id, onClose, onReload, onAction }) {
  const [variants, setVariants] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [images, setImages] = React.useState([]);
  const [errors, setErrors] = React.useState([]);

  const handleAddImage = (e, id, variant) => {
    if (!e.target.files[0]) return;
    setImages([...images, { id, variant, image: e.target.files[0] }]);
    e.target.value = '';
  };

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleRemoveImage = () => {};

  const handleAdd = () => {
    const formData = new FormData();
    images.forEach(({ image, id }) => {
      formData.append('images', image);
    });
    formData.append('ids', JSON.stringify(images));
    axios
      .post(
        `${process.env.REACT_APP_URL}products/add-product-images/${id}`,
        formData,
        { withCredentials: true }
      )
      .then(({ data }) => {
        setImages([]);
        setValue(0);
        onClose();
        onAction(data);
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  React.useEffect(() => {
    (async () => {
      axios
        .get(`${process.env.REACT_APP_URL}products/get-variants-list`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          setVariants(data);
        });
    })();
  }, [images]);

  return (
    <React.Fragment>
      <BootstrapDialogTitle onClose={onClose}>
        Add new images
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <TabContext value='Images tabs'>
          <Tabs
            value={value}
            onChange={handleChange}
            variant='scrollable'
            scrollButtons='auto'
            aria-label='scrollable auto tabs'
            sx={{ '& .MuiTabs-indicator': { display: 'none' } }}>
            {variants?.map((variant, i) => {
              return (
                <Tab
                  label={
                    <Typography
                      sx={{
                        borderBottom: `${value === i ? '6px' : '3px'} solid ${
                          variant.description
                        }`,
                      }}>
                      {variant.value}
                    </Typography>
                  }
                  {...a11yProps(i)}
                  key={variant.value}
                />
              );
            })}
          </Tabs>
          {variants?.map((data, i) => {
            return (
              <TabPanel value={value} key={i} index={i}>
                <Grid container spacing={1}>
                  {images?.map(({ image, variant }, i) => {
                    return (
                      variant === data.value && (
                        <Grid item xs={4} key={i}>
                          <Box
                            width='100%'
                            height='150'
                            sx={{
                              position: 'relative',
                              aspectRatio: '1/1',
                              background: `url(${
                                image?.type?.split('/')[0] === 'image'
                                  ? URL.createObjectURL(image)
                                  : FileIcon
                              }) no-repeat center`,
                              backgroundSize: 'cover',
                              '&:before': {
                                fontFamily: 'Material Icons',
                                content: '"delete"',
                                position: 'absolute',
                                inset: 0,
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '3em',
                                opacity: 0,
                                transition: 'opacity 150ms linear',
                                cursor: 'pointer',
                                bgcolor: '#0008',
                                color: red[500],
                              },
                              '&:hover:before': {
                                opacity: 1,
                              },
                            }}
                            onClick={() => handleRemoveImage(i)}
                          />
                        </Grid>
                      )
                    );
                  })}
                  <Grid item xs={4}>
                    <label htmlFor='select'>
                      <Box
                        width='100%'
                        height='150'
                        sx={{
                          position: 'relative',
                          aspectRatio: '1/1',
                          background: `url(https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png) no-repeat center`,
                          backgroundSize: 'cover',
                          '&:before': {
                            fontFamily: 'Material Icons',
                            content: '"add"',
                            position: 'absolute',
                            inset: 0,
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '3em',
                            opacity: 0,
                            transition: 'opacity 150ms linear',
                            cursor: 'pointer',
                            bgcolor: '#0008',
                          },
                          '&:hover:before': {
                            opacity: 1,
                          },
                        }}
                      />
                      <input
                        type='file'
                        id='select'
                        hidden
                        onInput={e => handleAddImage(e, data.id, data.value)}
                      />
                    </label>
                  </Grid>
                </Grid>
              </TabPanel>
            );
          })}
        </TabContext>
        <FormHelperText error={errors?.file ? true : false}>
          {errors?.file}
        </FormHelperText>
        <FormHelperText
          error={
            Array.isArray(errors) && errors?.some(obj => obj.param === 'ids')
          }>
          {Array.isArray(errors) &&
            errors?.some(obj => obj.param === 'ids')?.msg}
        </FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>cancel</Button>
        <Button onClick={handleAdd} variant='contained' color='success'>
          confirm
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}

function ImageView({ data, isChecked, onRemove }) {
  const [checked, setChecked] = React.useState(isChecked);

  const handleRemove = e => {
    setChecked(!checked);
    onRemove(e.target.value);
  };

  React.useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  return (
    <Grid item xs={4}>
      <Stack
        position='relative'
        sx={{ height: 150, width: '100%', aspectRatio: '16/9' }}
        key={data.id}>
        <img
          src={process.env.REACT_APP_UPLOAD_URL + data.value}
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
          }}
          alt={data.value}
        />
        <Checkbox
          checked={checked}
          onInput={handleRemove}
          value={data.id}
          sx={{
            position: 'absolute',
            top: 1,
            right: 1,
            bgcolor: '#0006',
          }}
        />
      </Stack>
    </Grid>
  );
}

function NewAddOn({ id, onReload, onAction }) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
    image: null,
    title: '',
    options: [],
  });
  const [errors, setErrors] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const show = Boolean(anchorEl);
  const ref = React.useRef();

  const handleAddOption = () => {
    const array = data.options;
    array.push({ image: null, option: '', price: '' });
    setData({ ...data, options: array });
  };

  const handleRemove = i => {
    const array = data.options;
    array.splice(i, 1);
    setData({ ...data, options: array });
  };

  const handleOptions = (key, value, i) => {
    const array = data.options;
    array[i] = { ...array[i], [key]: value };
    setData({ ...data, options: array });
  };

  const handleImage = e => {
    setAnchorEl(null);
    if (!e.target.files[0]) return;
    setData({ ...data, image: e.target.files[0] });
    e.target.value = '';
  };

  const handleSubmit = () => {
    setErrors([]);
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('title', data.title);
    data.options.map(({ image }) => {
      if (image) {
        formData.append('images', image);
      }
      return null;
    });
    formData.append('options', JSON.stringify(data.options));
    axios
      .post(
        `${process.env.REACT_APP_URL}products/create-add-ons/${id}`,
        formData,
        { withCredentials: true }
      )
      .then(({ data }) => {
        setData({
          image: null,
          title: '',
          options: [],
        });
        setOpen(false);
        onAction(data);
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  const handleRemoveImage = () => {
    setAnchorEl(null);
    setData({ ...data, image: null });
  };

  const handleOptionImageRemove = i => {
    const array = data.options;
    array[i].image = null;
    setData({ ...data, options: array });
  };

  return (
    <React.Fragment>
      <Button onClick={() => setOpen(true)}>Add</Button>

      <Dialog
        open={open}
        onClose={() => {
          setData({
            image: null,
            title: '',
            options: [],
          });
          setOpen(false);
        }}
        fullWidth
        maxWidth='sm'>
        <BootstrapDialogTitle
          onClose={() => {
            setData({
              image: null,
              title: '',
              options: [],
            });
            setOpen(false);
          }}>
          New add on
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack direction='row' alignItems='center' columnGap={1}>
            {data.image ? (
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: 'solid 1px #cccc',
                  cursor: 'pointer',
                }}
                onClick={e => setAnchorEl(e.currentTarget)}
                src={
                  data?.image
                    ? data?.image?.type?.split('/')[0] === 'image'
                      ? URL.createObjectURL(data?.image)
                      : FileIcon
                    : null
                }
                component='img'
                alt='Main image'
              />
            ) : (
              <IconButton sx={{ mr: 1 }} onClick={() => ref?.current?.click()}>
                <Image />
              </IconButton>
            )}
            <input type='file' ref={ref} hidden onInput={handleImage} />
            <TextField
              label='Title'
              value={data.title}
              onInput={e => setData({ ...data, title: e.target.value })}
              fullWidth
              sx={{ flex: 1 }}
              error={
                Array.isArray(errors) &&
                errors?.some(obj => obj.param === 'title')
              }
              helperText={
                Array.isArray(errors) &&
                errors?.find(obj => obj.param === 'title')?.msg
              }
            />
          </Stack>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            mt={2}>
            <Typography variant='body1'>Options</Typography>
            <Button onClick={handleAddOption}>Add</Button>
          </Stack>
          {data.options.length > 0 ? (
            data.options.map((data, i) => (
              <OptionTextField
                current={data}
                i={i}
                key={i}
                onRemove={handleRemove}
                onUpdate={handleOptions}
                onImageRemove={handleOptionImageRemove}
              />
            ))
          ) : (
            <Typography variant='h6' my={2} textAlign='center'>
              No options added.
            </Typography>
          )}
          <FormHelperText error={true} sx={{ textAlign: 'center' }}>
            {Array.isArray(errors) &&
              errors?.find(obj => obj.param === 'options')?.msg}
          </FormHelperText>
          <FormHelperText error={true} sx={{ textAlign: 'center' }}>
            {errors?.file}
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setData({
                image: null,
                title: '',
                options: [],
              });
              setOpen(false);
            }}>
            cancel
          </Button>
          <Button onClick={handleSubmit} variant='contained' color='success'>
            confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        open={show}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <MenuItem onClick={() => ref.current.click()}>Change photo</MenuItem>
        <MenuItem onClick={handleRemoveImage}>Remove image</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

function EditAddOn({ id, onReload, onAction, onClose, current }) {
  const [data, setData] = React.useState({
    image: null,
    title: '',
    options: [],
  });
  const [errors, setErrors] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const ref = React.useRef();

  const handleAddOption = () => {
    const array = data.options;
    array.push({ image: null, option: '', price: '' });
    setData({ ...data, options: array });
  };

  const handleRemove = i => {
    const array = data.options;
    array.splice(i, 1);
    setData({ ...data, options: array });
  };

  const handleOptions = (key, value, i) => {
    const array = data.options;
    array[i] = { ...array[i], [key]: value };
    setData({ ...data, options: array });
  };

  const handleImage = e => {
    setAnchorEl(null);
    if (!e.target.files[0]) return;
    setData({ ...data, image: e.target.files[0] });
    e.target.value = '';
  };

  const handleSubmit = () => {
    setErrors([]);
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('title', data.title);
    data.options.map(({ image }) => {
      if (image) {
        formData.append('images', image);
      }
      return null;
    });
    formData.append('options', JSON.stringify(data.options));
    axios
      .put(
        `${process.env.REACT_APP_URL}products/edit-add-ons/${id}`,
        formData,
        { withCredentials: true }
      )
      .then(({ data }) => {
        setData({
          image: null,
          title: '',
          options: [],
        });
        onClose();
        onAction(data);
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  const handleOptionImageRemove = i => {
    const array = data.options;
    array[i].image = null;
    setData({ ...data, options: array });
  };

  React.useEffect(() => {
    setData(current);
  }, [current]);

  return (
    <React.Fragment>
      <BootstrapDialogTitle onClose={onClose}>Edit add on</BootstrapDialogTitle>
      <DialogContent dividers>
        <Stack direction='row' alignItems='center' columnGap={1}>
          {data.image ? (
            <Box
              sx={{
                width: 50,
                height: 50,
                objectFit: 'cover',
                borderRadius: '50%',
                border: 'solid 1px #cccc',
                cursor: 'pointer',
              }}
              onClick={e => setAnchorEl(e.currentTarget)}
              src={
                data?.image
                  ? typeof data?.image === 'object'
                    ? data?.image?.type?.split('/')[0] === 'image'
                      ? URL.createObjectURL(data?.image)
                      : FileIcon
                    : process.env.REACT_APP_UPLOAD_URL + data?.image?.value
                  : null
              }
              component='img'
              alt='Main image'
            />
          ) : (
            <IconButton sx={{ mr: 1 }} onClick={() => ref?.current?.click()}>
              <Image />
            </IconButton>
          )}
          <input type='file' ref={ref} hidden onInput={handleImage} />
          <TextField
            label='Title'
            value={data.title}
            onInput={e => setData({ ...data, title: e.target.value })}
            fullWidth
            sx={{ flex: 1 }}
            error={
              Array.isArray(errors) &&
              errors?.some(obj => obj.param === 'title')
            }
            helperText={
              Array.isArray(errors) &&
              errors?.find(obj => obj.param === 'title')?.msg
            }
          />
        </Stack>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mt={2}>
          <Typography variant='body1'>Options</Typography>
          <Button onClick={handleAddOption}>Add</Button>
        </Stack>
        {data.options.length > 0 ? (
          data.options.map((data, i) => (
            <OptionTextField
              current={data}
              i={i}
              key={i}
              onRemove={handleRemove}
              onUpdate={handleOptions}
              onImageRemove={handleOptionImageRemove}
            />
          ))
        ) : (
          <Typography variant='h6' my={2} textAlign='center'>
            No options added.
          </Typography>
        )}
        <FormHelperText error={true} sx={{ textAlign: 'center' }}>
          {Array.isArray(errors) &&
            errors?.find(obj => obj.param === 'options')?.msg}
        </FormHelperText>
        <FormHelperText error={true} sx={{ textAlign: 'center' }}>
          {errors?.file}
        </FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>cancel</Button>
        <Button onClick={handleSubmit} variant='contained' color='success'>
          update
        </Button>
      </DialogActions>

      <Menu
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <MenuItem onClick={() => ref.current.click()}>Change photo</MenuItem>
        <MenuItem
          onClick={() => {
            setData({ ...data, image: null });
            setAnchorEl(null);
          }}>
          Remove image
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

function OptionTextField({ current, i, onRemove, onUpdate, onImageRemove }) {
  const ref = React.useRef();
  const [data, setData] = React.useState({
    image: null,
    option: '',
    price: '',
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleImage = e => {
    setAnchorEl(null);
    if (!e.target.files[0]) return;
    setData({ ...data, image: e.target.files[0] });
    onUpdate('image', e.target.files[0], i);
    e.target.value = '';
  };

  React.useEffect(() => {
    setData(current);
  }, [current]);

  return (
    <React.Fragment>
      <Stack direction='row' alignItems='center' my={1} columnGap={1}>
        {data.image ? (
          <Box
            sx={{
              width: 50,
              height: 50,
              objectFit: 'cover',
              borderRadius: '50%',
              border: 'solid 1px #cccc',
              cursor: 'pointer',
            }}
            onClick={e => setAnchorEl(e.currentTarget)}
            component='img'
            src={
              data?.image
                ? data?.image?.value
                  ? process.env.REACT_APP_UPLOAD_URL + data?.image?.value
                  : data?.image?.type?.split('/')[0] === 'image'
                  ? URL.createObjectURL(data?.image)
                  : FileIcon
                : null
            }
            alt={`option image ${i}`}
          />
        ) : (
          <IconButton sx={{ mr: 1 }} onClick={() => ref?.current?.click()}>
            <Image />
          </IconButton>
        )}
        <input
          type='file'
          ref={ref}
          accept='image/*'
          hidden
          onInput={handleImage}
        />
        <TextField
          type='text'
          label='Option'
          value={data.option}
          sx={{ flex: 1 }}
          onInput={e => {
            setData({ ...data, option: e.target.value });
            onUpdate('option', e.target.value, i);
          }}
        />
        <TextField
          type='number'
          label='Price'
          value={data.price}
          sx={{ width: 100 }}
          onInput={e => {
            setData({ ...data, price: e.target.value });
            onUpdate('price', e.target.value, i);
          }}
        />
        <IconButton size='sm' onClick={() => onRemove(i)}>
          <Close />
        </IconButton>
      </Stack>

      <Menu
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <MenuItem onClick={() => ref.current.click()}>Change photo</MenuItem>
        <MenuItem
          onClick={() => {
            onImageRemove(i);
            setAnchorEl(null);
          }}>
          Remove image
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

function Addon({ data, onAction, onReload }) {
  const [expanded, setExpanded] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [show, setShow] = React.useState(false);
  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <Box p={1}>
        <Stack
          direction='row'
          p={1}
          alignItems='center'
          columnGap={1}
          component={Paper}
          elevation={3}>
          {data?.image && (
            <Avatar
              alt={data?.title}
              src={process.env.REACT_APP_UPLOAD_URL + data?.image?.value}
              sx={{ height: 40, width: 40 }}
            />
          )}
          <Typography variant='h6' sx={{ flex: 1 }}>
            {data?.title}{' '}
            {data.isRemoved === 1 ? (
              <Chip label='Removed' size='small' color='error' />
            ) : (
              <Chip label='Active' size='small' color='success' />
            )}
          </Typography>
          <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Stack>
        <Collapse in={expanded} timeout='auto' unmountOnExit component={Paper}>
          <List>
            {data?.options?.map(({ id, image, option, price }) => (
              <ListItem key={id}>
                {image && (
                  <ListItemIcon>
                    <Avatar
                      alt={image?.value}
                      src={process.env.REACT_APP_UPLOAD_URL + image?.value}
                    />
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={option}
                  secondary={
                    <>
                      +{' '}
                      <NumberFormat
                        displayType='text'
                        value={price}
                        thousandSeparator
                        decimalScale={2}
                        fixedDecimalScale
                        decimalSeparator='.'
                        prefix='₱'
                      />
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        {data.isRemoved === 0 ? (
          <MenuItem
            onClick={() => {
              setShow('delete');
              setAnchorEl(null);
            }}>
            Delete add on
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setShow('retrieve');
              setAnchorEl(null);
            }}>
            Retrieve add on
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setShow('edit');
            setAnchorEl(null);
          }}>
          Edit add on
        </MenuItem>
      </Menu>

      <Dialog
        open={show === 'edit' || show === 'delete' || show === 'retrieve'}
        onClose={() => setShow('')}
        fullWidth
        maxWidth={show === 'edit' ? 'sm' : 'xs'}>
        {show === 'delete' ? (
          <DeleteAddon
            onAction={onAction}
            onReload={onReload}
            id={data.id}
            onClose={() => setShow('')}
          />
        ) : show === 'retrieve' ? (
          <RetrieveAddon
            onAction={onAction}
            onReload={onReload}
            id={data.id}
            onClose={() => setShow('')}
          />
        ) : show === 'edit' ? (
          <EditAddOn
            onReload={onReload}
            onAction={onAction}
            id={data.id}
            current={data}
            onClose={() => setShow('')}
          />
        ) : null}
      </Dialog>
    </React.Fragment>
  );
}

function DeleteAddon({ onAction, onClose, onReload, id }) {
  const handleDelete = () => {
    axios
      .put(
        `${process.env.REACT_APP_URL}products/remove-add-on/${id}`,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => {
        onClose();
        onAction(data, 'error');
        onReload();
      })
      .catch(e => {
        onAction('Something went wrong', 'error');
      });
  };

  return (
    <React.Fragment>
      <DialogTitle>Delete add on</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove this add on?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>cancel</Button>
        <Button onClick={handleDelete} variant='contained' color='error'>
          confirm
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}

function RetrieveAddon({ onAction, onClose, onReload, id }) {
  const handleRetrieve = () => {
    axios
      .put(
        `${process.env.REACT_APP_URL}products/retrieve-add-on/${id}`,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => {
        onClose();
        onAction(data);
        onReload();
      })
      .catch(e => {
        onAction('Something went wrong', 'error');
      });
  };

  return (
    <React.Fragment>
      <DialogTitle>Retrieve add on</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to retrieve this add on?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>cancel</Button>
        <Button onClick={handleRetrieve} variant='contained' color='success'>
          confirm
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
