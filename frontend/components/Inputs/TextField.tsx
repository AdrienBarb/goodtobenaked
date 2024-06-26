import TextField, { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { FC } from "react";

const CustomTextField: FC<TextFieldProps> = styled((props) => (
  <TextField {...props} />
))(({ theme }) => ({
  fontFamily: "var(--font-rubik)",
  "& label": {
    color: "rgba(0, 0, 0, 0.3)",
    fontFamily: "var(--font-rubik)",
  },
  "& label.Mui-focused": {
    color: "black",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "black",
  },
  "& .MuiFilledInput-root:after": {
    borderBottomColor: "black",
  },
}));

export default CustomTextField;
