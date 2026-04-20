const variantClass = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
};

const AppButton = ({ variant = "primary", className = "", children, ...props }) => {
  return (
    <button type="button" className={`${variantClass[variant] || variantClass.primary} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default AppButton;
