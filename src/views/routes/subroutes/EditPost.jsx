import React from 'react';
import {
  Box,
  Container,
  Stack,
  TextField,
  Typography,
  Checkbox,
  Button,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { Add, Close, Save } from '@mui/icons-material';
import FileIcon from '../../../files/file.png';
import axios from 'axios';

export default function EditPost({ edit, onCancel, onAction, onReload }) {
  const [text, setText] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [toRemove, setToRemove] = React.useState([]);
  const [newImages, setNewImages] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
  const ref = React.useRef();

  const handleToRemove = id => {
    let temp = toRemove;
    if (temp?.some(data => data === id)) {
      temp = temp?.filter(data => data !== id);
      setToRemove(temp);
    } else {
      setToRemove([...toRemove, id]);
    }
  };

  const handleSelect = e => {
    if (e.target.files.length <= 0) return;
    if (newImages?.length > 0) {
      let temp = Array.prototype.slice.call(e.target.files);
      const result = temp.concat(newImages);
      setNewImages(result);
    } else {
      setNewImages(Array.prototype.slice.call(e.target.files));
    }
    e.target.value = '';
  };

  const handleRemove = image => {
    let temp = newImages;
    temp = newImages.filter(item => item !== image);
    setNewImages(temp);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    newImages.length > 0 &&
      newImages.forEach(image => {
        formData.append('images', image);
      });
    formData.append('post', text);
    toRemove.forEach(id => {
      formData.append('toRemove', id);
    });
    setErrors([]);
    axios
      .patch(
        `${process.env.REACT_APP_URL}profile/edit-post/${edit?.id}`,
        formData,
        { withCredentials: true }
      )
      .then(({ data }) => {
        setText('');
        setImages([]);
        setToRemove([]);
        setNewImages([]);
        onAction(data);
        onReload();
        onCancel();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  React.useEffect(() => {
    setText(edit?.post);
    setImages(edit?.images);
  }, [edit?.post, edit?.images]);

  return (
    <Stack
      flex={1}
      flexBasis={0}
      minHeight={0}
      overflow='hidden auto'
      p={1}
      sx={{
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-track': {
          width: 6,
          bgcolor: grey[500],
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-thumb': {
          width: 6,
          bgcolor: grey[800],
          borderRadius: 3,
        },
      }}>
      <Container maxWidth='sm'>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'>
          <Typography variant='subtitle1'>Editing Post</Typography>
          <Button onClick={onCancel}>cancel</Button>
        </Stack>
        <Box mb={2}>
          <TextField
            value={text}
            onInput={e => setText(e.target.value)}
            fullWidth
            multiline
            placeholder="What's new?"
            maxRows={5}
            variant='standard'
            error={
              Array.isArray(errors) && errors?.some(obj => obj.param === 'post')
            }
            helperText={
              Array.isArray(errors) &&
              errors?.find(obj => obj.param === 'post')?.msg
            }
          />
        </Box>
        {images?.length > 0 ? (
          <>
            <Typography variant='body2' mb={1}>
              Current Images <small>(Select images you want to remove)</small>
            </Typography>
            <Stack
              direction='row'
              overflow='auto hidden'
              flexWrap='nowrap'
              sx={{
                '&::-webkit-scrollbar': {
                  height: 8,
                },
                '&::-webkit-scrollbar-track': {
                  height: 8,
                  bgcolor: grey[500],
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  height: 8,
                  bgcolor: grey[800],
                  borderRadius: 4,
                },
              }}>
              {images?.map(data => {
                return (
                  data && (
                    <ImageView
                      key={data.id}
                      data={data}
                      isChecked={toRemove?.some(id => id === data?.id)}
                      onRemove={handleToRemove}
                    />
                  )
                );
              })}
            </Stack>
          </>
        ) : null}
        <FormHelperText
          sx={{ textAlign: 'center' }}
          error={
            Array.isArray(errors) &&
            errors?.some(obj => obj.param === 'toRemove')
          }>
          {Array.isArray(errors) &&
            errors?.find(obj => obj.param === 'toRemove')?.msg}
        </FormHelperText>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mt={1}>
          <Typography variant='subtitle1'>Add Images</Typography>
          <>
            <Button startIcon={<Add />} onClick={() => ref.current.click()}>
              Add
            </Button>
            <input
              hidden
              type='file'
              multiple
              accept='image/*'
              ref={ref}
              onInput={handleSelect}
            />
          </>
        </Stack>
        {newImages?.length > 0 ? (
          <Stack
            direction='row'
            overflow='auto hidden'
            flexWrap='nowrap'
            sx={{
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                height: 8,
                bgcolor: grey[500],
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                height: 8,
                bgcolor: grey[800],
                borderRadius: 4,
              },
            }}>
            {newImages?.map((image, i) => {
              return (
                <Stack
                  position='relative'
                  sx={{ height: 200, width: '40%', aspectRatio: '16/9' }}
                  key={i}>
                  <img
                    src={
                      image?.type?.split('/')[0] === 'image'
                        ? URL.createObjectURL(image)
                        : FileIcon
                    }
                    style={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                    alt={'new selected' + i}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 1,
                      right: 1,
                      bgcolor: '#0006',
                    }}
                    onClick={() => handleRemove(image)}>
                    <Close />
                  </IconButton>
                </Stack>
              );
            })}
          </Stack>
        ) : (
          <Typography
            variant='h6'
            mt={1}
            textAlign='center'
            textTransform='uppercase'>
            No additional images
          </Typography>
        )}
        <FormHelperText
          error={errors?.hasOwnProperty('file')}
          sx={{ textAlign: 'center' }}>
          {errors?.file}
        </FormHelperText>
        <br />
        <Button
          fullWidth
          startIcon={<Save />}
          variant='contained'
          color='success'
          onClick={handleSubmit}>
          Save Changes
        </Button>
      </Container>
    </Stack>
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
    <Stack
      position='relative'
      sx={{ height: 200, width: '40%', aspectRatio: '16/9' }}
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
  );
}
