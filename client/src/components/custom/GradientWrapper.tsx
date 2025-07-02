const GradientWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`bg-gradient-to-tr from-primary to-secondary ${className}`}
    >
      {children}
    </div>
  );
};
export default GradientWrapper;
