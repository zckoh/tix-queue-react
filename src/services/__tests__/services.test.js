import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();
import {
  handleOKRequestStatusCode,
  handleCreatedRequestStatusCode,
  handleAcceptedRequestStatusCode,
  getAllStatus,
  getAllTickets,
  postNewTicket,
  postUpdateTicket,
  deleteTicketById,
} from "../";

describe("handleOKRequestStatusCode", () => {
  it("should return response if status code is 200", () => {
    const testBlob = new Blob();
    const init = { status: 200, statusText: "This request status is A OK!" };
    const testResponse = new Response(testBlob, init);
    const returnedResponse = handleOKRequestStatusCode(testResponse);
    expect(returnedResponse).toEqual(testResponse);
  });

  it("should throw Error when wrong status code is returned", () => {
    const testBlob = new Blob();
    const init = { status: 400, statusText: "This request contains error" };
    const testResponse = new Response(testBlob, init);

    expect(() => {
      handleOKRequestStatusCode(testResponse);
    }).toThrow(Error("This request contains error"));
  });
});

describe("handleCreatedRequestStatusCode", () => {
  it("should return response if status code is 201", () => {
    const testBlob = new Blob();
    const init = { status: 201, statusText: "The ticket is created!" };
    const testResponse = new Response(testBlob, init);
    const returnedResponse = handleCreatedRequestStatusCode(testResponse);
    expect(returnedResponse).toEqual(testResponse);
  });

  it("should throw Error when wrong status code is returned", () => {
    const testBlob = new Blob();
    const init = { status: 400, statusText: "This request contains error" };
    const testResponse = new Response(testBlob, init);

    expect(() => {
      handleCreatedRequestStatusCode(testResponse);
    }).toThrow(Error("This request contains error"));
  });
});

describe("handleAcceptedRequestStatusCode", () => {
  it("should return response if status code is 202", () => {
    const testBlob = new Blob();
    const init = { status: 202, statusText: "This request is accepted by server" };
    const testResponse = new Response(testBlob, init);
    const returnedResponse = handleAcceptedRequestStatusCode(testResponse);
    expect(returnedResponse).toEqual(testResponse);
  });

  it("should throw Error when wrong status code is returned", () => {
    const testBlob = new Blob();
    const init = { status: 400, statusText: "This request contains error" };
    const testResponse = new Response(testBlob, init);

    expect(() => {
      handleAcceptedRequestStatusCode(testResponse);
    }).toThrow(Error("This request contains error"));
  });
});

const mockAllStatusData = [
  {
    id: "1",
    name: "New",
  },
];

const mockAllTicketsData = [
  {
    id: 1,
    title: "Test ticket 1",
    author: "author0j@example.com",
    description: "This is a test description",
    createdAt: "2021-03-28T19:45:50.582287",
    status: {
      id: 1,
      name: "New",
    },
  },
  {
    id: 2,
    title: "Test Ticket 2",
    author: "author2@example.com",
    description: "This is a multiple line description\nMany words inside",
    createdAt: "2021-03-28T19:46:00.429912",
    status: {
      id: 2,
      name: "In Progress",
    },
  },
];

beforeEach(() => {
  fetch.resetMocks();
});

describe("getAllStatus", () => {
  it("should return array of status with correct length", async () => {
    fetch.mockResponseOnce(JSON.stringify(mockAllStatusData));
    const allStatus = await getAllStatus();
    expect(Array.isArray(allStatus)).toBe(true);
    expect(allStatus).toHaveLength(mockAllStatusData.length);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe("getAllTickets", () => {
  it("should return array of tickets with correct length", async () => {
    fetch.mockResponseOnce(JSON.stringify(mockAllTicketsData));
    const allTickets = await getAllTickets();
    expect(Array.isArray(allTickets)).toBe(true);
    expect(allTickets).toHaveLength(mockAllTicketsData.length);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe("postNewTicket", () => {
  it("should return the ticket with createdAt and ID", async () => {
    const newTicketToCreate = {
      title: "New Ticket to create",
      author: "creator@author.com",
      description: "Description of ticket",
      status: {
        id: "1",
        name: "New",
      },
    };

    const mockNewTicketData = {
      id: 1,
      title: "New Ticket to create",
      author: "creator@author.com",
      description: "Description of ticket",
      createdAt: "2021-03-28T19:45:50.582287",
      status: {
        id: 1,
        name: "New",
      },
    };

    fetch.mockResponseOnce(JSON.stringify(mockNewTicketData), {
      status: 201,
      statusText: "This ticket has been created",
    });
    const createdTicket = await postNewTicket(newTicketToCreate);
    expect(createdTicket.id).toBe(1);
    expect(createdTicket.createdAt).toBe("2021-03-28T19:45:50.582287");
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe("postUpdateTicket", () => {
  it("should return the same ticket", async () => {
    const newTicketToUpdate = {
      id: 1,
      title: "Updated Ticket",
      author: "creator@author.com",
      description: "Description of ticket",
      createdAt: "2021-03-28T19:45:50.582287",
      status: {
        id: 1,
        name: "New",
      },
    };

    const mockUpdatedTicketData = {
      id: 1,
      title: "Updated Ticket",
      author: "creator@author.com",
      description: "Description of ticket",
      createdAt: "2021-03-28T19:45:50.582287",
      status: {
        id: 1,
        name: "New",
      },
    };

    fetch.mockResponseOnce(JSON.stringify(mockUpdatedTicketData),{
      status: 202,
      statusText: "This ticket has been updated",
    });
    const createdTicket = await postUpdateTicket(newTicketToUpdate);
    expect(createdTicket.id).toBe(1);
    expect(createdTicket.createdAt).toBe("2021-03-28T19:45:50.582287");
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
