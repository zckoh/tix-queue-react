import { mount } from "enzyme";
import { Button, Modal } from "react-bootstrap";
import { waitFor } from "@testing-library/react";
import TicketDeleteModal from "../TicketDeleteModal";
import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe("<TicketDeleteModal />", () => {
  const mockHandleClose = jest.fn();
  const mockHandleNotification = jest.fn();
  const mockHandleSuccessDelete = jest.fn();

  const inputTicketTitle = "This is a ticket title";
  const inputTicketId = 10;

  const wrapper = mount(
    <TicketDeleteModal
      show={false}
      handleClose={mockHandleClose}
      handleSuccessDelete={mockHandleSuccessDelete}
      ticketTitle={inputTicketTitle}
      ticketId={inputTicketId}
      handleNotification={mockHandleNotification}
    />,
  );

  it(`should correctly renders component`, () => {
    expect(wrapper).toMatchSnapshot();
  });

  it(`should display ticket information when modal is shown`, () => {
    // Show Modal
    wrapper.setProps({ show: true });
    wrapper.update();
    const ticketDeleteModal = wrapper.find(Modal).first();
    expect(ticketDeleteModal.props().show).toBeTruthy();

    const modalBody = ticketDeleteModal.find(Modal.Body);
    expect(modalBody.props().children).toContain(inputTicketTitle);
  });

  it(`should call all handle props function when click delete button`, async () => {
    fetch.mockResponseOnce(`Ticket with id - ${inputTicketId} is deleted`);

    const deleteButton = wrapper.find(Button).findWhere((n) => n.props().variant === "danger");
    deleteButton.simulate("click");

    await waitFor(() => {
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
      expect(mockHandleNotification).toHaveBeenCalledTimes(1);
      expect(mockHandleSuccessDelete).toHaveBeenCalledTimes(1);
    });
  });
});
