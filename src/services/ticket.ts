import { NewTicket, Ticket } from "../types";
import {
  handleOKRequestStatusCode,
  handleAcceptedRequestStatusCode,
  handleCreatedRequestStatusCode,
} from "./HTTPStatusCodeHandler";

// GET all tickets
const getAllTickets = async () => {
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/ticket/readAll`)
    .then(handleOKRequestStatusCode)
    .then((response) => response.json());
};

// POST new ticket
const postNewTicket = async (ticketToCreate: NewTicket) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticketToCreate),
  };

  return fetch(`${process.env.REACT_APP_BACKEND_URL}/ticket/add`, requestOptions)
    .then(handleCreatedRequestStatusCode)
    .then((response) => response.json());
};

// POST update ticket
const postUpdateTicket = async (ticketToUpdate: Ticket) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticketToUpdate),
  };

  return fetch(`${process.env.REACT_APP_BACKEND_URL}/ticket/update`, requestOptions)
    .then(handleAcceptedRequestStatusCode)
    .then((response) => response.json());
};

// DELETE ticket
const deleteTicketById = async (id: Number) => {
  const requestOptions = {
    method: "DELETE",
  };

  return fetch(`${process.env.REACT_APP_BACKEND_URL}/ticket/delete/${id}`, requestOptions)
    .then(handleOKRequestStatusCode)
    .then((response) => response.text());
};

export { getAllTickets, postNewTicket, postUpdateTicket, deleteTicketById };
