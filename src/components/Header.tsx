import { Container } from "react-bootstrap";

import Title from "./Title";
import "../styles/Header.css";

const Header = () => {
  return (
    <Container as="header" className="Header py-3">
      <Title />
    </Container>
  );
};

export default Header;
