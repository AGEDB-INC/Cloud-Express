/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import './style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      toast.error('All fields are required!');
      return;
    }
    try {
      // console.log(email, password);
      // With Credentials allow the browser to store the cookie
      const response = await api.post('/user/login', { email, password }, { withCredentials: true });
      if (response.status === 200) {
        toast.success('Successfully Logged In!');
        window.location.assign('/AGCloud');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Invalid Credentials. Try Again!');
      } else if (error.response && error.response.status === 500) {
        toast.error('Server Error. Try Again!');
      } else {
        toast.error('An error occurred:', error.message);
      }
    }
  };

  return (
    <>
      <div className="Row overflow-hidden">
        <div className="image overflow-hidden">
          <section
            className="background-radial-gradient overflow-hidden"
          >
            <div className="container text-center text-lg-start">
              <div className="row gx-lg-5" style={{ overflow: 'visible' }}>
                <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
                  <h1
                    className="ls-tight"
                  >
                    Experience Graph Database
                    <br />
                    <span style={{ color: 'hsl(218, 81%, 95%)' }}>
                      With AGE Viewer
                    </span>
                  </h1>
                  <p
                    className="mb-4 opacity-70"
                    style={{ color: 'hsl(218, 81%, 85%)' }}
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
          </section>
        </div>
        <div className="form">
          <div className="card bg-glass " style={{ border: 'none' }}>
            <div className="card-body py-md-5 px-md-5">
              <h1 className="text-center text-md-left">
                {' '}
                <strong className="text-secondary">
                  {' '}
                  Welcome to AGE Viewer
                </strong>
              </h1>
              <small
                className="text-center text-secondary"
                style={{ fontSize: '16px' }}
              >
                Experience our built-in database projects
                <br />
                or
                <br />
                Create project using your own data
              </small>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="mb-md-4" />
                  <div className="mb-md-4" />
                </div>

                <div className="form-outline mb-4">
                  <input
                    style={{ borderRadius: '50px' }}
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    style={{ borderRadius: '50px' }}
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="btn btn-primary btn-block mb-4 rounded-pill btn-lg"
                >
                  Sign In
                </button>

                <div className="text-center mt-5">
                  <p>
                    Don&apos;t have Account Google Account&nbsp;
                    <Link to="/signup">
                      <span
                        className="text-primary font-weight-bold"
                        style={{ cursor: 'pointer' }}
                      >
                        Sign Up
                      </span>
                    </Link>
                  </p>
                  <div className="mt-5">
                    <h4>
                      <strong
                        className="text-primary"
                        style={{ cursor: 'pointer' }}
                      >
                        Forgot Password?
                      </strong>
                    </h4>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
