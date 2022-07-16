import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Stack,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import CreateProductContext from '../../../context';
import { ArrowForwardIos } from '@mui/icons-material';
import NumberFormat from 'react-number-format';
import ShowMoreText from 'react-show-more-text';

export default function Step4() {
  const { data } = React.useContext(CreateProductContext);
  const ref = React.useRef();
  const IMAGE_WIDTH = 100;
  const [current, setCurrent] = React.useState(data.step2[0]);
  const [scrollDisable, setScrollDisable] = React.useState('left');

  const list = {
    1: [
      {
        label: 'Product name',
        value: data.step3.name,
      },
      {
        label: 'Price',
        value: (
          <NumberFormat
            value={data.step3.price}
            displayType='text'
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={2}
            decimalSeparator='.'
            prefix='₱'
          />
        ),
      },
    ],
    2: [
      {
        label: 'Quantity',
        value: data.step3.quantity,
      },
      {
        label: 'Best suited for ages',
        value: data.step3.age
          ? data.step3.age[0] + ' to ' + data.step3.age[1]
          : 'N/A',
      },
    ],
  };

  React.useEffect(() => {
    if (ref?.current?.clientWidth >= ref?.current?.scrollWidth) {
      setScrollDisable('both');
    }
    ref.current.addEventListener('scroll', e => {
      switch (true) {
        case e.target.offsetWidth + e.target.scrollLeft >= e.target.scrollWidth:
          setScrollDisable('right');
          break;
        case e.target.scrollLeft === 0:
          setScrollDisable('left');
          break;
        default:
          setScrollDisable('');
          break;
      }
    });
  }, []);

  return (
    <Box height='100%'>
      <Grid
        container
        columnSpacing={1}
        height='100%'
        flex={1}
        flexBasis={100}
        minHeight={0}
        overflow='hidden auto'>
        <Grid item md={6} xs={12} zeroMinWidth height='100%'>
          <Stack p={1} component={Paper} height='100%'>
            <Box
              flex={1}
              flexBasis={100}
              minHeight={0}
              width='100%'
              mb={1}
              position='relative'>
              <img
                src={URL.createObjectURL(current?.image)}
                alt='current'
                style={{ height: '100%', width: '100%', objectFit: 'contain' }}
              />
              <Chip
                label={current?.variant + ' Variant'}
                color='success'
                sx={{ position: 'absolute', top: 0, right: 0 }}
              />
            </Box>
            <Stack
              direction='row'
              justifyContent='space-around'
              alignItems='center'>
              <IconButton
                onClick={() => (ref.current.scrollLeft -= IMAGE_WIDTH * 4)}
                disabled={scrollDisable === 'left' || scrollDisable === 'both'}>
                <ArrowForwardIos sx={{ transform: 'rotate(180deg)' }} />
              </IconButton>
              <Stack
                direction='row'
                flexWrap='nowrap'
                overflow='auto hidden'
                columnGap={1}
                ref={ref}
                sx={{
                  '&::-webkit-scrollbar': {
                    height: 0,
                  },
                  scrollBehavior: 'smooth',
                }}>
                {data.step2.map(({ variant, image }, i) => {
                  return (
                    <Box
                      borderRadius={2}
                      key={i}
                      onMouseEnter={() => setCurrent({ variant, image })}
                      sx={{ cursor: 'pointer' }}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={variant + '-' + i}
                        style={{
                          width: IMAGE_WIDTH,
                          height: 100,
                          borderRadius: 3,
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
              <IconButton
                onClick={() => (ref.current.scrollLeft += IMAGE_WIDTH * 4)}
                disabled={
                  scrollDisable === 'right' || scrollDisable === 'both'
                }>
                <ArrowForwardIos />
              </IconButton>
            </Stack>
          </Stack>
        </Grid>
        <Grid item md={6} xs={12} height='100%'>
          <Stack p={1} component={Paper} height='100%' overflow='hidden auto'>
            <Typography variant='h6' textAlign='center'>
              {data.step1 === 1 ? 'Bicycle' : 'Bicycle Part'}
            </Typography>
            <Divider />
            <Stack direction='row' width='100%'>
              {Object.keys(list).map(key => {
                return (
                  <List key={key} sx={{ flex: 1, minWidth: 0 }}>
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
                              <Typography
                                variant='body1'
                                className='ellipsis'
                                whiteSpace='nowrap'
                                textOverflow='ellipsis'>
                                {value}
                              </Typography>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                );
              })}
            </Stack>
            <Box p={1}>
              <Typography variant='caption' textTransform='uppercase'>
                Description
              </Typography>
              <ShowMoreText
                lines={3}
                more='Show more'
                less='Show less'
                expanded={false}
                truncatedEndingComponent={'... '}
                keepNewLines={true}
                anchorClass='custom-anchor-class'>
                {data.step3.description}
              </ShowMoreText>
            </Box>
            <Typography variant='button'>Tags</Typography>
            <Divider />
            <Stack mt={1}>
              <Stack direction='row' gap={0.5} flexWrap='wrap'>
                {data.step3.tags.map((tag, i) => {
                  return (
                    <Tooltip
                      key={i}
                      placement='top'
                      title={
                        tag.type === 'bikes'
                          ? 'Bike type'
                          : tag.type === 'cyclists'
                          ? 'Cyclist type'
                          : tag.type === 'genders'
                          ? 'Gender'
                          : tag.type === 'experiences'
                          ? 'Experience level'
                          : null
                      }
                      arrow>
                      <Chip label={tag.value} />
                    </Tooltip>
                  );
                })}
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
