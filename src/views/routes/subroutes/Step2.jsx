import React from 'react';
import {
  Box,
  Tab,
  Tabs,
  Stack,
  Paper,
  Grid,
  Typography,
  Button,
  FormHelperText,
} from '@mui/material';
import CreateProductContext from '../../../context';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Delete } from '@mui/icons-material';
import FileIcon from '../../../files/file.png';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ flex: 1, overflow: 'hidden auto' }}>
      {value === index && (
        <Box sx={{ p: 1, overflow: 'hidden auto' }}>{children}</Box>
      )}
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
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function Step2() {
  const { data, errors, handleStep2 } = React.useContext(CreateProductContext);
  const [tab, setTab] = React.useState(0);
  const [variants, setVariants] = React.useState([]);

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
  }, []);

  const handleAddImage = (e, id, variant) => {
    if (!e.target.files[0]) return;
    const images = data.step2;
    images.push({ id, variant, image: e.target.files[0] });
    handleStep2(images);
    e.target.value = '';
  };

  const handleUpdateImage = (e, index) => {
    if (!e.target.files[0]) return;
    const images = data.step2;
    images[index] = { ...images[index], image: e.target.files[0] };
    handleStep2(images);
    e.target.value = '';
  };

  const handleRemove = index => {
    const images = data.step2;
    images.splice(index, 1);
    handleStep2(images);
  };

  return (
    <Stack flex={1} height='100%' component={Paper}>
      <FormHelperText
        sx={{ textAlign: 'center' }}
        error={errors?.file ? true : false}>
        {errors?.file}
      </FormHelperText>
      <FormHelperText
        sx={{ textAlign: 'center' }}
        error={
          Array.isArray(errors) && errors?.some(obj => obj.param === 'variants')
        }>
        {Array.isArray(errors) &&
          errors?.find(obj => obj.param === 'variants')?.msg}
      </FormHelperText>
      <Stack direction='row' flex={1} flexBasis={100} minHeight={0}>
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={tab}
          onChange={(e, value) => setTab(value)}
          sx={{ borderRight: 'solid 1px divider', width: 200 }}>
          {variants.map(({ id, value }, i) => {
            return (
              <Tab
                label={value}
                {...a11yProps(i)}
                key={id}
                sx={{
                  alignItems: 'flex-start',
                }}
              />
            );
          })}
        </Tabs>
        {variants.map(({ id, value }, i) => {
          return (
            <TabPanel value={tab} key={id} index={i}>
              <Grid container spacing={1}>
                {data.step2.map(({ image, variant }, i) => {
                  return (
                    variant === value && (
                      <Grid item md={3} sm={6} xs={12} key={i}>
                        <label htmlFor={`select-${i}`}>
                          <Box
                            width='100%'
                            sx={{
                              position: 'relative',
                              aspectRatio: '1/1',
                              borderRadius: 1,
                              border: 'solid 1px #cccc',
                              background: `url(${
                                image?.type?.split('/')[0] === 'image'
                                  ? URL.createObjectURL(image)
                                  : FileIcon
                              }) no-repeat center`,
                              backgroundSize: 'cover',
                              '&:before': {
                                fontFamily: 'Material Icons',
                                content: '"edit"',
                                position: 'absolute',
                                inset: 0,
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '3em',
                                opacity: 0,
                                transition: 'opacity 150ms linear',
                                cursor: 'pointer',
                                bgcolor: '#0008',
                                borderRadius: 1,
                              },
                              '&:hover:before': {
                                opacity: 1,
                              },
                            }}>
                            <input
                              type='file'
                              id={`select-${i}`}
                              hidden
                              onInput={e => handleUpdateImage(e, i)}
                            />
                          </Box>
                        </label>
                        <Button
                          variant='contained'
                          fullWidth
                          startIcon={<Delete />}
                          color='error'
                          sx={{ mt: 0.2 }}
                          size='small'
                          onClick={() => handleRemove(i)}>
                          Remove
                        </Button>
                      </Grid>
                    )
                  );
                })}
                <Grid item md={3} sm={6} xs={12}>
                  <label htmlFor='select'>
                    <Box
                      width='100%'
                      sx={{
                        position: 'relative',
                        aspectRatio: '1/1',
                        border: 'solid 1px #cccc',
                        borderRadius: 1,
                        background:
                          'url(https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png) no-repeat center',
                        backgroundSize: 'cover',
                        '&:before': {
                          fontFamily: 'Material Icons',
                          content: '"add"',
                          position: 'absolute',
                          inset: 0,
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '4em',
                          opacity: 0,
                          transition: 'opacity 150ms linear',
                          cursor: 'pointer',
                          bgcolor: '#0008',
                          borderRadius: 1,
                        },
                        '&:hover:before': {
                          opacity: 1,
                        },
                      }}>
                      <input
                        type='file'
                        id='select'
                        hidden
                        onInput={e => handleAddImage(e, id, value)}
                      />
                    </Box>
                  </label>
                </Grid>
              </Grid>
            </TabPanel>
          );
        })}
      </Stack>
      <Typography
        variant='caption'
        textAlign='center'
        sx={{ display: 'block' }}>
        {data.step2.length}/50 images
      </Typography>
    </Stack>
  );
}
