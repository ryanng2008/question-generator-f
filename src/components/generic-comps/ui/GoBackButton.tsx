import { Link } from 'react-router-dom';

interface GoBackButtonProps {
  to: string;
  label?: string;
}

export const GoBackButton: React.FC<GoBackButtonProps> = ({ to, label = "← Go back" }) => {
  return (
    <Link
      to={to}
      className="text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-4 inline-block"
    >
      {label}
    </Link>
  );
};

export default GoBackButton;