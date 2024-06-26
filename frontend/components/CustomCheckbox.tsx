import * as React from "react";
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';

interface CustomCheckboxProps {
  checked: boolean;
  onChange?: () => void;
  value?: boolean;
  disabled?: boolean;
  styles?: React.CSSProperties;
}

const StyledCheckbox = styled(Checkbox)(() => ({
  '&:hover' : {
    backgroundColor: 'transparant'
  },
  '&.MuiCheckbox-root.Mui-checked': {
    color: '#Cecaff'
  }
}));

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, value, disabled, styles }) => {    
    
      return (
        <StyledCheckbox
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            sx={styles}
        />
      );
};

export default CustomCheckbox;
