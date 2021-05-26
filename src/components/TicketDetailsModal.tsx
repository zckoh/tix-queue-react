import { useState } from "react";
import moment from "moment";
import { Button, Modal, Form, Container, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import useTicketForm from "../hooks/useFormHook";
import { postUpdateTicket } from "../services";
import { Status, Notification, Ticket, Department, Technician } from "../types";
import TicketDeleteModal from "./TicketDeleteModal";

import "../styles/Modal.css";

interface TicketDetailsModalPropTypes {
  ticket: Ticket | undefined;
  show: Boolean;
  allStatus: Array<Status>;
  allDepartments: Array<Department>;
  allTechnicians: Array<Technician>;
  handleClose: () => void;
  handleNotification: (notification: Notification) => void;
}

const TicketDetailsModal = (props: TicketDetailsModalPropTypes) => {
  const { show, ticket, allStatus, allDepartments, allTechnicians, handleClose, handleNotification } = props;

  const [amUpdating, setUpdating] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isUpdated, setUpdated] = useState(false);
  const [isError, setError] = useState(false);

  const formatDateString = (date: string | undefined) => moment(date).format("DD/MM/YYYY HH:mm:ss");

  const toggleUpdate = () => {
    setUpdating(!amUpdating);
  };

  const updateButtonVariant = () => {
    if (isError) {
      return `danger`;
    }

    if (isUpdated) {
      return `success`;
    }

    return `primary`;
  };

  const updateTicket = () => {
    // Prepare JSON object
    const { title, author, description, createdAt, id, solution } = inputs;

    const ticketToUpdate = {
      id,
      title,
      author,
      description,
      status: allStatus?.find((status) => status.name === inputs.status),
      createdAt,
      solution: inputs.status !== "Completed" ? null : solution,
      department: allDepartments?.find((department) => department.name === inputs.department),
      technician: allTechnicians?.find((technician) => technician.name === inputs.technician),
    };

    setError(false);
    setLoading(true);

    // Post new ticket data
    postUpdateTicket(ticketToUpdate)
      .then(() => {
        setLoading(false);
        setUpdated(true);
        handleNotification({
          notificationId: uuidv4(),
          message: "✔️ - Ticket updated successfully.",
          status: "success",
          show: true,
          createdAt: moment(),
        });
        closeViewModal();
      })
      .catch(() => {
        setLoading(false);
        setError(true);
        handleNotification({
          notificationId: uuidv4(),
          message: "❌ - Failed to update ticket.",
          status: "failed",
          show: true,
          createdAt: moment(),
        });
      });
  };

  const { inputs, handleInputChange, handleSubmit, setInputs } = useTicketForm(
    {
      id: 0,
      title: "",
      author: "",
      description: "",
      status: "",
      createdAt: "",
      solution: "",
      department: "N/A",
      technician: "N/A",
    },
    updateTicket,
  );

  const onDepartmentChange = (event: any) => {
    if (inputs.department !== event.target.value) setInputs({ ...inputs, technician: "N/A" });
    handleInputChange(event);
  };

  const populateModal = () => {
    setInputs({
      id: ticket?.id,
      title: ticket?.title,
      author: ticket?.author,
      description: ticket?.description,
      status: ticket?.status?.name,
      createdAt: ticket?.createdAt,
      solution: ticket?.solution ? ticket.solution : "",
      department: ticket?.department ? ticket.department.name : "N/A",
      technician: ticket?.technician ? ticket.technician.name : "N/A",
    });
  };

  const closeViewModal = () => {
    setInputs({
      title: "",
      author: "",
      description: "",
      status: "",
      createdAt: "",
      solution: "",
      department: "N/A",
      technician: "N/A",
    });
    setUpdating(false);
    setUpdated(false);
    setLoading(false);
    setError(false);
    handleClose();
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeletModal = () => setShowDeleteModal(true);

  return (
    <Modal size="lg" show={show} onShow={populateModal} onHide={closeViewModal} animation={true} className="modal-dark">
      <Form className="modal-form-input" onSubmit={handleSubmit}>
        <Container className="pb-3">
          <Modal.Header closeButton>
            <Modal.Title>{inputs?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-end">
              <Button className="mr-1" variant={amUpdating ? "secondary" : "success"} onClick={toggleUpdate}>
                {amUpdating ? `Disable Updating` : `Enable Updating`}
              </Button>
              <Button className="ml-1" variant="danger" onClick={handleShowDeletModal}>
                Delete
              </Button>
            </div>
            <Form.Group controlId="ticketTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                name="title"
                value={inputs?.title}
                disabled={!amUpdating}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="ticketAuthor">
              <Form.Label>Author</Form.Label>
              <Form.Control
                required
                type="email"
                name="author"
                placeholder="Enter email address"
                value={inputs?.author}
                disabled={!amUpdating}
                onChange={handleInputChange}
              />
              <Form.Text className="text-muted">Please enter the email address of the ticket author.</Form.Text>
            </Form.Group>
            <Form.Row>
              <Form.Group as={Col} controlId="ticketDepartment">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  required
                  as="select"
                  name="department"
                  value={inputs?.department}
                  disabled={!amUpdating}
                  onChange={onDepartmentChange}
                >
                  <option>N/A</option>
                  {allDepartments?.map((department, i) => (
                    <option key={i}>{department.name}</option>
                  ))}
                </Form.Control>
                <Form.Text className="text-muted">Department for the ticket to be assigned to.</Form.Text>
              </Form.Group>
              <Form.Group as={Col} controlId="ticketTechnician">
                <Form.Label>Assignee</Form.Label>
                <Form.Control
                  required
                  as="select"
                  name="technician"
                  value={inputs?.technician}
                  disabled={!amUpdating}
                  onChange={handleInputChange}
                >
                  <option>N/A</option>
                  {allTechnicians
                    ?.filter((technician) =>
                      inputs?.department === "N/A" ? true : technician.department?.name === inputs?.department,
                    )
                    ?.map((technician, i) => (
                      <option key={i}>{technician.name}</option>
                    ))}
                </Form.Control>
                <Form.Text className="text-muted">Assignee who will work on the ticket.</Form.Text>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="ticketStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  required
                  as="select"
                  name="status"
                  value={inputs?.status}
                  disabled={!amUpdating}
                  onChange={handleInputChange}
                >
                  {allStatus?.map((status, i) => (
                    <option key={i}>{status.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="ticketTimestamp">
                <Form.Label>Created At</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="createdAt"
                  defaultValue={formatDateString(ticket?.createdAt)}
                  disabled
                />
              </Form.Group>
            </Form.Row>
            <Form.Group controlId="ticketDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Enter ticket description"
                value={inputs?.description}
                disabled={!amUpdating}
                onChange={handleInputChange}
              />
              <Form.Text className="text-muted">
                This description will help the techinician to understand the issue you are facing.
              </Form.Text>
            </Form.Group>
            {inputs.status === "Completed" && (
              <Form.Group controlId="ticketSolution">
                <Form.Label>Solution</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter ticket solution"
                  name="solution"
                  disabled={!amUpdating}
                  onChange={handleInputChange}
                  value={inputs.solution}
                />
                <Form.Text className="text-muted">
                  This solution will help other users to solve similar issues.
                </Form.Text>
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeViewModal}>
              {amUpdating ? `Cancel` : `Close`}
            </Button>
            <Button type="submit" active={isLoading} disabled={isUpdated} variant={updateButtonVariant()}>
              {isUpdated
                ? `Ticket Updated`
                : isLoading
                ? `Updating...`
                : isError
                ? `Failed to update ticket`
                : // Default
                  `Save Changes`}
            </Button>
          </Modal.Footer>
        </Container>
      </Form>

      <TicketDeleteModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleSuccessDelete={closeViewModal}
        ticketTitle={inputs.title}
        ticketId={inputs.id}
        handleNotification={handleNotification}
      />
    </Modal>
  );
};

export default TicketDetailsModal;
