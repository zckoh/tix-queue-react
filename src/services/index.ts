import {
  handleOKRequestStatusCode,
  handleAcceptedRequestStatusCode,
  handleCreatedRequestStatusCode,
} from "./HTTPStatusCodeHandler";

import { getAllTickets, postNewTicket, postUpdateTicket, deleteTicketById } from "./ticket";
import { getAllStatus } from "./status";
import { getAllDepartments } from "./department";
import { getAllTechnicians } from "./technician";

export {
  handleOKRequestStatusCode,
  handleAcceptedRequestStatusCode,
  handleCreatedRequestStatusCode,
  getAllStatus,
  getAllDepartments,
  getAllTickets,
  postNewTicket,
  postUpdateTicket,
  deleteTicketById,
  getAllTechnicians,
};
