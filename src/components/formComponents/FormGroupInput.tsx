import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { ValidationRequest, ValidationResult, ValidationUtil } from '../../utils/ValidationUtil';
import { ValidationRuleType } from '../../utils/ValidationRuleType';


interface GroupProps {
  label: string;
  name: string;
  type: string;
  attribute: string;
  validationRules: ValidationRuleType[];
  orientation?: any;
  update: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleChange2?: (event: React.ChangeEvent<HTMLInputElement>) => void
}
export const MyFormGroupInput = ({ label, name, type, attribute, validationRules, orientation, update }: GroupProps) => {
  //STATES
  const [value, setValue] = useState(attribute);
  const [errors, setErrors] = useState<Record<string, ValidationResult>>({});


  //HANDLES
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    validateInput(event.target.value);
    update(event)
  };

  const validateInput = (value: string) => {
    const validationRequests: ValidationRequest[] = validationRules.map(rule => ({
      type: rule.rule,
      value: value,
      errorMessage: rule.errorMessage,
      min: rule.min
    }))

    const results = ValidationUtil.validate(validationRequests)
    setErrors(results)
  }

  const handleBlur = () => {
    validateInput(value);
  };

  return (
    <Form.Group as={orientation} >
      <Form.Label> {label} </Form.Label>
      <Form.Control
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {Object.entries(errors).map(([key, res]) => {
        if (!res.isValid) {
          return <div key={key} className='text-danger'> {res.message}</div>
        }
        return null;
      })

      }
    </Form.Group>
  )
}