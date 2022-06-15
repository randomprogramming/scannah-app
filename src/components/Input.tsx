import React from "react";
import styled from "styled-components";

interface InputProps {
  value: string | number;
  onChange(newValue: string): void;
  type: "text" | "number" | "password" | "email";
  placeholder?: string;
  style?: React.CSSProperties;
  validateLength?: boolean;
  className?: string;
}

interface StyledInputProps {
  value: string | number;
  validateLength?: boolean;
}

const StyledInput = styled.input<StyledInputProps>`
  border-radius: 8px;
  border: 2px solid;
  outline: none;
  width: 145px;
  padding: 8px 16px;
  transition: all 0.15s cubic-bezier(0.2, 0.2, 0.675, 0.19);

  // Hide the up and down arrow in number input type
  -webkit-appearance: none;
  margin: 0;
  -moz-appearance: textfield;

  border-color: ${(props) =>
    props.validateLength && props.value.toString().length === 0
      ? "#FCA5A5"
      : props.theme.colors.lightGray};

  &:hover {
    border-color: ${(props) => props.theme.colors.darkGray};
  }

  &:focus {
    border-color: ${(props) => props.theme.colors.dashboardAccent};
  }
`;

export default function Input({
  value,
  onChange,
  type,
  placeholder,
  style,
  validateLength,
  className,
}: InputProps) {
  return (
    <StyledInput
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={style}
      placeholder={placeholder}
      validateLength={validateLength}
      className={className}
    />
  );
}
