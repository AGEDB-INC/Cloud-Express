// eslint-disable-next-line import/no-extraneous-dependencies
/* eslint-disable quotes,padded-blocks,brace-style, operator-linebreak, object-curly-newline,
prefer-destructuring, no-shadow, no-trailing-spaces */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import './style.css';

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

    if (
      formData.firstName === "" ||
      formData.lastName === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.confirmPassword === "" ||
      formData.companyName === ""
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    const submitData = { ...formData };
    delete submitData.confirmPassword;
    // eslint-disable-next-line
    console.log(submitData);
    try {
      //  With Credentials allow the browser to store the cookie
      const response = await api.post("/user/signup", submitData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Successfully Signed Up!");
        navigate("/login");
      } else {
        // eslint-disable-next-line
        console.error("SignUp failed");
        toast.error("SignUp failed!");
      }
    } catch (error) {

      if (error.response && error.response.status === 400) {
        const errors = error.response.data.errors;
        errors.forEach((error) => {
          toast.error(error.msg);
        });
      } else if (error.response && error.response.status === 401) {
        toast.error("Email Already Exists. Try Again!");
      }

      else {
        // eslint-disable-next-line
        console.error('An error occurred:', error.response);
        toast.error('SignUp failed! Please try again');
      }
    }
  };
  const { firstName, lastName, email, password, confirmPassword, companyName } =
    formData;

  return (
    <>
      <div className="Row overflow-hidden">
        <div className="image col-md-8 overflow-hidden">
          <section
            className="background-radial-gradient overflow-hidden"
          >
            <div className="container text-center text-lg-start">
              <div
                className="row gx-lg-5 align-items-md-center mb-5"
                style={{ overflow: "visible" }}
              >
                <div
                  className="col-lg-6 mb-5 mb-lg-0"
                  style={{
                    zIndex: 10,
                  }}
                >
                  <h1
                    className="ls-tight"
                  >
                    Experience Graph Database
                    <br />
                    <span style={{ color: "hsl(218, 81%, 95%)" }}>
                      With AGE Viewer
                    </span>
                  </h1>
                  <p
                    className="mb-4 opacity-70"
                    style={{ color: "hsl(218, 81%, 85%)" }}
                  />
                </div>

                <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                  <div
                    id="radius-shape-1"
                    className="position-absolute rounded-circle shadow-5-strong"
                  />
                  <div
                    id="radius-shape-2"
                    className="position-absolute shadow-5-strong"
                  />
                </div>
              </div>
            </div>
            <div
              className="mb-5 mb-lg-0 text-center"
              style={{
                zIndex: 10,
              }}
            >
              
              <p
                className="mb-4 opacity-70"
                style={{ color: "hsl(218, 81%, 85%)" }}
              />
            </div>
          </section>
        </div>
        <div className="form col-md-4">
          <div className="card bg-glass" style={{ border: "none" }}>
            <div className="card-body py-md-5 px-md-4">
              <div className="">
                <h1 className="text-center">
                  {" "}
                  <strong
                    className="text-center text-secondary"
                  >
                    Sign Up
                  </strong>
                </h1>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-2 mb-md-3" />
                  <div className="col-md-6 mb-2 mb-md-3" />
                </div>

                <div className="form-outline mb-2 mb-md-3">
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

                <div className="form-outline mb-2 mb-md-3">
                  <input
                    style={{ borderRadius: "50px" }}
                    type="text"
                    className="form-control"
                    placeholder="Enter Last Name"
                    required
                    name="lastName"
                    value={lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-outline mb-2 mb-md-3">
                  <input
                    style={{ borderRadius: "50px" }}
                    type="email"
                    className="form-control"
                    placeholder="Enter Email here"
                    required
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-outline mb-2 mb-md-3">
                  <input
                    style={{ borderRadius: "50px" }}
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-outline mb-2 mb-md-3">
                  <input
                    style={{ borderRadius: "50px" }}
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    required
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-outline mb-2 mb-md-5">
                  <input
                    style={{ borderRadius: "50px" }}
                    type="text"
                    className="form-control"
                    placeholder="Enter Organization Name"
                    required
                    name="companyName"
                    value={companyName}
                    onChange={handleInputChange}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="btn btn-primary btn-block mb-3 rounded-pill btn-lg"
                >
                  Create Account
                </button>

                <div className="text-center mt-md-4">
                  <p>
                    Already Have Account&nbsp;
                    <Link to="/login">
                      <span
                        className="text-primary font-weight-bold"
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
