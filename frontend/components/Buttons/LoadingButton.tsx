import { styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";

const CustomLoadingButton = styled(LoadingButton)({
  backgroundColor: "#Cecaff",
  textTransform: "none",
  padding: "0.4rem 1rem",
  border: "1px solid #1C131E",
  width: "100%",
  textAlign: "center",
  fontWeight: "300",
  fontSize: "16px",
  lineHeight: "1.75",
  color: "#1C131E",
  fontFamily: "var(--font-rubik)",
  borderRadius: "6px",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#Cecaff",
  },
  "&:active": {
    backgroundColor: "#Cecaff",
  },
  "&:focus": {
    backgroundColor: "#Cecaff",
  },
});

export default CustomLoadingButton;
