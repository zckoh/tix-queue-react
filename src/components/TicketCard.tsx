import moment from "moment";
import { Row, Col, Card, Button } from "react-bootstrap";

import { Ticket } from "../types";

const prepareCardDescription = (description: String) => {
  if (description.length >= 150) return description.substring(1, 150) + `...`;
  return description;
};

interface TicketCardPropTypes {
  onClickViewTicket: (ticket: Ticket) => void;
  ticket: Ticket;
}

const TicketCard = (props: TicketCardPropTypes) => {
  const { onClickViewTicket, ticket } = props;

  return (
    <Card bg="dark" className="my-3">
      <Card.Body>
        <Card.Title className="text-truncate">{ticket.title}</Card.Title>
        <Card.Text>{prepareCardDescription(ticket.description)}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col>
            <small className="text-muted">
              Created <br /> {moment(ticket.createdAt).fromNow()}
            </small>
          </Col>
          <Col>
            <Button variant="primary" className="float-right" onClick={() => onClickViewTicket(ticket)}>
              View Ticket
            </Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default TicketCard;
