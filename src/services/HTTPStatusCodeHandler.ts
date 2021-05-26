const handleOKRequestStatusCode = (response: Response) => {
  if (response.status !== 200) {
    throw Error(response.statusText);
  }
  return response;
};

const handleCreatedRequestStatusCode = (response: Response) => {
  if (response.status !== 201) {
    throw Error(response.statusText);
  }
  return response;
};

const handleAcceptedRequestStatusCode = (response: Response) => {
  if (response.status !== 202) {
    throw Error(response.statusText);
  }
  return response;
};

export { handleOKRequestStatusCode, handleAcceptedRequestStatusCode, handleCreatedRequestStatusCode };
