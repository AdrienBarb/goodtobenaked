import React, { FC, useCallback, useEffect, useState } from "react";
import { Slider, debounce, styled } from "@mui/material";

const PrettoSlider = styled(Slider)({
  color: "#cecaff",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#cecaff",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

interface Props {
  setValue: (n: number) => void;
  fetchedPrice?: number;
}

const CustomSlider: FC<Props> = ({ setValue, fetchedPrice }) => {
  const [sliderValue, setSliderValue] = useState(0);

  const debouncedSetValue = useCallback(
    debounce((newValue) => {
      setValue(newValue);
    }, 250),
    []
  );

  const handleSliderChange = (_: Event, newValue: any) => {
    setSliderValue(newValue);
    debouncedSetValue(newValue);
  };

  useEffect(() => {
    if (typeof fetchedPrice === "number") {
      setSliderValue(fetchedPrice);
    }
  }, [fetchedPrice]);

  const marks = [
    {
      value: 0,
      label: "Gratuit",
    },
    {
      value: 50,
      label: "50€",
    },
    {
      value: 100,
      label: "100€",
    },
    {
      value: 200,
      label: "200€",
    },
  ];

  function valuetext(value: number) {
    return `${value}°hello`;
  }

  return (
    <PrettoSlider
      valueLabelDisplay="on"
      aria-label="pretto slider"
      value={sliderValue}
      onChange={handleSliderChange}
      defaultValue={0}
      max={200}
      getAriaValueText={valuetext}
      step={1}
      marks={marks}
      name="price"
    />
  );
};

export default CustomSlider;
