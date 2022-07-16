import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function Fullscreen({ fullscreen, onClose }) {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current &&
      ref.current.addEventListener('click', e => {
        if (e.target.nodeName !== 'IMG') {
          onClose();
        }
      });
  }, [onClose]);

  return fullscreen.show ? (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: '#000a',
        zIndex: 999,
        display: 'grid',
        placeItems: 'center',
      }}
      ref={ref}>
      <img
        src={fullscreen?.image}
        alt={'fullscreen display'}
        style={{
          display: 'block',
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          objectFit: 'contain',
          height: 'auto',
          width: 'auto',
          maxHeight: '100%',
          maxWidth: '100%',
        }}
      />
      <IconButton
        sx={{ position: 'absolute', top: 10, right: 10 }}
        onClick={onClose}>
        <Close />
      </IconButton>
    </Box>
  ) : null;
}
