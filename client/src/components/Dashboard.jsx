import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api";
import EmployeeModal from "./EmployeeModal";

const STAGE_WIDTH = 1366;
const STAGE_HEIGHT = 630;

const NAV_ITEMS = [
  ["employee.svg", "Employee"],
  ["leaves.svg", "Leaves"],
  ["holidays.svg", "Holidays"],
  ["outdoor_duty.svg", "Outdoor Duty"],
  ["expense.svg", "Expense"],
  ["attendance.svg", "Attendance"],
  ["it_computation.svg", "IT Computation"],
  ["salary.svg", "Salary"],
  ["documents.svg", "Documents"],
  ["training.svg", "Training & Dev."],
  ["performance.svg", "Performance"],
  ["policies.svg", "HR Policies"],
  ["reports.svg", "Reports"],
  ["support.svg", "Support"]
];

const DEFAULT_FILTERS = {
  search: "",
  department: "",
  designation: "",
  gender: ""
};
const ROWS_PER_PAGE = 11;
const TABLE_HEADER_ROW_HEIGHT = 31.81;
const TABLE_BODY_ROW_HEIGHT = 31.81;

const DEFAULT_DEPARTMENTS = ["HR", "Engineering", "Finance", "Marketing", "Operations", "Admin"];
const DEFAULT_DESIGNATIONS = ["Intern", "Executive", "Manager", "Senior Manager", "Lead", "Director"];

const normalizeText = (value = "") => String(value).trim().toLowerCase();

const employeeMatchesFilters = (employee, activeFilters) => {
  const search = normalizeText(activeFilters.search);
  const department = normalizeText(activeFilters.department);
  const designation = normalizeText(activeFilters.designation);
  const gender = normalizeText(activeFilters.gender);

  if (search) {
    const matchesSearch =
      normalizeText(employee.fullName).includes(search) ||
      normalizeText(employee.email).includes(search) ||
      normalizeText(employee.department).includes(search);
    if (!matchesSearch) return false;
  }

  if (department && normalizeText(employee.department) !== department) return false;
  if (designation && normalizeText(employee.designation) !== designation) return false;
  if (gender && normalizeText(employee.gender) !== gender) return false;

  return true;
};

function Dashboard({ user, onLogout }) {
  const [scale, setScale] = useState(1);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({ departments: [], designations: [], genders: ["Male", "Female", "Other"] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const hasBootstrappedFilters = useRef(false);
  const fetchAbortRef = useRef(null);
  const fetchRequestIdRef = useRef(0);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const applyScale = () => {
      const nextScale = Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT);
      setScale(nextScale);
    };

    applyScale();
    window.addEventListener("resize", applyScale);
    return () => window.removeEventListener("resize", applyScale);
  }, []);

  const fetchEmployees = async (activeFilters = filters, options = {}) => {
    const { initial = false } = options;
    const requestId = fetchRequestIdRef.current + 1;
    fetchRequestIdRef.current = requestId;

    fetchAbortRef.current?.abort();
    const controller = new AbortController();
    fetchAbortRef.current = controller;

    if (initial) {
      setIsInitialLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError("");

    try {
      const params = Object.fromEntries(Object.entries(activeFilters).filter(([, value]) => value));
      const response = await api.get("/employees", { params, signal: controller.signal });
      if (fetchRequestIdRef.current !== requestId) return;
      setEmployees(Array.isArray(response.data.employees) ? response.data.employees : []);
      if (response.data.meta) {
        setMeta(response.data.meta);
      }
    } catch (requestError) {
      if (requestError?.code === "ERR_CANCELED") return;
      if (fetchRequestIdRef.current !== requestId) return;
      setError(requestError.response?.data?.message || "Failed to load employees");
    } finally {
      if (fetchRequestIdRef.current !== requestId) return;
      if (initial) {
        setIsInitialLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchEmployees(DEFAULT_FILTERS, { initial: true });

    return () => {
      fetchAbortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasBootstrappedFilters.current) {
      hasBootstrappedFilters.current = true;
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchEmployees(filters);
    }, 250);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.department, filters.designation, filters.gender]);

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleOutsidePointer = (event) => {
      if (!userMenuRef.current?.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsidePointer);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isUserMenuOpen]);

  useEffect(() => {
    if (!activeActionMenuId) return;

    const handleOutsidePointer = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest(".ds-action-wrap")) {
        setActiveActionMenuId(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveActionMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsidePointer);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeActionMenuId]);

  const departmentOptions = meta.departments.length ? meta.departments : DEFAULT_DEPARTMENTS;
  const designationOptions = meta.designations.length ? meta.designations : DEFAULT_DESIGNATIONS;
  const totalPages = Math.max(1, Math.ceil(employees.length / ROWS_PER_PAGE));
  const pageStart = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedEmployees = employees.slice(pageStart, pageStart + ROWS_PER_PAGE);
  const tableWrapHeight =
    TABLE_HEADER_ROW_HEIGHT + Math.max(paginatedEmployees.length, 1) * TABLE_BODY_ROW_HEIGHT + 1;

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.department, filters.designation, filters.gender]);

  const handleLogoutClick = async () => {
    setIsUserMenuOpen(false);
    await onLogout?.();
  };

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
  };

  const openPhoto = (employee) => {
    if (!employee.photoPath) {
      setError("No photo uploaded for this employee");
      return;
    }

    setError("");
    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
    const uploadBaseUrl =
      import.meta.env.VITE_UPLOADS_BASE_URL ||
      (apiBaseUrl ? apiBaseUrl.replace(/\/api$/, "") : window.location.origin);
    const url = /^https?:\/\//i.test(employee.photoPath)
      ? employee.photoPath
      : `${uploadBaseUrl}${employee.photoPath}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setEditingEmployee(null);
  };

  const openEditModal = (employee) => {
    setModalMode("edit");
    setEditingEmployee(employee);
    setIsModalOpen(true);
    setActiveActionMenuId(null);
  };

  const deleteEmployee = async (employee) => {
    setActiveActionMenuId(null);
    const shouldDelete = window.confirm(`Delete employee "${employee.fullName}"?`);
    if (!shouldDelete) return;

    setError("");
    setDeletingEmployeeId(employee._id);
    const previousEmployees = employees;
    setEmployees((prev) => prev.filter((item) => item._id !== employee._id));

    try {
      await api.delete(`/employees/${employee._id}`);
    } catch (requestError) {
      setEmployees(previousEmployees);
      setError(requestError.response?.data?.message || "Failed to delete employee");
    } finally {
      setDeletingEmployeeId("");
    }
  };

  const createEmployee = async (payload) => {
    setError("");
    setIsMutating(true);
    try {
      const response = await api.post("/employees", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const createdEmployee = response.data?.employee;
      if (createdEmployee && employeeMatchesFilters(createdEmployee, filters)) {
        setEmployees((prev) => [createdEmployee, ...prev]);
      }
      closeModal();
    } catch (requestError) {
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  };

  const updateEmployee = async (payload) => {
    if (!editingEmployee?._id) return;

    setError("");
    setIsMutating(true);
    try {
      const response = await api.put(`/employees/${editingEmployee._id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const updatedEmployee = response.data?.employee;

      if (updatedEmployee) {
        setEmployees((prev) => {
          const exists = prev.some((item) => item._id === updatedEmployee._id);
          const matches = employeeMatchesFilters(updatedEmployee, filters);

          if (!matches) {
            return prev.filter((item) => item._id !== updatedEmployee._id);
          }

          if (!exists) {
            return [updatedEmployee, ...prev];
          }

          return prev.map((item) => (item._id === updatedEmployee._id ? updatedEmployee : item));
        });
      }

      closeModal();
    } catch (requestError) {
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  };

  const shellStyle = useMemo(
    () => ({ width: STAGE_WIDTH * scale, height: STAGE_HEIGHT * scale }),
    [scale]
  );

  const stageStyle = useMemo(
    () => ({ transform: `scale(${scale})`, transformOrigin: "top left", width: STAGE_WIDTH, height: STAGE_HEIGHT }),
    [scale]
  );

  return (
    <div className="ds-root">
      <div className="ds-shell" style={shellStyle}>
        <div className="ds-stage" style={stageStyle}>
          <header className="ds-topbar">
            <div className="ds-brand-wrap">
              <img src="/sde-kit/Assets/idms_logo.svg" alt="IDMS" />
            </div>
            <h1 className="ds-topbar-title">Employee Setup</h1>
            <div className="ds-user-wrap" ref={userMenuRef}>
              <button
                type="button"
                className="ds-user"
                title="Profile"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
              >
                <img src="/sde-kit/Assets/user_avatar.svg" alt={user.username} />
              </button>
              {isUserMenuOpen ? (
                <div className="ds-user-menu">
                  <p className="ds-user-name">{user.username}</p>
                  <button type="button" onClick={handleProfileClick}>
                    My Profile
                  </button>
                  <button type="button" onClick={handleLogoutClick}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </header>

          <aside className="ds-sidebar">
            {NAV_ITEMS.map(([icon, label], index) => (
              <button key={icon} type="button" className={`ds-nav-row${index === 0 ? " active" : ""}`}>
                <span className="ds-nav-icon">
                  <img src={`/sde-kit/Assets/${icon}`} alt="" aria-hidden="true" />
                </span>
                <span>{label}</span>
              </button>
            ))}
          </aside>

          <main className="ds-main">
            <div className="ds-toolbar">
              <div className="ds-search-pill">
                <img src="/sde-kit/Assets/search_icon.svg" alt="Search" />
                <input
                  type="text"
                  placeholder="Search..."
                  disabled={isMutating}
                  value={filters.search}
                  onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                />
              </div>

              <div className="ds-filter-row">
                <select
                  className="ds-filter"
                  disabled={isMutating}
                  value={filters.department}
                  onChange={(event) => setFilters((prev) => ({ ...prev, department: event.target.value }))}
                >
                  <option value="">All Departments</option>
                  {departmentOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  className="ds-filter"
                  disabled={isMutating}
                  value={filters.designation}
                  onChange={(event) => setFilters((prev) => ({ ...prev, designation: event.target.value }))}
                >
                  <option value="">All Designations</option>
                  {designationOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  className="ds-filter"
                  disabled={isMutating}
                  value={filters.gender}
                  onChange={(event) => setFilters((prev) => ({ ...prev, gender: event.target.value }))}
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <button type="button" className="ds-create-btn" disabled={isMutating} onClick={openCreateModal}>
                  <span className="plus">+</span> Create
                </button>
              </div>
            </div>

            <section
              className="ds-table-wrap"
              style={employees.length ? { height: `${tableWrapHeight}px` } : undefined}
            >
              {isInitialLoading && !employees.length ? (
                <div className="ds-empty-state">Loading employees...</div>
              ) : employees.length ? (
                <table className="ds-table">
                  <colgroup>
                    <col style={{ width: "214.58px" }} />
                    <col style={{ width: "163.47px" }} />
                    <col style={{ width: "106.59px" }} />
                    <col style={{ width: "87.78px" }} />
                    <col style={{ width: "102.67px" }} />
                    <col style={{ width: "156.37px" }} />
                    <col style={{ width: "158.56px" }} />
                    <col style={{ width: "62.32px" }} />
                    <col style={{ width: "65.47px" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Gender</th>
                      <th>Date of Birth</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Photo</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEmployees.map((employee) => (
                      <tr key={employee._id}>
                        <td>{employee.fullName}</td>
                        <td>{employee.email}</td>
                        <td>{employee.phoneNumber}</td>
                        <td>{employee.gender}</td>
                        <td>{new Date(employee.dob).toLocaleDateString("en-GB")}</td>
                        <td>{employee.department}</td>
                        <td>{employee.designation}</td>
                        <td>
                          <button type="button" className="ds-photo-btn" onClick={() => openPhoto(employee)}>
                            <img src="/sde-kit/Assets/photo.svg" alt="Employee photo" className="ds-photo-link ds-photo-fallback" />
                          </button>
                        </td>
                        <td>
                          <div className="ds-action-wrap">
                            <button
                              type="button"
                              className="ds-action-btn"
                              disabled={deletingEmployeeId === employee._id}
                              onClick={() =>
                                setActiveActionMenuId((prev) => (prev === employee._id ? null : employee._id))
                              }
                            >
                              <img src="/sde-kit/Assets/action.svg" alt="Action" className="ds-action-icon" />
                            </button>
                            {activeActionMenuId === employee._id ? (
                              <div className="ds-action-menu">
                                <button
                                  type="button"
                                  disabled={deletingEmployeeId === employee._id}
                                  onClick={() => openEditModal(employee)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingEmployeeId === employee._id}
                                  onClick={() => deleteEmployee(employee)}
                                >
                                  {deletingEmployeeId === employee._id ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="ds-empty-state">
                  <img src="/sde-kit/Assets/no_records.svg" alt="No records" />
                  <p>No Records to be displayed</p>
                </div>
              )}
              {isRefreshing ? <div className="ds-table-loading-overlay">Refreshing data...</div> : null}
            </section>

            {error ? <div className="ds-error">{error}</div> : null}
          </main>

          <footer className="ds-footer">
            <div className="ds-total">Total Records -&gt; {employees.length}</div>
            <div className="ds-pagination">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => {
                  setActiveActionMenuId(null);
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                }}
              >
                &lt;- 
              </button>
              <span>Page</span>
              <span className="ds-page-no">{currentPage}</span>
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setActiveActionMenuId(null);
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                }}
              >
                -&gt;
              </button>
            </div>
          </footer>

          {isModalOpen ? (
            <EmployeeModal
              onClose={closeModal}
              onCreate={createEmployee}
              onUpdate={updateEmployee}
              departments={meta.departments}
              designations={meta.designations}
              mode={modalMode}
              initialValues={editingEmployee}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
