import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Button, Toast, Dropdown, DropdownButton } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import TicketCard from "../components/TicketCard";
import TicketDetailsModal from "../components/TicketDetailsModal";
import TicketCreateModal from "../components/TicketCreateModal";
import { getAllDepartments, getAllStatus, getAllTechnicians, getAllTickets } from "../services";
import { PropTypes, Status, Ticket, Notification, Department, Technician } from "../types";

import "../styles/Main.css";
import "../styles/Toast.css";

const emptyTicket: Ticket = {
  id: undefined,
  title: "",
  author: "",
  description: "",
  status: undefined,
  createdAt: "",
  solution: null,
  department: undefined,
  technician: undefined,
};

const Main = (props: PropTypes) => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // States populated from backend
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [allStatus, setAllStatus] = useState<Status[]>([]);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [allTechnicians, setAllTechnicians] = useState<Technician[]>([]);

  // States populated from frontend
  const [currentTicket, setCurrentTicket] = useState<Ticket>(emptyTicket);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const hideNotification = (uuid: String) => {
    setNotifications((currentNotifications) => {
      const notificationIndex = currentNotifications.findIndex((n) => n.notificationId === uuid);
      let updatedNotifications = [...currentNotifications];

      updatedNotifications[notificationIndex].show = false;

      // clear notifications array if it gets too large
      if (updatedNotifications.length > 10) {
        updatedNotifications = [];
      }
      return updatedNotifications;
    });
  };

  const closeToast = (uuid: String) => () => hideNotification(uuid);

  const fetchAllStatus = useCallback(async () => {
    getAllStatus()
      .catch((error) => {
        updateNotificationList({
          notificationId: uuidv4(),
          message: "❌ - Failed to load all status.",
          status: "failed",
          show: true,
          createdAt: moment(),
        });
        console.error(error);
        throw error;
      })
      .then((statuses) => {
        setAllStatus(statuses);
      });
  }, []);

  const fetchAllDepartments = useCallback(async () => {
    getAllDepartments()
      .catch((error) => {
        updateNotificationList({
          notificationId: uuidv4(),
          message: "❌ - Failed to load all departments.",
          status: "failed",
          show: true,
          createdAt: moment(),
        });
        console.error(error);
        throw error;
      })
      .then((departments) => {
        setAllDepartments(departments);
      });
  }, []);

  const fetchAllTechnicians = useCallback(async () => {
    await getAllTechnicians()
      .catch((error) => {
        updateNotificationList({
          notificationId: uuidv4(),
          message: "❌ - Failed to load all technicians.",
          status: "failed",
          show: true,
          createdAt: moment(),
        });
        console.error(error);
        throw error;
      })
      .then((technician) => {
        setAllTechnicians(technician);
      });
  }, []);

  const fetchAllTickets = useCallback(async () => {
    await getAllTickets()
      .catch((error) => {
        updateNotificationList({
          notificationId: uuidv4(),
          message: "❌ - Failed to load all tickets.",
          status: "failed",
          show: true,
          createdAt: moment(),
        });
        console.error(error);
        throw error;
      })
      .then((tickets) => {
        setAllTickets(tickets);
      });
  }, []);

  useEffect(() => {
    fetchAllStatus();
    fetchAllDepartments();
    fetchAllTickets();
    fetchAllTechnicians();
  }, [fetchAllTickets, fetchAllStatus, fetchAllDepartments, fetchAllTechnicians]);

  const updateNotificationList = (newNotification: Notification): void => {
    setNotifications((currentNotifications) => [...currentNotifications, newNotification]);
  };

  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
    setCurrentTicket(emptyTicket);
    fetchAllTickets();
  };
  const handleShowTicketModal = (ticket: Ticket) => {
    setCurrentTicket(ticket);
    setShowTicketModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    fetchAllTickets();
  };
  const handleShowCreateModal = () => setShowCreateModal(true);

  const refreshAll = async () => {
    let success = true;
    try {
      await fetchAllTickets();
      await fetchAllStatus();
      await fetchAllDepartments();
      await fetchAllTechnicians();
    } catch (error) {
      success = false;
    }

    if (success) {
      updateNotificationList({
        notificationId: uuidv4(),
        message: "✔️ - Successfully refreshed all tickets.",
        status: "success",
        show: true,
        createdAt: moment(),
      });
    }
  };

  const [sortOption, setSortOption] = useState("0");

  const displaySortByTitle = () => {
    switch (sortOption) {
      case "1":
        return "Oldest to Newest";
      case "0":
        return "Newest to Oldest";
      default:
        return "Oldest to Newest";
    }
  };

  const selectSortBy = (eventKey: string | null) => {
    eventKey && setSortOption(eventKey);
  };

  const [filterOption, setFilterOption] = useState<String>("0");

  const displayFilterByTitle = () => {
    if (filterOption === "0") return `All Departments`;
    if (filterOption === "N/A") return filterOption;
    return allDepartments?.find((dep) => dep.id.toString() === filterOption)?.name;
  };
  const selectFilterBy = (eventKey: string | null) => {
    eventKey && setFilterOption(eventKey);
  };

  const allTicketsSorter = (a: any, b: any) => {
    if (sortOption === "0") return -moment(a.createdAt).diff(b.createdAt);
    return moment(a.createdAt).diff(b.createdAt);
  };

  return (
    <main className={`Main ${props.className}`}>
      <Container>
        <Row className="py-5">
          <Col className="d-flex align-items-end">
            <Button variant="success" onClick={handleShowCreateModal}>
              Create new ticket
            </Button>
            <Button variant="secondary" className="ml-3" onClick={refreshAll}>
              Refresh
            </Button>
          </Col>
          <Col>
            <Row>
              <Col lg={8}>
                <p className="text-right">Sort By:</p>
                <DropdownButton
                  variant="secondary"
                  className="float-right"
                  menuAlign="right"
                  title={displaySortByTitle()}
                  onSelect={selectSortBy}
                >
                  <Dropdown.Item eventKey="0">Newest to Oldest</Dropdown.Item>
                  <Dropdown.Item eventKey="1">Oldest to Newest</Dropdown.Item>
                </DropdownButton>
              </Col>
              {/* <Col lg={4}>
                <p className="text-right">Filter By Author:</p>
                <DropdownButton
                  className="float-right"
                  variant="info"
                  menuAlign="right"
                  title={displayFilterByTitle()}
                  onSelect={selectFilterBy}
                >
                  <Dropdown.Item eventKey="0">All</Dropdown.Item>
                  {allTechnicians?.map((department, i) => (
                    <Dropdown.Item eventKey={department.id.toString()} key={i}>
                      {department.name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </Col> */}

              <Col lg={4}>
                <p className="text-right">Filter By Department:</p>
                <DropdownButton
                  className="float-right"
                  menuAlign="right"
                  title={displayFilterByTitle()}
                  onSelect={selectFilterBy}
                >
                  <Dropdown.Item eventKey="0">All Departments</Dropdown.Item>
                  {allDepartments?.map((department, i) => (
                    <Dropdown.Item eventKey={department.id.toString()} key={i}>
                      {department.name}
                    </Dropdown.Item>
                  ))}
                  <Dropdown.Item eventKey="N/A">N/A</Dropdown.Item>
                </DropdownButton>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          {allStatus?.map((status, i) => (
            <Col lg={Math.floor(12 / allStatus.length)} key={i}>
              <h2>{status.name}</h2>
              {allTickets
                ?.filter((ticket) => {
                  if (filterOption === "0") return true;
                  if (filterOption === "N/A") return ticket.department === null;
                  return ticket.department?.id.toString() === filterOption;
                })
                ?.filter((ticket) => ticket.status?.name === status.name)
                ?.sort(allTicketsSorter)
                .map((ticket, i) => (
                  <TicketCard ticket={ticket} onClickViewTicket={handleShowTicketModal} key={i} />
                ))}
            </Col>
          ))}
        </Row>
      </Container>
      <TicketDetailsModal
        show={showTicketModal}
        ticket={currentTicket}
        allStatus={allStatus}
        allDepartments={allDepartments}
        allTechnicians={allTechnicians}
        handleClose={handleCloseTicketModal}
        handleNotification={updateNotificationList}
      />
      <TicketCreateModal
        show={showCreateModal}
        allStatus={allStatus}
        allDepartments={allDepartments}
        allTechnicians={allTechnicians}
        handleClose={handleCloseCreateModal}
        handleNotification={updateNotificationList}
      />
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          zIndex: 1051,
          width: `250px`,
        }}
      >
        {notifications?.map((notification, i) => (
          <Toast
            key={i}
            onClose={closeToast(notification.notificationId)}
            show={notification.show}
            delay={3000}
            autohide
            className={`toast-${notification.status}`}
          >
            <Toast.Header>
              <strong className="mr-auto">Notification</strong>
              <small>{moment(notification.createdAt).fromNow()}</small>
            </Toast.Header>
            <Toast.Body>{notification.message}</Toast.Body>
          </Toast>
        ))}
      </div>
    </main>
  );
};

export default Main;
