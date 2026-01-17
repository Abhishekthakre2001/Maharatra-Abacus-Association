export const validateStudent = (data) => {
  const errors = {};

  // Name → only letters & spaces
  if (!data.name || !/^[A-Za-z\s]+$/.test(data.name)) {
    errors.name = "Name must contain only letters";
  }

  // Class → only number
  if (!data.class ) {
    errors.class = "Class is required";
  }

  // Address → minimum 3 characters
  if (!data.address || data.address.trim().length < 3) {
    errors.address = "Address must be at least 3 characters";
  }

  // Mobile Number → exactly 10 digits
  if (!/^\d{10}$/.test(data.mobileNumber)) {
    errors.mobileNumber = "Mobile number must be 10 digits";
  }

  // DOB → past date only
  if (!data.dob || new Date(data.dob) >= new Date()) {
    errors.dob = "Date of birth must be in the past";
  }

  // Subscription End Date → future only
  if (
    !data.subscription_end_date ||
    new Date(data.subscription_end_date) <= new Date()
  ) {
    errors.subscription_end_date = "Subscription end date must be in the future";
  }

  // Level → number
  if (!data.level || isNaN(data.level)) {
    errors.level = "Level must be a number";
  }

  // Username → required
  if (!data.username || data.username.trim().length === 0) {
    errors.username = "Username is required";
  }

  // Password → required
  if (!data.password || data.password.length === 0) {
    errors.password = "Password is required";
  }

  return errors;
};
