import React from 'react';
import {
  Stack,
  Step,
  StepLabel,
  Stepper,
  styled,
  StepConnector,
  stepConnectorClasses,
  Box,
  Button,
} from '@mui/material';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import CreateProductContext from '../../../context';
import { AddBox, BurstMode, Inventory2, Summarize } from '@mui/icons-material';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 45,
  height: 45,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <BurstMode fontSize='small' />,
    2: <Inventory2 fontSize='small' />,
    3: <Summarize fontSize='small' />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = ['Images and Variants', 'Product Information', 'Summary'];

export default function AddProduct({ onAction }) {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [errors, setErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    step1: 0,
    step2: [],
    step3: {
      name: '',
      price: '',
      quantity: '',
      description: '',
      tags: [],
      age: null,
    },
  });

  const handleStep1 = value => {
    setData({ ...data, step1: value });
    setStep(step + 1);
  };

  const handleStep2 = value => {
    setData({ ...data, step2: value });
  };

  const handleStep3 = (key, value) => {
    setData({ ...data, step3: { ...data.step3, [key]: value } });
  };

  const handlePrev = () => setStep(step - 1);

  const handleNext = () => {
    setErrors([]);
    validations();
  };

  const step1Validator = () => {
    const formData = new FormData();
    const images = data.step2.map(obj => obj.image);
    const variants = data.step2.map(obj => obj.id);
    images.map(file => {
      return formData.append('images', file);
    });
    formData.append('variants', JSON.stringify(variants));
    axios
      .post(`${process.env.REACT_APP_URL}products/step1-validator`, formData, {
        withCredentials: true,
      })
      .then(() => {
        setStep(step + 1);
        setLoading(false);
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
        setLoading(false);
      });
  };

  const step2Validator = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}products/step2-validator`,
        data.step3,
        { withCredentials: true }
      )
      .then(() => {
        setStep(step + 1);
        setLoading(false);
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('type', data.step1);
    const images = data.step2.map(obj => obj.image);
    const variants = data.step2.map(obj => obj.id);
    images.map(file => {
      return formData.append('images', file);
    });
    formData.append('variants', JSON.stringify(variants));
    formData.append('name', data.step3.name);
    formData.append('price', data.step3.price);
    formData.append('quantity', data.step3.quantity);
    formData.append('description', data.step3.description);
    formData.append('tags', JSON.stringify(data.step3.tags));
    if (data.step3.age) {
      formData.append('age', JSON.stringify(data.step3.age));
    }
    axios
      .post(`${process.env.REACT_APP_URL}products/create-product`, formData, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setLoading(false);
        onAction(data, 'success');
        navigate('/products');
      })
      .catch(e => {
        const { data } = e.response;
        setErrors(data);
        setLoading(false);
      });
  };

  const validations = () => {
    setLoading(true);
    switch (step) {
      case 2:
        return step1Validator();
      case 3:
        return step2Validator();
      case 4:
        return handleSubmit();
      default:
        break;
    }
  };

  return (
    <Stack flex={1} p={1}>
      <CreateProductContext.Provider
        value={{
          data,
          step,
          handlePrev,
          handleStep1,
          handleStep2,
          handleStep3,
          errors,
        }}>
        {step === 1 ? null : (
          <Stepper
            alternativeLabel
            activeStep={step - 2}
            connector={<ColorlibConnector />}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        <Box flex={1} flexBasis={100} minHeight={0}>
          <Display />
        </Box>
        {step === 1 ? null : (
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            py={1}>
            <Button onClick={handlePrev}>Previous</Button>
            <Button variant='contained' onClick={handleNext} disabled={loading}>
              {step === 4 ? 'Submit' : 'Next'}
            </Button>
          </Stack>
        )}
      </CreateProductContext.Provider>
    </Stack>
  );
}

function Display() {
  const { step } = React.useContext(CreateProductContext);

  switch (step) {
    case 1:
      return <Step1 />;
    case 2:
      return <Step2 />;
    case 3:
      return <Step3 />;
    case 4:
      return <Step4 />;
    default:
      return <Step1 />;
  }
}
