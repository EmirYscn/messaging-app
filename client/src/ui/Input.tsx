function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="border border-[var(--color-grey-300)] bg-[var(--color-grey-0)] rounded-sm px-4 py-2 shadow-sm"
    />
  );
}

export default Input;
