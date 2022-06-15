import React, { useState, useEffect } from "react";
import styled from "styled-components";

const INPUT_BACKGROUND = "#fff";

interface ColorDisplayProps {
  backgroundColor: string;
}

const ColorDisplay = styled.div<ColorDisplayProps>`
  background-color: ${(props) => props.backgroundColor};
  border: 1px solid ${(props) => props.theme.colors.lightGray};
  height: 1.4em;
  width: 1.4em;
`;

function ColorPicker({
  title,
  onChange,
  selectedColor,
}: {
  title?: string;
  onChange(newColor: string): void;
  selectedColor?: string;
}) {
  const [validHex, setValidHex] = useState("");
  const [selectedHex, setSelectedHex] = useState(
    selectedColor && selectedColor.length > 0 // If selectedColor is provided
      ? selectedColor.replace("#", "") // remove the # from the hex value
      : "fff",
  );

  useEffect(() => {
    let hexCode = "#" + selectedHex;

    // regex magic, checks if hexCode is a valid three or six digit hex
    if (/^#([0-9A-F]{3}){1,2}$/i.test(hexCode)) {
      onChange(hexCode);
      setValidHex(hexCode);
    }
  }, [selectedHex]);

  return (
    <div className="flex flex-row space-x-4 items-center">
      {title && <div>{title}</div>}

      <ColorDisplay
        backgroundColor={validHex}
        className="shadow-sm rounded-sm"
      />
      <div
        style={{
          backgroundColor: INPUT_BACKGROUND,
        }}
        className="shadow-sm rounded-md"
      >
        <span className="pl-1 select-none">#</span>
        <input
          className="p-1 outline-none rounded-md"
          style={{ width: "7em", backgroundColor: INPUT_BACKGROUND }}
          onChange={(e) => setSelectedHex(e.target.value)}
          value={selectedHex}
          maxLength={6}
        />
      </div>
    </div>
  );
}

interface StyledDropdownContainerProps {
  isDropdownOpen: boolean;
}

const StyledDropdownContainer = styled.div<StyledDropdownContainerProps>`
  border-width: 2px;
  border-style: solid;
  padding: 6px 12px;
  width: 100%;
  border-radius: 10px;
  user-select: none;
  transition: all 0.2s ease-in-out;

  border-color: ${(props) =>
    props.isDropdownOpen
      ? props.theme.colors.dashboardAccent
      : props.theme.colors.lightGray};

  &:hover {
    border-color: ${(props) =>
      props.isDropdownOpen
        ? props.theme.colors.dashboardAccent
        : props.theme.colors.darkGray};
  }
`;

const StyledDropdownMenu = styled.div`
  border-width: 2px;
  border-style: solid;
  border-color: ${(props) => props.theme.colors.lightGray};
`;

const Triangle = styled.span<StyledDropdownContainerProps>`
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 10px solid ${(props) => props.theme.colors.lightGray};

  transition: all 0.2s ease-in-out;

  transform: ${(props) =>
    props.isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)"};
`;

const StyledSelection = styled.div`
  transition: all 0.1s ease-in-out;
  border-radius: 8px;

  &:hover {
    background-color: ${(props) => props.theme.colors.dashboardAccent};
    color: white;
  }
`;

function Dropdown({
  options,
  onKeyChange,
  title,
  selectedKey,
}: {
  options: { key: string; value: string }[];
  onKeyChange(newKey: string): void;
  title?: string;
  selectedKey?: string;
}) {
  const [selectedOption, setSelectedOption] = useState(
    selectedKey
      ? options.filter((option) => option.key === selectedKey)[0] || options[0]
      : options[0],
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [selectedOption]);

  useEffect(() => {
    onKeyChange(selectedOption.key);
  }, [selectedOption]);

  return (
    <div className="flex flex-row items-center space-x-4">
      {title && <div style={{ minWidth: "55px" }}>{title}</div>}
      <div
        className="relative inline-block cursor-pointer"
        style={{ minWidth: "220px" }}
      >
        <StyledDropdownContainer
          isDropdownOpen={isDropdownOpen}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-white flex flex-row items-center shadow-sm"
        >
          <span className="flex-1">{selectedOption.value}</span>
          <Triangle isDropdownOpen={isDropdownOpen} />
        </StyledDropdownContainer>
        <StyledDropdownMenu
          className="bg-white absolute p-2 select-none w-full mt-1 rounded-xl z-30"
          style={{
            display: isDropdownOpen ? "block" : "none",
          }}
        >
          {options.map((option) => (
            <StyledSelection
              onClick={() => setSelectedOption(option)}
              className="p-2"
              key={option.key}
            >
              {option.value}
            </StyledSelection>
          ))}
        </StyledDropdownMenu>
      </div>
    </div>
  );
}

interface CheckboxProps {
  isChecked: boolean;
}

const StyledCheckboxInput = styled.input`
  display: none;
`;

const StyledCheck = styled.span<CheckboxProps>`
  &::after {
    transition: all 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
    display: inline-block;
    content: "";
    height: 1.2em;
    width: 1.2em;
    background-color: ${(props) =>
      props.isChecked ? props.theme.colors.dashboardAccent : INPUT_BACKGROUND};
    border-radius: 4px;
    border: 2px solid ${(props) => props.theme.colors.lightGray};
    margin-right: 0.5em;
    margin-bottom: -4px;
  }
`;

const StyledCheckboxContainer = styled.label<CheckboxProps>`
  user-select: none;
  cursor: pointer;
  padding: 2px;

  &:hover ${StyledCheck}::after {
    ${(props) =>
      !props.isChecked && "background-color:" + props.theme.colors.lightGray}
  }
`;

function Checkbox({
  title,
  initialState,
  onChange,
}: {
  title: string;
  initialState?: boolean;
  onChange?: (newVal: boolean) => void;
}) {
  const [isChecked, setIsChecked] = useState(initialState);

  useEffect(() => {
    if (onChange) {
      onChange(isChecked);
    }
  }, [isChecked]);

  return (
    <div>
      <StyledCheckboxContainer isChecked={isChecked}>
        <StyledCheckboxInput
          type="checkbox"
          onChange={() => setIsChecked(!isChecked)}
          defaultChecked={isChecked}
        />
        <StyledCheck isChecked={isChecked} />
        {title}
      </StyledCheckboxContainer>
    </div>
  );
}

export default { ColorPicker, Dropdown, Checkbox };
