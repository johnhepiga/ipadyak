import React from 'react';
import { Typography, Stack, Button, Box } from '@mui/material';
import Bicycle from '../../../files/bicycle.jpg';
import Parts from '../../../files/parts.jpg';
import CreateProductContext from '../../../context';

export default function Step1({ onNext }) {
  const { handleStep1 } = React.useContext(CreateProductContext);

  return (
    <Stack height='100%'>
      <Typography variant='h6' textAlign='center'>
        Select product type
      </Typography>
      <Stack direction='row' flex={1} columnGap={1}>
        <Box flex={1} position='relative'>
          <Button
            onClick={() => handleStep1(1)}
            sx={{
              height: '100%',
              width: '100%',
              '&:before': {
                content: '""',
                position: 'absolute',
                borderRadius: 2,
                inset: 0,
                zIndex: -1,
                opacity: 0.2,
                background: `url(${Bicycle}) no-repeat center`,
                backgroundSize: 'cover',
              },
              '&:after': {
                content: '"Bicycle"',
                position: 'absolute',
                inset: 0,
                m: 'auto',
                height: 'fit-content',
                width: 'fit-content',
                border: 'solid 1px',
                borderRadius: 1,
                p: 1,
                backgroundColor: '#90caf933',
              },
            }}
          />
        </Box>
        <Box flex={1}>
          <Button
            onClick={() => handleStep1(2)}
            sx={{
              height: '100%',
              width: '100%',
              position: 'relative',
              '&:before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 2,
                zIndex: -1,
                opacity: 0.2,
                background: `url(${Parts}) no-repeat center`,
                backgroundSize: 'cover',
              },
              '&:after': {
                content: '"Parts"',
                position: 'absolute',
                inset: 0,
                m: 'auto',
                height: 'fit-content',
                width: 'fit-content',
                border: 'solid 1px',
                borderRadius: 1,
                p: 1,
                backgroundColor: '#90caf933',
              },
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
