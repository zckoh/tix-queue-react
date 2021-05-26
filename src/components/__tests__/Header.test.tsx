import { shallow } from "enzyme";

import Header from "../Header";
import Title from "../Title";

describe("<Header />", () => {
  it("contains a <Title/> component", () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.contains(<Title />)).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
});
