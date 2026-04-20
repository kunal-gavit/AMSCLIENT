const FormField = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input id={id} className="input-academic" {...props} />
    </div>
  );
};

export default FormField;
