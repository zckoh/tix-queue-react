import moment from "moment";

export interface PropTypes {
  className: string;
}

export interface Status {
  id: Number;
  name: String;
}

export interface Department {
  id: Number;
  name: String;
}

export interface Technician {
  id: Number;
  name: String;
  department: Department | undefined;
}
export interface Ticket {
  id: Number | undefined;
  title: String;
  author: String;
  description: String;
  status: Status | undefined;
  createdAt: string;
  solution: String | null;
  department: Department | undefined;
  technician: Technician | undefined;
}

export interface NewTicket {
  title: String;
  author: String;
  description: String;
  status: Status | undefined;
  solution: String | null;
  department: Department | undefined;
  technician: Technician | undefined;
}

export interface Notification {
  message: String;
  status: String;
  notificationId: String;
  show: boolean;
  createdAt: moment.Moment;
}
