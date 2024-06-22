import React, { useState, useEffect } from 'react';

const useFormValidation = (initialState, validate, onSubmit) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        onSubmit();
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
  };
};

const validate = (values) => {
  let errors = {};
  if (!values.name) errors.name = "Name is required";
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid";
  }
  if (!values.age) {
    errors.age = "Age is required";
  } else if (isNaN(values.age) || values.age <= 0) {
    errors.age = "Age must be a number greater than 0";
  }
  if (values.isAttendingWithGuest === 'true' && !values.guestName) {
    errors.guestName = "Guest Name is required if attending with a guest";
  }
  return errors;
};

const EventRegistrationForm = () => {
  const initialState = {
    name: '',
    email: '',
    age: '',
    isAttendingWithGuest: 'false',
    guestName: '',
  };

  const [submittedData, setSubmittedData] = useState(null);

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
  } = useFormValidation(initialState, validate, submitForm);

  function submitForm() {
    setSubmittedData(values);
  }

  return (
    <div className="container">
      <h2>Event Registration Form</h2>
      {!submittedData ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && <p>{errors.name}</p>}
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <div>
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={values.age}
              onChange={handleChange}
            />
            {errors.age && <p>{errors.age}</p>}
          </div>
          <div>
            <label>Are you attending with a guest?</label>
            <select
              name="isAttendingWithGuest"
              value={values.isAttendingWithGuest}
              onChange={handleChange}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          {values.isAttendingWithGuest === 'true' && (
            <div>
              <label>Guest Name</label>
              <input
                type="text"
                name="guestName"
                value={values.guestName}
                onChange={handleChange}
              />
              {errors.guestName && <p>{errors.guestName}</p>}
            </div>
          )}
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          <h3>Summary of Entered Data</h3>
          <p><strong>Name:</strong> {submittedData.name}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Age:</strong> {submittedData.age}</p>
          <p><strong>Attending with a guest:</strong> {submittedData.isAttendingWithGuest === 'true' ? 'Yes' : 'No'}</p>
          {submittedData.isAttendingWithGuest === 'true' && (
            <p><strong>Guest Name:</strong> {submittedData.guestName}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventRegistrationForm;
