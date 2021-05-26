import { handleOKRequestStatusCode } from "./HTTPStatusCodeHandler";

// GET all technicians
const getAllTechnicians = async () => {
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/technician/all`)
    .then(handleOKRequestStatusCode)
    .then((response) => response.json());
};

export { getAllTechnicians };
