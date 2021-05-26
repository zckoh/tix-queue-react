import { Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./../styles/Title.css";

const Title = () => {
  return (
    <Container className="Title">
      <h1>
        <Nav.Link as={Link} to="/">
          Help Queue
        </Nav.Link>
      </h1>
    </Container>
  );
};

export default Title;
