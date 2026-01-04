import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toTitleCase } from "../utils/formatters";

const InputField = ({
  // Basic props
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder = '',

  // Error handling props
  error = '',
  showError = false,

  // Validation props
  required = false,
  disabled = false,
  helperText = '',

  // Style props
  className = '',
  containerClassName = '',

  // Other input props
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const shouldShowError = showError && error;
  const isValid = false;

  const handleBlur = (e) => {
    setIsFocused(false);
    setIsTouched(true);
    onBlur?.(e);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  const getBorderColor = () => {
    if (shouldShowError) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (isFocused) return 'border-blue-500 focus:border-blue-500 focus:ring-blue-500';
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  const getInputClasses = () => {
    const baseClasses = `
      w-full px-3 py-2 border rounded-lg transition-all duration-200
      bg-white text-gray-900 placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-opacity-20
      disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
      ${getBorderColor()}
    `;

    const errorClasses = shouldShowError ? 'pr-10' : '';
    const passwordClasses = type === 'password' ? 'pr-10' : '';

    return `${baseClasses} ${errorClasses} ${passwordClasses} ${className}`;
  };

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <input
          type={getInputType()}
          value={value}
          onChange={onChange}
          onWheel={(e) => e.target.blur()}
          // onChange={(e) => {
          //   const newValue = props.capitalize ? toTitleCase(e.target.value) : e.target.value;
          //   onChange({ target: { value: newValue } });
          // }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={getInputClasses()}
          {...props}
        />

        {/* Right side icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {/* Password Toggle */}
          {type === 'password' && value && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {/* Error Icon */}
          {shouldShowError && (
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          )}


        </div>
      </div>

      {/* Helper Text and Error Message */}
      <div className="min-h-[20px]">
        {shouldShowError ? (
          <p className="text-red-600 text-sm flex items-center gap-1">
            <AlertCircle size={14} className="flex-shrink-0" />
            {error}
          </p>
        ) : helperText ? (
          <p className="text-gray-500 text-sm">{helperText}</p>
        ) : null}
      </div>
    </div>
  );
};

export default InputField;