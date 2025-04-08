import { FaEye, FaEyeSlash } from "react-icons/fa";


export const PasswordToggle = ({ showPassword, togglePassword }: { showPassword: boolean; togglePassword: () => void }) => (
  <button
    type="button"
    onClick={togglePassword}
    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
    aria-label="Veksle synlighet av passord"
    aria-pressed={showPassword}
    title="Veksle synlighet av passord"
  >
    {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
  </button>
); 