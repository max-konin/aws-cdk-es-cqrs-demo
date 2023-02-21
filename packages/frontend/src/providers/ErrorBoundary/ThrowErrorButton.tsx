import { useEffect, useState } from 'react';

export const ThrowErrorButton = () => {
  const [error, setError] = useState(false);
  const onClick = () => {
    setError(true);
  };

  useEffect(() => {
    if (error) throw new Error();
  }, [error]);

  return (
    <button onClick={onClick}>
      Throw an error
    </button>
  );
};
