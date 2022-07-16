import React from 'react';
import {
  Box,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
  Collapse,
  FormHelperText,
} from '@mui/material';
import axios from 'axios';
import { ArrowForwardIos } from '@mui/icons-material';
import CreateProductContext from '../../../context';

export default function Step3() {
  const { data, errors, handleStep3 } = React.useContext(CreateProductContext);
  const [tags, setTags] = React.useState([]);
  const [checked, setChecked] = React.useState(Array.isArray(data?.step3?.age));

  const MIN_DISTANCE = 10;

  const handleRemove = id => {
    let temp = data.step3.tags;
    temp = temp.filter(obj => obj.id !== id);
    handleStep3('tags', temp);
  };

  const handleCheck = e => {
    setChecked(!checked);
    if (!checked) {
      handleStep3('age', [3, 13]);
      return;
    }
    handleStep3('age', null);
  };

  const handleAgeRange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) return;
    let temp = data.step3.age;
    if (activeThumb === 0) {
      temp = [
        Math.min(newValue[0], data.step3.age[1] - MIN_DISTANCE),
        data.step3.age[1],
      ];
      handleStep3('age', temp);
    } else {
      temp = [
        data.step3.age[0],
        Math.max(newValue[1], data.step3.age[0] + MIN_DISTANCE),
      ];
      handleStep3('age', temp);
    }
  };

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
  }, []);

  return (
    <Stack height='100%'>
      <Grid
        container
        columnSpacing={2}
        flex={1}
        flexBasis={100}
        minHeight={0}
        overflow='hidden auto'
        rowSpacing={1}>
        <Grid item md={3} xs={12} flex={1} height='100%'>
          <Box component={Paper} p={1} height='100%' overflow='hidden auto'>
            <Typography variant='subtitle1'>General Information</Typography>
            <Box my={1}>
              <TextField
                fullWidth
                autoComplete='off'
                label='Product name'
                value={data.step3.name}
                onInput={e => handleStep3('name', e.target.value)}
                error={errors?.some(obj => obj.param === 'name')}
                helperText={errors?.find(obj => obj.param === 'name')?.msg}
              />
            </Box>
            <Box my={1}>
              <TextField
                type='number'
                fullWidth
                autoComplete='off'
                label='Price'
                value={data.step3.price}
                onChange={e => handleStep3('price', e.target.value)}
                error={errors?.some(obj => obj.param === 'price')}
                helperText={errors?.find(obj => obj.param === 'price')?.msg}
              />
            </Box>
            <Box my={1}>
              <TextField
                type='number'
                fullWidth
                autoComplete='off'
                label='Quantity'
                value={data.step3.quantity}
                onChange={e => handleStep3('quantity', e.target.value)}
                error={errors?.some(obj => obj.param === 'quantity')}
                helperText={errors?.find(obj => obj.param === 'quantity')?.msg}
              />
            </Box>
            <Box my={1}>
              <TextField
                type='text'
                multiline
                fullWidth
                autoComplete='off'
                label='Description'
                value={data.step3.description}
                onChange={e => handleStep3('description', e.target.value)}
                error={errors?.some(obj => obj.param === 'description')}
                helperText={
                  errors?.find(obj => obj.param === 'description')?.msg
                }
                rows={3}
              />
            </Box>
            {data.step1 === 1 ? (
              <>
                <Divider />
                <FormControlLabel
                  control={<Checkbox onInput={handleCheck} checked={checked} />}
                  labelPlacement='start'
                  label='Add suitable age range.'
                />
                {checked ? (
                  <>
                    <Typography variant='subtitle2'>
                      Age range ({data.step3.age[0]} - {data.step3.age[1]})
                    </Typography>
                    <Box px={1}>
                      <Slider
                        getAriaLabel={() => 'Minimum distance'}
                        value={data.step3.age}
                        onChange={handleAgeRange}
                        valueLabelDisplay='auto'
                        min={3}
                        max={100}
                        disableSwap
                      />
                    </Box>
                    <FormHelperText
                      error={errors?.some(obj => obj.param === 'age')}>
                      {errors?.find(obj => obj.param === 'age')?.msg}
                    </FormHelperText>
                  </>
                ) : null}
              </>
            ) : null}
          </Box>
        </Grid>
        <Grid item md={6} xs={12} height='100%'>
          <Stack component={Paper} p={1} height='100%' overflow='hidden auto'>
            <Typography variant='subtitle1'>Tags</Typography>
            <Typography variant='caption'>
              (Select tags from the list on the right.)
            </Typography>
            <Stack
              direction='row'
              p={1}
              flex={1}
              minHeight={0}
              overflow='hidden auto'>
              <Stack
                direction='row'
                flexWrap='wrap'
                gap={0.5}
                height='min-content'>
                {data.step3.tags.map((tag, i) => {
                  return (
                    <Chip
                      label={tag.value}
                      key={i}
                      onDelete={() => handleRemove(tag.id)}
                    />
                  );
                })}
              </Stack>
            </Stack>
            <FormHelperText
              sx={{ textAlign: 'center' }}
              error={errors?.some(obj => obj.param === 'tags')}>
              {errors?.find(obj => obj.param === 'tags')?.msg}
            </FormHelperText>
          </Stack>
        </Grid>
        <Grid item md={3} xs={12} height='100%'>
          <Stack component={Paper} p={1} height='100%' overflow='hidden auto'>
            <Typography variant='subtitle1'>Tags List</Typography>
            <Box flex={1}>
              {Object.keys(tags).map(key => {
                return (
                  <CollapsingTags
                    data={tags[key]}
                    key={key}
                    type={key}
                    step3={data.step3}
                    onChange={handleStep3}
                  />
                );
              })}
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

function CollapsingTags({ data, type, onChange, step3 }) {
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

  const handleTagClick = data => {
    const temp = step3.tags;
    temp.push(data);
    onChange('tags', temp);
  };

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
        <Box px={1}>
          <List disablePadding>
            {data?.map(({ value, id }, i) => {
              return (
                !step3.tags.some(obj => obj.id === id) && (
                  <React.Fragment key={i}>
                    <ListItem
                      button
                      onClick={() => handleTagClick({ id, value, type })}>
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
