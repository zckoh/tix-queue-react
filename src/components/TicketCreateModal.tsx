import { useState } from "react";
import { Button, Modal, Form, Container, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import useTicketForm from "../hooks/useFormHook";
import { postNewTicket } from "../services";
import { Status, Notification, Department, Technician } from "../types";

import "../styles/Modal.css";
import moment from "moment";

interface CreateTicketModalPropTypes {
  handleClose: () => void;
  show: Boolean;
  allStatus: Array<Status>;
  allDepartments: Array<Department>;
  allTechnicians: Array<Technician>;
  handleNotification: (notification: Notification) => void;
}

const CreateTicketModal = (props: CreateTicketModalPropTypes) => {
  const { show, handleClose, allStatus, allDepartments, allTechnicians, handleNotification } = props;

  const [isLoading, setLoading] = useState(false);
  const [isCreated, setCreated] = useState(false);
  const [isError, setError] = useState(false);

  const createTicket = () => {
    // Prepare JSON object
    const { title, author, description, solution } = inputs;

    const newTicketToCreate = {
      title,
      author,
      description,
      solution: inputs.status !== "Completed" ? null : solution,
      status: allStatus?.find((status) => status.name === inputs.status),
      department: allDepartments?.find((department) => department.name === inputs.department),
      technician: allTechnicians?.find((technician) => technician.name === inputs.technician),
    };

    setError(false);
    setLoading(true);

    // Post new ticket data
    postNewTicket(newTicketToCreate)
      .then(() => {
        setLoading(false);
        setCreated(true);
        handleNotification({
          notificationId: uuidv4(),
          message: "✔️ - Ticket created successfully.",
          status: "success",
          show: true,
          createdAt: moment(),
        });
        closeCreateModal();
      })
      .catch(() => {
        setLoading(false);
        setError(true);
        handleNotification({
          notificationId: uuidv4(),
          message: "❌ - Failed to create ticket.",
          status: "failed",
          show: true,
          createdAt: moment(),
        });
      });
  };

  const { inputs, handleInputChange, handleSubmit, setInputs } = useTicketForm(
    { title: "", author: "", description: "", status: "New", solution: "", department: "N/A", technician: "N/A" },
    createTicket,
  );

  const onDepartmentChange = (event: any) => {
    if (inputs.department !== event.target.value) setInputs({ ...inputs, technician: "N/A" });
    handleInputChange(event);
  };

  const createButtonVariant = () => {
    if (isError) {
      return `danger`;
    }

    if (isCreated) {
      return `success`;
    }

    return `primary`;
  };

  const closeCreateModal = () => {
    // reset modal state
    setInputs({
      title: "",
      author: "",
      description: "",
      status: "New",
      solution: "",
      department: "N/A",
      technician: "N/A",
    });
    setCreated(false);
    setLoading(false);
    setError(false);
    handleClose();
  };

  return (
    <Modal size="lg" show={show} onHide={closeCreateModal} animation={true} className="modal-dark">
      <Form className="modal-form-input" onSubmit={handleSubmit}>
        <Container className="pb-3">
          <Modal.Header closeButton>
            <Modal.Title>Create Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="ticketTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control required type="text" name="title" onChange={handleInputChange} value={inputs.title} />
            </Form.Group>
            <Form.Group controlId="ticketAuthor">
              <Form.Label>Author</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email address"
                name="author"
                onChange={handleInputChange}
                value={inputs.author}
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
            <Form.Group controlId="ticketStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control required as="select" name="status" onChange={handleInputChange} value={inputs.status}>
                {allStatus?.map((status, i) => (
                  <option key={i}>{status.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="ticketDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter ticket description"
                name="description"
                onChange={handleInputChange}
                value={inputs.description}
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
            <Button type="submit" active={isLoading} disabled={isCreated} variant={createButtonVariant()}>
              {isCreated
                ? `Ticket Created`
                : isLoading
                ? `Creating...`
                : isError
                ? `Failed to create ticket`
                : // Default
                  `Create`}
            </Button>
          </Modal.Footer>
        </Container>
      </Form>
    </Modal>
  );
};

export default CreateTicketModal;
