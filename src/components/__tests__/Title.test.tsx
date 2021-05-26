import { shallow } from "enzyme";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Title from "../Title";

describe("<Title />", () => {
  it("contains a <Title/> component", () => {
    const wrapper = shallow(<Title />);
    expect(
      wrapper.contains(
        <h1>
          <Nav.Link as={Link} to="/">
            Help Queue
          </Nav.Link>
        </h1>,
      ),
    ).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
});
