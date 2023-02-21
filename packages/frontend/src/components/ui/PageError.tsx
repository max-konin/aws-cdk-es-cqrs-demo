export const PageError = () => {
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div>
      <p>Unexpected error</p>
      <button onClick={reloadPage}>Reload page</button>
    </div>
  );
};
