import { handleOKRequestStatusCode } from "./HTTPStatusCodeHandler";

// GET all status
const getAllStatus = async () => {
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/status/all`)
    .then(handleOKRequestStatusCode)
    .then((response) => response.json());
};

export { getAllStatus };
