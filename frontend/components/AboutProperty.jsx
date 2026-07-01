function AboutProperty({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-[90%] max-w-4xl max-h-[85vh] overflow-y-auto p-8">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-3xl hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold mb-4 mt-8">{title}</h2>

        <div className="w-full h-px bg-gray-300 mb-8"></div>

        {children}
      </div>
    </div>
  );
}

export default AboutProperty;
