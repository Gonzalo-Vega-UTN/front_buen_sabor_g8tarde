
import { Form } from 'react-bootstrap';

// Define the props for the Select component, including a generics for the option type
interface SelectProps<T> {
  options: T[]; // Array of options
  getOptionLabel: (option: T) => string; // Function to determine the label for each option
  getOptionValue: (option: T) => string; // Function to determine the value for each option
  onChange: (option: any | null, name: string) => void
  selectedOption?: T | null; // Currently selected option (for a controlled component)
  orientation: any;
  className?: string;
  label?: string
  name: string
}
export const FormGroupSelect = <T,>
  ({ options, getOptionLabel, getOptionValue, onChange, selectedOption, orientation, className, label = "Seleccionar", name }: SelectProps<T>) => {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const selected = options.find(option => getOptionValue(option) === value);
    onChange(selected || null, name);
  };

  return (

    <Form.Group
      className={className}
      as={orientation} controlId="formCategoria">
      <Form.Label>{label}</Form.Label>
      <Form.Select
        onChange={handleChange}
        value={selectedOption ? getOptionValue(selectedOption) : ''}
        aria-label="Custom select example"
      >
        <option value="">Seleccionar...</option>
        {options.map(option => (
          <option key={getOptionValue(option)} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}
