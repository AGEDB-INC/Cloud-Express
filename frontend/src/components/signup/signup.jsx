// eslint-disable-next-line import/no-extraneous-dependencies
/* eslint-disable quotes,padded-blocks,brace-style, operator-linebreak, object-curly-newline,
prefer-destructuring, no-shadow, no-trailing-spaces */


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import styles from "./SignUpPage.module.css"; // Assuming you create a separate CSS file for styles.

const SignUpPage = () => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isFormInvalid()) {
      return;
    }

    const submitData = { ...formData };
    delete submitData.confirmPassword;

    try {
      const response = await api.post("/user/signup", submitData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Successfully Signed Up!");
        navigate("/login");
      } else {
        console.error("SignUp failed");
        toast.error("SignUp failed!");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const isFormInvalid = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
      "companyName",
    ];
    for (const field of requiredFields) {
      if (formData[field] === "") {
        toast.error("All fields are required!");
        return true;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return true;
    }

    return false;
  };

  const handleApiError = (error) => {
    if (error.response && error.response.status === 400) {
      const errors = error.response.data.errors;
      errors.forEach((error) => {
        toast.error(error.msg);
      });
    } else if (error.response && error.response.status === 401) {
      toast.error("Email Already Exists. Try Again!");
    } else {
      console.error("An error occurred:", error.response);
      toast.error("SignUp failed! Please try again");
    }
  };

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    companyName,
  } = formData;

  return (
    <>
      <div className="row overflow-hidden" style={{ overflowY: "none" }}>
        {/* ... (Rest of the JSX code for the first column) ... */}
        <div className="col-4">
          <div className={`${styles.card} ${styles.bgGlass}`}>
            <div className={`${styles.cardBody} ${styles.px4} ${styles.py5} ${styles.pxMd5}`}>
              <div className={styles.title}>
                <strong className={styles.textCenter}>Sign Up</strong>
              </div>

              <br />

              <form onSubmit={handleSubmit}>
                <div className="form-outline mb-4">
                  <input
                    style={{ borderRadius: "50px" }}
                    type="text"
                    className="form-control"
                    placeholder="Enter First Name"
                    required
                    name="firstName"
                    value={firstName}
                    onChange={handleInputChange}
                  />
                </div>
                {/* ... (Rest of the form input fields) ... */}
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock} ${styles.mb4} ${styles.roundedPill} ${styles.btnLg}`}
                >
                  Create Account
                </button>
                <div className="text-center mt-5">
                  <p>
                    Already Have an Account?&nbsp;
                    <Link to="/login">
                      <span
                        className={`${styles.textPrimary} ${styles.fontWeightBold}`}
                        style={{ cursor: "pointer" }}
                      >
                        Sign In
                      </span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
