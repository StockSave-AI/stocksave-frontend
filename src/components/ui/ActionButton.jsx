function ActionButton({ text }) {
  return (
    <button
      type="submit"
      className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-button transition mt-8 "
    >
      {text}
    </button>
  );
}

export default ActionButton;
