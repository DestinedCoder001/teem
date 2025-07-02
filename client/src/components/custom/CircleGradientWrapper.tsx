const CircleGradientWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`rounded-full bg-gradient-to-tr from-primary to-secondary ${className}`}
    >
      {children}
    </div>
  );
};
export default CircleGradientWrapper;
