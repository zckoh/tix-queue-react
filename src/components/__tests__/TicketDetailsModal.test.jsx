import { mount } from "enzyme";
import { waitFor } from "@testing-library/react";
import moment from "moment";
import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();
beforeEach(() => {
  fetch.resetMocks();
});

import { Button, Modal, Form } from "react-bootstrap";

import TicketDetailsModal from "../TicketDetailsModal";

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

const updatedTicket = {
  id: 1,
  title: "Test Ticket 1",
  author: "author2@example.com",
  description: "This is a updated ticket description",
  createdAt: "2021-03-28T19:46:00.429912",
  status: {
    id: 2,
    name: "In Progress",
  },
};

const allStatus = [
  {
    id: 1,
    name: "New",
  },
  {
    id: 2,
    name: "In Progress",
  },
  {
    id: 3,
    name: "Completed",
  },
];

const allTechnicians = [
  {
    id: 4,
    name: "Zac Koh",
    department: {
      id: 2,
      name: "IT",
    },
  },
  {
    id: 6,
    name: "Sam smith",
    department: {
      id: 3,
      name: "Cloud",
    },
  },
  {
    id: 7,
    name: "post.malone@helpqueue.com",
    department: {
      id: 3,
      name: "Cloud",
    },
  },
];

const allDepartments = [
  {
    id: 1,
    name: "Hardware",
  },
  {
    id: 2,
    name: "IT",
  },
  {
    id: 3,
    name: "Cloud",
  },
  {
    id: 9,
    name: "AWS",
  },
];
describe("<TicketDetailsModal />", () => {
  const mockHandleClose = jest.fn();
  const mockHandleNotification = jest.fn();
  const wrapper = mount(
    <TicketDetailsModal
      ticket={ticket}
      show={false}
      allStatus={allStatus}
      handleClose={mockHandleClose}
      handleNotification={mockHandleNotification}
      allTechnicians={allTechnicians}
      allDepartments={allDepartments}
    />,
  );

  it(`should correctly renders component`, () => {
    expect(wrapper).toMatchSnapshot();
  });

  it(`should display ticket information when modal is shown`, () => {
    // Show Modal
    wrapper.setProps({ show: true });
    wrapper.update();
    const ticketDetailsModal = wrapper.find(Modal).first();
    expect(ticketDetailsModal.props().show).toBeTruthy();

    const modalTitle = ticketDetailsModal.find(Modal.Title);
    expect(modalTitle.props().children).toEqual(ticket.title);

    const ticketTitle = ticketDetailsModal
      .find(Form.Control)
      .findWhere((n) => n.props().name === "title")
      .first();
    expect(ticketTitle.props().value).toEqual(ticket.title);

    const ticketAuthor = ticketDetailsModal
      .find(Form.Control)
      .findWhere((n) => n.props().name === "author")
      .first();
    expect(ticketAuthor.props().value).toEqual(ticket.author);

    const ticketDescription = ticketDetailsModal
      .find(Form.Control)
      .findWhere((n) => n.props().name === "description")
      .first();
    expect(ticketDescription.props().value).toEqual(ticket.description);

    const ticketStatus = ticketDetailsModal
      .find(Form.Control)
      .findWhere((n) => n.props().name === "status")
      .first();
    expect(ticketStatus.props().value).toEqual(ticket.status.name);

    const ticketCreatedAt = ticketDetailsModal
      .find(Form.Control)
      .findWhere((n) => n.props().name === "createdAt")
      .first();
    expect(ticketCreatedAt.props().defaultValue).toEqual(moment(ticket.createdAt).format("DD/MM/YYYY HH:mm:ss"));
  });

  describe(`Update Toggle Button`, () => {
    it(`should enable editing on Form.Control once clicked`, () => {
      const updateButton = wrapper.find(Button).first();
      expect(updateButton.props().variant).toEqual(`success`);

      updateButton.simulate("click");
      wrapper.update();

      const ticketTitle = wrapper
        .find(Modal)
        .first()
        .find(Form.Control)
        .findWhere((n) => n.props().name === "title")
        .first();
      expect(ticketTitle.props().disabled).toBeFalsy();
    });
  });

  describe(`Updating Ticket`, () => {
    it(`successful update should update button to show updated message `, async () => {
      fetch.mockResponseOnce(JSON.stringify(updatedTicket), { status: 202 });
      const ticketDescription = wrapper.find("textarea").first();
      ticketDescription.instance().value = "foo";

      const updateButton = wrapper
        .find(Button)
        .findWhere((n) => n.props().type === "submit")
        .first();
      updateButton.simulate("submit");

      await waitFor(() => {
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
        expect(mockHandleNotification).toHaveBeenCalledTimes(1);
      });
    });
  });
});
