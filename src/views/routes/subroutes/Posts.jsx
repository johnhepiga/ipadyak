import { Close, Image, MoreVert } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  Box,
  FormHelperText,
  CardHeader,
  Avatar,
  Menu,
  MenuItem,
  ButtonGroup,
} from '@mui/material';
import { grey, red } from '@mui/material/colors';
import React from 'react';
import FileIcon from '../../../files/file.png';
import axios from 'axios';
import Moment from 'react-moment';
import ShowMoreText from 'react-show-more-text';
import EditPost from './EditPost';

export default function Posts({ onAction, profile, onReload, onFullscreen }) {
  const [editing, setEditing] = React.useState({ show: false, data: null });
  const [view, setView] = React.useState('active');

  return (
    <React.Fragment>
      <Stack flex={1} flexBasis={0} minHeight={0} overflow='hidden auto' p={1}>
        {editing.show ? (
          <EditPost
            edit={editing.data}
            onCancel={() => setEditing({ show: false, data: null })}
            onReload={onReload}
            onAction={onAction}
          />
        ) : (
          <Container maxWidth='sm'>
            <ButtonGroup fullWidth variant='text'>
              <Button
                variant={view === 'active' ? 'outlined' : 'text'}
                onClick={() => setView('active')}>
                Active Posts
              </Button>
              <Button
                variant={view === 'trashed' ? 'outlined' : 'text'}
                onClick={() => setView('trashed')}>
                Trashed Posts
              </Button>
            </ButtonGroup>
            {view === 'active' ? (
              <>
                <CreatePost onAction={onAction} onReload={onReload} />
                <br />
                {profile?.posts?.length > 0 ? (
                  profile?.posts.map((post, i) => {
                    return (
                      <Post
                        key={i}
                        post={post}
                        profile={profile}
                        onFullscreen={onFullscreen}
                        onEdit={data => setEditing({ show: true, data })}
                        onAction={onAction}
                        onReload={onReload}
                      />
                    );
                  })
                ) : (
                  <Typography variant='h6' textAlign='center' sx={{ mt: 1 }}>
                    No posts found.
                  </Typography>
                )}
              </>
            ) : view === 'trashed' ? (
              <>
                <br />
                <br />
                {profile?.trashed?.length > 0 ? (
                  profile?.trashed.map((post, i) => {
                    return (
                      <Post
                        key={i}
                        post={post}
                        profile={profile}
                        onFullscreen={onFullscreen}
                        onEdit={data => setEditing({ show: true, data })}
                        onAction={onAction}
                        onReload={onReload}
                        type='trashed'
                      />
                    );
                  })
                ) : (
                  <Typography variant='h6' textAlign='center' sx={{ mt: 1 }}>
                    No trashed posts found.
                  </Typography>
                )}
              </>
            ) : null}
          </Container>
        )}
      </Stack>
    </React.Fragment>
  );
}

function Post({
  profile,
  post,
  onFullscreen,
  onEdit,
  onAction,
  onReload,
  type,
}) {
  const [current, setCurrent] = React.useState(null);
  const [show, setShow] = React.useState(false);
  const [retrieve, setRetrieve] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    setCurrent(post?.images?.length > 0 ? post?.images[0] : null);
  }, [post?.images]);

  const handleSelectCurrent = image => {
    setCurrent(image);
  };

  const handleDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_URL}profile/delete-post/${post?.id}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setShow(false);
        onAction(data, 'error');
        onReload();
      });
  };
  const handleRetrieve = () => {
    axios
      .get(`${process.env.REACT_APP_URL}profile/retrieve-post/${post?.id}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setShow(false);
        onAction(data);
        onReload();
      });
  };

  return (
    <React.Fragment>
      <Card sx={{ mb: 1.5 }} elevation={2}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: red[500] }}
              aria-label='profile'
              alt={profile?.firstname + ' ' + profile?.lastname}
              src={process.env.REACT_APP_UPLOAD_URL + profile?.profile?.value}
            />
          }
          action={
            <IconButton
              aria-label='settigs'
              onClick={e => setAnchorEl(e.currentTarget)}>
              <MoreVert />
            </IconButton>
          }
          title={profile?.firstname + ' ' + profile?.lastname}
          subheader={
            post?.updatedAt !== post?.createdAt ? (
              <>
                Edited ·{' '}
                <Moment format='MMMM DD, YYYY · hh:mm a'>
                  {post?.updatedAt}
                </Moment>{' '}
              </>
            ) : (
              <Moment format='MMMM DD, YYYY · hh:mm a'>
                {post?.createdAt}
              </Moment>
            )
          }
        />
        {post?.post ? (
          <Box p={1}>
            <ShowMoreText
              lines={3}
              more='Show more'
              less='Show less'
              expanded={false}
              truncatedEndingComponent={'... '}
              keepNewLines={true}
              anchorClass='custom-anchor-class'>
              {post?.post}
            </ShowMoreText>
          </Box>
        ) : null}
        {current ? (
          <Stack position='relative'>
            <CardMedia
              component='img'
              image={process.env.REACT_APP_UPLOAD_URL + current?.value}
              alt='Selected'
              height='300'
              style={{ cursor: 'pointer' }}
              onClick={() =>
                onFullscreen(process.env.REACT_APP_UPLOAD_URL + current?.value)
              }
            />
          </Stack>
        ) : null}
        {post?.images?.length > 0 ? (
          post?.images?.length <= 1 ? null : (
            <Stack
              direction='row'
              overflow='auto hidden'
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
              }}
              mb={1}>
              {post?.images?.map((image, i) => {
                return (
                  <Box
                    key={i}
                    sx={{
                      height: 150,
                      width:
                        post?.images?.length === 2
                          ? '50%'
                          : post?.images?.length === 3
                          ? '33.33%'
                          : '30%',
                      aspectRatio: '16/9',
                    }}>
                    <img
                      src={process.env.REACT_APP_UPLOAD_URL + image.value}
                      alt={'post ' + i}
                      onClick={() => handleSelectCurrent(image)}
                      style={{
                        height: '100%',
                        width: '100%',
                        aspectRatio: '16/9',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          )
        ) : null}
      </Card>

      {type === 'trashed' ? (
        <Menu
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setRetrieve(true);
            }}>
            Retrieve Post
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onEdit(post);
            }}>
            Edit Post
          </MenuItem>
          <MenuItem onClick={() => setShow(true)}>Move to trash</MenuItem>
        </Menu>
      )}

      <Dialog
        open={show}
        onClose={() => setShow(false)}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this post?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShow(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant='contained' color='error'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={retrieve}
        onClose={() => setRetrieve(false)}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>Retrieve Post</DialogTitle>
        <DialogContent>
          Are you sure you want to retrieve this post?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRetrieve(false)}>Cancel</Button>
          <Button onClick={handleRetrieve} variant='contained' color='success'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

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

function CreatePost({ onAction, onReload }) {
  const [open, setOpen] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [current, setCurrent] = React.useState(null);
  const [text, setText] = React.useState('');
  const [errors, setErrors] = React.useState([]);
  const ref = React.useRef();

  const handleSelect = e => {
    if (e.target.files.length <= 0) return;
    if (images?.length > 0) {
      let temp = Array.prototype.slice.call(e.target.files);
      const result = temp.concat(images);
      setImages(result);
    } else {
      setImages(Array.prototype.slice.call(e.target.files));
      setCurrent(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleSelectCurrent = image => {
    setCurrent(image);
  };

  const handleRemove = image => {
    let temp = images;
    temp = images.filter(item => item !== image);
    setImages(temp);
    setCurrent(temp?.length > 0 ? temp[0] : null);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    images.map(image => {
      return formData.append('images', image);
    });
    formData.append('post', text);
    setErrors([]);
    axios
      .post(`${process.env.REACT_APP_URL}profile/create-post`, formData, {
        withCredentials: true,
      })
      .then(({ data }) => {
        onAction(data);
        setOpen(false);
        setImages([]);
        setCurrent(null);
        setText('');
        onReload();
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
      });
  };

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <TextField
            placeholder="What's new?"
            fullWidth
            onClick={() => setOpen(true)}
            InputProps={{ readOnly: true }}
            value={text}
          />
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        fullWidth
        maxWidth='sm'>
        <BootstrapDialogTitle onClose={() => setOpen(false)}>
          Create Post
        </BootstrapDialogTitle>
        <DialogContent
          dividers
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
              bgcolor: grey[900],
              borderRadius: 3,
            },
          }}>
          <Box mb={2}>
            <TextField
              variant='standard'
              fullWidth
              placeholder="What's new?"
              value={text}
              onInput={e => setText(e.target.value)}
              multiline
              maxRows={5}
              error={
                Array.isArray(errors) &&
                errors?.some(obj => obj.param === 'post')
              }
              helperText={
                Array.isArray(errors) &&
                errors?.find(obj => obj.param === 'post')?.msg
              }
            />
          </Box>
          {current ? (
            <Stack position='relative'>
              <img
                src={
                  current?.type?.split('/')[0] === 'image'
                    ? URL.createObjectURL(current)
                    : FileIcon
                }
                style={{
                  height: 300,
                  width: '100%',
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                }}
                alt='Selected'
              />
              {images?.length === 1 ? (
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 1,
                    right: 1,
                    bgcolor: '#0005',
                  }}
                  size='small'
                  onClick={() => {
                    setCurrent(null);
                    setImages([]);
                  }}>
                  <Close />
                </IconButton>
              ) : null}
            </Stack>
          ) : null}
          {images?.length <= 1 ? null : (
            <Stack
              direction='row'
              overflow='auto hidden'
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
                  bgcolor: grey[900],
                  borderRadius: 4,
                },
              }}
              mb={1}>
              {images?.map((image, i) => {
                return (
                  <Box
                    key={i}
                    sx={{
                      height: 150,
                      width:
                        images?.length === 2
                          ? '50%'
                          : images?.length === 3
                          ? '33.33%'
                          : '30%',
                      aspectRatio: '16/9',
                      position: 'relative',
                    }}>
                    <img
                      src={
                        image?.type?.split('/')[0] === 'image'
                          ? URL.createObjectURL(image)
                          : FileIcon
                      }
                      alt={'post ' + i}
                      onClick={() => handleSelectCurrent(image)}
                      style={{
                        height: '100%',
                        width: '100%',
                        aspectRatio: '16/9',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 1,
                        right: 1,
                        bgcolor: '#0005',
                      }}
                      size='small'
                      onClick={() => handleRemove(image)}>
                      <Close />
                    </IconButton>
                  </Box>
                );
              })}
            </Stack>
          )}
          <FormHelperText
            error={errors?.hasOwnProperty('file')}
            sx={{ textAlign: 'center' }}>
            {errors?.file}
          </FormHelperText>
          <Button
            startIcon={<Image />}
            fullWidth
            variant='contained'
            color='info'
            onClick={() => ref.current.click()}>
            Add Photos
          </Button>
          <input
            type='file'
            hidden
            id='images'
            ref={ref}
            multiple
            accept='image/*'
            onInput={handleSelect}
          />
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='success' onClick={handleSubmit}>
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
