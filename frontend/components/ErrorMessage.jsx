function ErrorMessage({ errors }) {
  return (
    <div className="mb-4">
      {errors.map((error, index) => (
        <div key={index} className="bg-red-100 text-red-700 p-3 rounded mb-2">
          {error}
        </div>
      ))}
    </div>
  );
}

export default ErrorMessage;
