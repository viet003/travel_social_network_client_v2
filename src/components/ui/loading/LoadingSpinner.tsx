import { ClipLoader } from 'react-spinners';

type LoadingSpinnerProps = {
  size?: number;
  color?: string;
};

const LoadingSpinner = ({ 
  size = 16, 
  color = '#3B82F6' // blue-600
}: LoadingSpinnerProps) => {
  return (
    <ClipLoader
      size={size}
      color={color}
      loading={true}
    />
  );
};

export default LoadingSpinner;

