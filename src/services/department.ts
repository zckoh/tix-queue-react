import { handleOKRequestStatusCode } from "./HTTPStatusCodeHandler";

// GET all departments
const getAllDepartments = async () => {
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/department/all`)
    .then(handleOKRequestStatusCode)
    .then((response) => response.json());
};

export { getAllDepartments };
