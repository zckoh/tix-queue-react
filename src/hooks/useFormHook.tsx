import { useState } from "react";

const useForm = (initialValues: any, callback: any) => {
  const [inputs, setInputs] = useState(initialValues);
  const handleSubmit = (event: any) => {
    if (event) event.preventDefault();
    callback();
  };
  const handleInputChange = (event: any) => {
    event.persist();
    setInputs((inputs: any) => ({ ...inputs, [event.target.name]: event.target.value }));
  };
  return {
    handleSubmit,
    handleInputChange,
    inputs,
    setInputs,
  };
};
export default useForm;
