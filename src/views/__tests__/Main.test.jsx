import { mount } from "enzyme";
import { Button, Modal, Toast } from "react-bootstrap";
import { waitFor } from "@testing-library/react";
import Main from "../../views/Main";
import { act, render, cleanup } from "@testing-library/react";
import { enableFetchMocks } from "jest-fetch-mock";
import TicketCard from "../../components/TicketCard";
enableFetchMocks();

beforeEach(() => {
  fetch.resetMocks();
  // hide console.error when testing
  jest.spyOn(console, "error").mockImplementation(() => {});
});

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

const mockAllTicketsData = [
  {
    id: 1,
    title: "whatt",
    author: "test@test.com",
    description: "updated description",
    solution: "aweosme solution",
    createdAt: "2021-04-05T12:20:01.939398",
    status: {
      id: 3,
      name: "Completed",
    },
    department: null,
    technician: null,
  },
  {
    id: 3,
    title: "New ticket",
    author: "new@we.com",
    description: "no solution yet",
    solution: null,
    createdAt: "2021-04-07T21:53:59.768904",
    status: {
      id: 2,
      name: "In Progress",
    },
    department: {
      id: 1,
      name: "Hardware",
    },
    technician: null,
  },
  {
    id: 5,
    title: "Tick without department",
    author: "zhengcong.koh@barclays.com",
    description: "THis is the second 22222 asdsad the ticket",
    solution: null,
    createdAt: "2021-04-09T14:52:33.554073",
    status: {
      id: 2,
      name: "In Progress",
    },
    department: null,
    technician: null,
  },
  {
    id: 6,
    title: "Tick with department",
    author: "zhengcong.koh@barclays.com",
    description: "THis is the second 22222 asdsad the ticket",
    solution: null,
    createdAt: "2021-04-09T14:53:09.408862",
    status: {
      id: 2,
      name: "In Progress",
    },
    department: null,
    technician: null,
  },
  {
    id: 7,
    title: "Tick with department",
    author: "zhengcong.koh@barclays.com",
    description: "THis is the second 22222 asdsad the ticket",
    solution: null,
    createdAt: "2021-04-09T14:53:25.262207",
    status: {
      id: 3,
      name: "Completed",
    },
    department: {
      id: 2,
      name: "IT",
    },
    technician: null,
  },
  {
    id: 8,
    title: "Hardware ticket",
    author: "ticket@hardware.com",
    description: "laksjd",
    solution: "done solution",
    createdAt: "2021-04-12T21:37:58.662237",
    status: {
      id: 3,
      name: "Completed",
    },
    department: {
      id: 3,
      name: "Cloud",
    },
    technician: null,
  },
  {
    id: 9,
    title: "Add more test cases to our application",
    author: "nothgin@not.com",
    description: "Adding more test cases will help improve our code quality",
    solution: "",
    createdAt: "2021-04-12T21:43:31.636341",
    status: {
      id: 3,
      name: "Completed",
    },
    department: null,
    technician: {
      id: 4,
      name: "Zac Koh",
      department: {
        id: 2,
        name: "IT",
      },
    },
  },
  {
    id: 10,
    title: "ticket without asignee & department",
    author: "test@test.com",
    description: "lkwq",
    solution: null,
    createdAt: "2021-04-14T15:12:41.983046",
    status: {
      id: 1,
      name: "New",
    },
    department: {
      id: 1,
      name: "Hardware",
    },
    technician: {
      id: 5,
      name: "Tif Koh",
      department: {
        id: 2,
        name: "IT",
      },
    },
  },
  {
    id: 11,
    title: "ticket with department & technician",
    author: "qlkwe@lqkwe.com",
    description: "lkasj",
    solution: null,
    createdAt: "2021-04-14T15:13:10.649452",
    status: {
      id: 1,
      name: "New",
    },
    department: {
      id: 2,
      name: "IT",
    },
    technician: {
      id: 4,
      name: "Zac Koh",
      department: {
        id: 2,
        name: "IT",
      },
    },
  },
  {
    id: 14,
    title: "new fixed ticket",
    author: "ticket@fixe.com",
    description: "lkasdj",
    solution: null,
    createdAt: "2021-04-14T15:20:43.993831",
    status: {
      id: 1,
      name: "New",
    },
    department: {
      id: 1,
      name: "Hardware",
    },
    technician: {
      id: 7,
      name: "post.malone@helpqueue.com",
      department: {
        id: 3,
        name: "Cloud",
      },
    },
  },
];

describe("<Main />", () => {
  const mockHandleClose = jest.fn();
  const mockHandleNotification = jest.fn();
  const mockHandleSuccessDelete = jest.fn();

  const inputTicketTitle = "This is a ticket title";
  const inputTicketId = 10;

  it(`should correctly render component`, async () => {
    let wrapper;
    fetch.mockResponses(
      [JSON.stringify(allStatus)],
      [JSON.stringify(allTechnicians)],
      [JSON.stringify(mockAllTicketsData)],
      [JSON.stringify(allDepartments)],
    );
    await waitFor(() => {
      wrapper = mount(<Main className="py-5" />);
    });
    expect(wrapper).toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it(`when clicked refresh button, should refetch data again`, async () => {
    let wrapper;
    fetch.mockResponses(
      [JSON.stringify(allStatus)],
      [JSON.stringify(allTechnicians)],
      [JSON.stringify(mockAllTicketsData)],
      [JSON.stringify(allDepartments)],
      [JSON.stringify(allStatus)],
      [JSON.stringify(allTechnicians)],
      [JSON.stringify(mockAllTicketsData)],
      [JSON.stringify(allDepartments)],
    );
    // Wait for Main component to be mounted
    await waitFor(() => {
      wrapper = mount(<Main className="py-5" />);
    });
    wrapper.update();

    const refreshButton = wrapper
      .find(Button)
      .findWhere((n) => n.prop("children") === "Refresh")
      .first();

    refreshButton.simulate("click");
    wrapper.update();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(8);
    });
  });
});
