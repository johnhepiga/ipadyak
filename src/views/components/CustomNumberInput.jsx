import React from 'react';

const CustomNumberFormat = React.forwardRef((props, ref) => {
  const { onChange } = props;

  return (
    <input
      {...props}
      ref={ref}
      type='number'
      step='0.01'
      onInput={(e) => onChange({ target: { value: e.target.value } })}
    />
  );
});

export default CustomNumberFormat;
