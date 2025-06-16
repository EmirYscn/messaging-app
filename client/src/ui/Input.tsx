function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="focus:outline-none border border-[var(--color-grey-300)] rounded-sm px-4 py-2 shadow-sm"
      {...props}
    />
  );
}

export default Input;
