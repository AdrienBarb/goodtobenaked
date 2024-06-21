import React, { useState, FC } from "react";
import Select from "react-select";
import { useTranslations } from "next-intl";

interface Props {
  options: { label: string; value: string }[];
  handleChange: (e: { label: string; value: string } | null) => void;
  placeholder: string;
}

const FilterSelect: FC<Props> = ({ options, handleChange, placeholder }) => {
  const t = useTranslations();
  const [localValue, setLocalValue] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const onChange = (value: { label: string; value: string } | null) => {
    setLocalValue(value);
    handleChange(value);
  };

  return (
    <div style={{ position: "relative" }}>
      <Select
        name="tags"
        onChange={(value) => onChange(value)}
        isClearable={true}
        options={options}
        value={localValue}
        classNamePrefix="react-select"
        closeMenuOnSelect={true}
        placeholder={placeholder}
        noOptionsMessage={() => <span>{t("common.noOtpions")}</span>}
        styles={{
          control: (styles) => ({
            ...styles,
            backgroundColor: "#cecaff",
            borderRadius: "6px",
            color: "white",
            boxShadow: "none",
            outline: "none",
            border: "1px solid #cecaff",
            minHeight: "26px",
            ":hover": {
              border: "1px solid #cecaff",
            },
          }),
          option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: isDisabled
              ? undefined
              : isSelected
              ? "#cecaff"
              : isFocused
              ? "#d9d7f6"
              : undefined,
            color: "black",
            fontSize: "14px",
          }),
          menuList: (styles) => ({
            ...styles,
            zIndex: "2000",
            backgroundColor: "#fff0eb",
            borderRadius: "6px",
          }),
          menu: (styles) => ({
            ...styles,
            zIndex: "2000",
            backgroundColor: "#fff0eb",
            borderRadius: "6px",
          }),
          clearIndicator: (styles) => ({
            ...styles,
            color: "white",
            padding: "4px",
            ":hover": {
              color: "white",
              cursor: "pointer",
            },
          }),
          indicatorSeparator: (styles) => ({
            ...styles,
            color: "white",
            backgroundColor: "white",
          }),
          dropdownIndicator: (styles) => ({
            ...styles,
            color: "white",
            padding: "4px",
            ":hover": {
              color: "white",
              cursor: "pointer",
            },
          }),
          noOptionsMessage: (styles) => ({
            ...styles,
            color: "black",
          }),
          placeholder: (styles) => ({
            ...styles,
            color: "white",
            fontSize: "14px",
          }),
          singleValue: (styles) => ({
            ...styles,
            color: "white",
            fontSize: "14px",
          }),
        }}
      />
    </div>
  );
};

export default FilterSelect;
