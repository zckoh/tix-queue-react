import { shallow } from "enzyme";

import { Card, Button } from "react-bootstrap";

import TicketCard from "../TicketCard";

const ticket = {
  id: 1,
  title: "Test Ticket 1",
  author: "author2@example.com",
  description: "This is a multiple line description\nMany words inside",
  createdAt: "2021-03-28T19:46:00.429912",
  status: {
    id: 2,
    name: "In Progress",
  },
};

describe("<TicketCard />", () => {
  const mockOnClickViewTicket = jest.fn();
  const wrapper = shallow(<TicketCard ticket={ticket} onClickViewTicket={mockOnClickViewTicket} />);

  it("should display the ticket title", () => {
    expect(wrapper.contains(<Card.Title className="text-truncate">{ticket.title}</Card.Title>)).toEqual(true);
  });

  it("should display the ticket description", () => {
    expect(wrapper.contains(<Card.Text>{ticket.description}</Card.Text>)).toEqual(true);
  });

  it('should contain a "View Ticket" button', () => {
    const button = wrapper.find(Button);
    expect(button.text()).toEqual("View Ticket");
  });

  it("View Ticket button should run onClickViewTicket when clicked", () => {
    const button = wrapper.find(Button);
    button.simulate("click");
    expect(mockOnClickViewTicket).toHaveBeenCalled();
  });
});
