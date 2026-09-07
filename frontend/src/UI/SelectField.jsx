import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";


const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select option...",
  error = "",
  showError = false,
  required = false,
  disabled = false,
  containerClassName = "",
  className = "",
  onBlur,
  name="",
  multiple = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  // const [touched, setTouched] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const shouldShowError = showError && !!error;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
        setSearch("");
        // setTouched(true);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) => {
    const optLabel = typeof opt === 'string' ? opt : opt.label;
    return String(optLabel).toLowerCase().includes(search.toLowerCase());
  });


  // const handleSelect = (option) => {
  //   const selectedValue = typeof option === 'string' ? option : option.value;
  //   onChange({ target: { value: selectedValue } }); // ✅ sends event-like object
  //   // setTouched(true);
  //   setSearch("");
  //   setOpen(false);
  //   onBlur?.();
  // };




  const selectedValues = Array.isArray(value) ? value : [];

  const handleSelect = (option) => {
    const selectedValue =
        typeof option === "string" ? option : option.value;

    if (multiple) {
      const nextValues = selectedValues.includes(selectedValue)
        ? selectedValues.filter((item) => item !== selectedValue)
        : [...selectedValues, selectedValue];

      onChange({
        target: {
          name,
          value: nextValues,
        },
      });
      return;
    }

    onChange({
        target: {
            name,
            value: selectedValue,
        },
    });

    setSearch("");
    setOpen(false);
    onBlur?.();
};

  const handleSelectAll = () => {
    const filteredValues = filteredOptions.map((option) =>
      typeof option === "object" ? option.value : option,
    );
    const allSelected = filteredValues.every((item) => selectedValues.includes(item));
    const nextValues = allSelected
      ? selectedValues.filter((item) => !filteredValues.includes(item))
      : [...selectedValues, ...filteredValues.filter((item) => !selectedValues.includes(item))];

    onChange({
      target: {
        name,
        value: nextValues,
      },
    });
  };
  const handleFocus = () => {
    if (!disabled) {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className={`space-y-1 ${containerClassName}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={`w-full px-3 py-2 border rounded-md bg-white flex justify-between items-center cursor-pointer
          ${shouldShowError ? "border-red-500" : "border-gray-300"}
          ${disabled ? "bg-gray-100 opacity-50 cursor-not-allowed" : ""}
          ${className}`}
          onClick={handleFocus}
        >
          <input
            ref={inputRef}
            type="text"
            value={open ? search : (
              multiple
                ? options
                    .filter((option) => selectedValues.includes(typeof option === "object" ? option.value : option))
                    .map((option) => typeof option === "object" ? option.label : option)
                    .join(", ")
                : typeof value === 'object'
                  ? (options.find(o => o.value === value)?.label || value?.label || '')
                  : (options.find(o => (typeof o === 'object' ? o.value === value : o === value))?.label || value || '')
            )}
            placeholder={!value ? placeholder : ""}
            onChange={(e) => setSearch(e.target.value)}
            disabled={disabled}
            className="w-full focus:outline-none bg-transparent"
            onBlur={() => {
              // setTouched(true);
              onBlur?.();
            }}
            readOnly={!open}
          />

          <ChevronDown size={18} className={`${open ? "rotate-180" : ""}`} onClick={(e) => {
            e.stopPropagation();   // 🔑 IMPORTANT
            setOpen(prev => !prev);
          }} />
        </div>

        {open && (
          <div className="absolute z-50 w-full bg-white  border border-gray-300
 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
            {multiple && filteredOptions.length > 0 && (
              <label className="px-3 py-2 border-b border-gray-200 cursor-pointer flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={filteredOptions.every((option) =>
                    selectedValues.includes(typeof option === "object" ? option.value : option),
                  )}
                  onChange={handleSelectAll}
                  className="h-4 w-4"
                />
                <span>Select all</span>
              </label>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const optValue = typeof option === 'string' ? option : option.value;
                const optLabel = typeof option === 'string' ? option : option.label;
                return (
                  <div
                    key={`${optValue}-${index}`}
                    className={`px-3 py-2 cursor-pointer transition-all flex items-center gap-2
  hover:bg-gray-100
  ${(multiple ? selectedValues.includes(optValue) : value === optValue)
                        ? "bg-gray-100 text-gray-900 border border-gray-400 rounded-md"
                        : "border border-transparent"
                      }
`}

                    onClick={() => handleSelect(option)}
                  >
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(optValue)}
                        onChange={() => handleSelect(option)}
                        onClick={(event) => event.stopPropagation()}
                        className="h-4 w-4"
                      />
                    )}
                    <span>{optLabel}</span>
                  </div>
                );
              })
            ) : (
              <p className="px-3 py-2 text-gray-500 text-sm">No results found</p>
            )}
          </div>
        )}
      </div>

      {shouldShowError && (
        <p className="text-red-600 text-sm flex items-center gap-1">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;




// how to use this component:

// import SelectField from "../UI/SelectField";

// const parties = ["Tesla", "Tata Motors", "Reliance", "Infosys", "Wipro"];

// <SelectField
//   label="Select Party"
//   options={parties}
//   value={party}
//   onChange={setParty}
//   required
// />;
