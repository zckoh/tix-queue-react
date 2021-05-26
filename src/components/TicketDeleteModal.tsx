import moment from "moment";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { deleteTicketById } from "../services";
import { Notification } from "../types";

interface TicketDeleteModalPropTypes {
  show: Boolean;
  ticketTitle: String;
  ticketId: Number;
  handleClose: () => void;
  handleNotification: (notification: Notification) => void;
  handleSuccessDelete: () => void;
}

const TicketDeleteModal = (props: TicketDeleteModalPropTypes) => {
  const { show, ticketTitle, ticketId, handleClose, handleNotification, handleSuccessDelete } = props;

  const [isLoading, setLoading] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [isError, setError] = useState(false);

  const deleteTicket = () => {
    setLoading(true);

    // Post new ticket data
    deleteTicketById(ticketId)
      .then(() => {
        setLoading(false);
        setDeleted(true);
        handleNotification({
          notificationId: uuidv4(),
          message: `✔️ - Ticket "${ticketTitle}" deleted successfully.`,
          status: "success",
          show: true,
          createdAt: moment(),
        });
        closeAllModal();
      })
      .catch(() => {
        setLoading(false);
        setError(true);
        handleNotification({
          notificationId: uuidv4(),
          message: "❌ - Failed to delete ticket.",
          status: "failed",
          show: true,
          createdAt: moment(),
        });
      });
  };

  const closeAllModal = () => {
    handleClose();
    handleSuccessDelete();
  };

  return (
    <Modal
      show={show}
      onHide={() => handleClose()}
      className="modal-dark"
      animation={true}
      backdropClassName="delete-modal-backdrop"
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You are about to delete the following ticket:
        <br />- {ticketTitle}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {isDeleted ? `Close` : `Cancel`}
        </Button>

        <Button onClick={deleteTicket} active={isLoading} disabled={isDeleted} variant="danger">
          {isDeleted
            ? `Ticket Deleted`
            : isLoading
            ? `Deleting...`
            : isError
            ? `Failed to delete ticket`
            : // Default
              `Delete Ticket`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TicketDeleteModal;
