import { useState } from "react";

const useForm = (callback) => {
  const [values, setValues] = useState({ });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    console.log('Event Target Name', event.target.name)
    const auxValues = { ...values };
    console.log('VALUES', values)
    auxValues[event.target.name] = event.target.value;
    setValues(auxValues);
  };

  const handleSubmit = callback => event => {
    event.preventDefault();
    setLoading(true);
    callback();
    setLoading(false);
  };

  return [{ values, loading }, handleChange, handleSubmit];
};

export default useForm;