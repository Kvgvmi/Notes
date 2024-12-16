import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";




// Change Password Modal Component
const ChangePasswordModal = ({
  show,
  onClose,
  onSubmit,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  newPasswordConfirmation,
  setNewPasswordConfirmation,
}) => {
  if (!show) return null;

  return (
    <div className="change-password-modal">
      <div className="modal-content">
        <h2>Change your password</h2>
        <form onSubmit={onSubmit}>
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={newPasswordConfirmation}
            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
            required
          />
          <div className="modal-buttons">
            <button type="submit" className="submit-button">Submit</button>
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};





const Navbar = ({ UserInfo, setSearchQuery, setIsConnected, token }) => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const navigate = useNavigate();





    // Validate password strength
  const validatePasswordStrength = (password) => {
    const strongPasswordRegex = /^.{6,}$/;;
    return strongPasswordRegex.test(password);
  };




  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("cin");
    localStorage.removeItem("password");
    setIsConnected(false);
    navigate("/"); // Redirect to login
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
  
    if (!validatePasswordStrength(newPassword)) {
      alert(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
      );
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      alert("New passwords do not match!");
      return;
    }
  
    try {
      const response = await axios.post(
        "https://notes.devlop.tech/update-password", // Updated route
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPassword
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
  
      if (response.data.message === "Password updated successfully") {
        alert("Password updated successfully!");
        setShowChangePasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
      } else {
        alert(response.data.message || "Failed to update password. Please check your input.");
      }
    } catch (err) {
      console.error("Full Error:", err);
      if (err.response) {
        console.error("Error Response:", err.response.data);
        alert(err.response.data.message || "An error occurred while changing password");
      } else {
        alert("Network error. Please try again.");
      }
    }
  };

  // Close the modal
  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirmation("");
  };

  return (
    <div className="Navbar">
      <div className="greeting">
        <h1 className="salutation">Hello, {UserInfo?.userfirstname || "Guest"}</h1>
      </div>
      <input
        type="text"
        placeholder="Search notes..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Buttons container */}
      <div className="button-container">
        <button
          onClick={() => setShowChangePasswordModal(true)}
          className="change-password-button"
        >
          Change mot de passe
        </button>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="change-password-modal">
          <div className="modal-content">
            <h2>Change your password</h2>
            <form onSubmit={handlePasswordChange}>
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="submit-button">Submit</button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeChangePasswordModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
