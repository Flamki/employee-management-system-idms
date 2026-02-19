import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_DEPARTMENTS = ["HR", "Engineering", "Finance", "Marketing", "Operations", "Admin"];
const DEFAULT_DESIGNATIONS = ["Intern", "Executive", "Manager", "Senior Manager", "Lead", "Director"];

const toDateInputValue = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const formatDobDisplay = (value) => {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  const dd = String(parsed.getDate()).padStart(2, "0");
  const mm = String(parsed.getMonth() + 1).padStart(2, "0");
  const yyyy = parsed.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const isDateBeforeToday = (value) => {
  if (!value) return false;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed < today;
};

const getMaxDob = () => {
  const maxDate = new Date();
  maxDate.setHours(0, 0, 0, 0);
  maxDate.setDate(maxDate.getDate() - 1);
  return maxDate.toISOString().slice(0, 10);
};

const buildInitialForm = (initialValues) => ({
  fullName: initialValues?.fullName || "",
  dob: toDateInputValue(initialValues?.dob),
  email: initialValues?.email || "",
  department: initialValues?.department || "",
  phoneNumber: initialValues?.phoneNumber || "",
  designation: initialValues?.designation || "",
  gender: initialValues?.gender || "",
  photo: null
});

function EmployeeModal({
  onClose,
  onCreate,
  onUpdate,
  departments = [],
  designations = [],
  mode = "create",
  initialValues = null
}) {
  const isEditMode = mode === "edit";
  const [form, setForm] = useState(buildInitialForm(initialValues));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const dobNativeInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const maxDob = useMemo(() => getMaxDob(), []);

  const departmentOptions = departments.length ? departments : DEFAULT_DEPARTMENTS;
  const designationOptions = designations.length ? designations : DEFAULT_DESIGNATIONS;

  useEffect(() => {
    setForm(buildInitialForm(initialValues));
    setIsSubmitting(false);
    setError("");
  }, [initialValues, mode]);

  const firstValidationError = useMemo(() => {
    if (!form.fullName.trim()) return "Full Name is required";
    if (!form.dob) return "Date of Birth is required";
    if (!isDateBeforeToday(form.dob)) return "Date of birth must be before today";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required";
    if (!/^\d{10}$/.test(form.phoneNumber)) return "Phone number must be exactly 10 digits";
    if (!departmentOptions.includes(form.department)) return "Department must be selected from dropdown";
    if (!designationOptions.includes(form.designation)) return "Designation must be selected from dropdown";
    if (!["Male", "Female", "Other"].includes(form.gender)) return "Gender is required";
    if (!isEditMode && !form.photo) return "Employee photo is required";
    return "";
  }, [form, departmentOptions, designationOptions, isEditMode]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (firstValidationError) {
      setError(firstValidationError);
      return;
    }

    const payload = new FormData();
    payload.append("fullName", form.fullName.trim());
    payload.append("dob", form.dob);
    payload.append("email", form.email.trim());
    payload.append("department", form.department);
    payload.append("phoneNumber", form.phoneNumber);
    payload.append("designation", form.designation);
    payload.append("gender", form.gender);
    if (form.photo) payload.append("photo", form.photo);

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await onUpdate(payload);
      } else {
        await onCreate(payload);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.errors?.[0]?.msg ||
          `Failed to ${isEditMode ? "update" : "create"} employee`
      );
      setIsSubmitting(false);
    }
  };

  const openDobPicker = () => {
    const input = dobNativeInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.focus();
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="ds-modal-overlay" role="dialog" aria-modal="true">
      <form className="ds-modal-panel" onSubmit={submit}>
        <div className="ds-modal-head">
          <h2>{isEditMode ? "Edit Employee" : "Create Employee"}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div className="ds-modal-divider ds-modal-divider-top" aria-hidden="true" />

        <div className="ds-modal-body">
          <label className="ds-field">
            <span>
              Full Name <em className="ds-required">*</em>
            </span>
            <input
              type="text"
              placeholder="Enter name"
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
            />
          </label>

          <label className="ds-field">
            <span>
              Email <em className="ds-required">*</em>
            </span>
            <input
              type="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>

          <label className="ds-field">
            <span>
              Contact <em className="ds-required">*</em>
            </span>
            <input
              type="text"
              placeholder="Enter contact"
              maxLength={10}
              value={form.phoneNumber}
              onChange={(event) => setForm((prev) => ({ ...prev, phoneNumber: event.target.value.replace(/\D/g, "") }))}
            />
          </label>

          <label className="ds-field">
            <span>
              Gender <em className="ds-required">*</em>
            </span>
            <select value={form.gender} onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="ds-field">
            <span>
              Date of Birth <em className="ds-required">*</em>
            </span>
            <div className="ds-date-wrap" onClick={openDobPicker}>
              <input
                className="ds-date-display"
                type="text"
                placeholder="dd-mm-yyyy"
                readOnly
                value={formatDobDisplay(form.dob)}
              />
              <input
                ref={dobNativeInputRef}
                className="ds-date-native"
                type="date"
                max={maxDob}
                value={form.dob}
                onChange={(event) => setForm((prev) => ({ ...prev, dob: event.target.value }))}
                tabIndex={-1}
                aria-hidden="true"
              />
              <button
                type="button"
                className="ds-date-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  openDobPicker();
                }}
                aria-label="Open date picker"
              >
                <img src="/sde-kit/Assets/date-icon.svg" alt="" aria-hidden="true" />
              </button>
            </div>
          </label>

          <label className="ds-field">
            <span>
              Department <em className="ds-required">*</em>
            </span>
            <select
              value={form.department}
              onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
            >
              <option value="">Select</option>
              {departmentOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="ds-field">
            <span>
              Designation <em className="ds-required">*</em>
            </span>
            <select
              value={form.designation}
              onChange={(event) => setForm((prev) => ({ ...prev, designation: event.target.value }))}
            >
              <option value="">Select</option>
              {designationOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="ds-field">
            <span>
              Employee Photo {isEditMode ? "" : <em className="ds-required">*</em>}
            </span>
            <div
              className="ds-file-picker"
              role="button"
              tabIndex={0}
              onClick={openFilePicker}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openFilePicker();
                }
              }}
            >
              <span className={`ds-file-picker-text${form.photo ? " has-file" : ""}`}>
                {form.photo ? form.photo.name : "Upload Photo"}
              </span>
            </div>
            <input
              ref={fileInputRef}
              className="ds-file-input-hidden"
              type="file"
              accept="image/*"
              onChange={(event) => setForm((prev) => ({ ...prev, photo: event.target.files?.[0] || null }))}
            />
          </label>
        </div>

        {error ? <p className="ds-modal-error">{error}</p> : null}
        <div className="ds-modal-divider ds-modal-divider-bottom" aria-hidden="true" />

        <div className="ds-modal-foot">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeModal;
