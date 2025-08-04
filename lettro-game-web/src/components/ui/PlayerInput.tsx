import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PlayerInputProps {
  type?: 'text' | 'email' | 'password';
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  id?: string;
}

const PlayerInput: React.FC<PlayerInputProps> = ({
  type = 'text',
  label,
  value,
  onChange,
  placeholder = '',
  showPassword,
  onTogglePassword,
  id
}) => {
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
            type === 'password' ? 'pr-12' : ''
          }`}
        />
        {type === 'password' && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerInput;