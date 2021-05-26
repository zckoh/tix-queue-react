import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => (
  <Nav className="justify-content-center Navbar" activeKey="/">
    <Nav.Item>
      <Nav.Link as={Link} to="/">
        Tickets
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link as={Link} to="/departments">
        Departments
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link as={Link} to="/technicians">
        Technicians
      </Nav.Link>
    </Nav.Item>
  </Nav>
);

export default Navbar;
