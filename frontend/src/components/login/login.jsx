// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

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
      console.log(email, password);
      // With Credentials allow the browser to store the cookie
      const response = await api.post('/user/login', { email, password }, { withCredentials: true });

      if (response.status === 200) {
        toast.success('Successfully Logged In!');
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Invalid Credentials. Try Again!');
      } else {
        console.error('An error occurred:', error.message);
      }
    }
  };

  return (
    <>
      <div className="row overflow-hidden">
        <div className="col-8 overflow-hidden">
          <section
            className="background-radial-gradient overflow-hidden"
            style={{ height: ' 100vh ' }}
          >
            <style>
              {`
        .background-radial-gradient {
          background-color: hsl(218, 41%, 15%);
          background-image: radial-gradient(650px circle at 0% 0%,
              hsl(218, 41%, 35%) 15%,
              hsl(218, 41%, 30%) 35%,
              hsl(218, 41%, 20%) 75%,
              hsl(218, 41%, 19%) 80%,
              transparent 100%),
            radial-gradient(1250px circle at 100% 100%,
              hsl(218, 41%, 45%) 15%,
              hsl(218, 41%, 30%) 35%,
              hsl(218, 41%, 20%) 75%,
              hsl(218, 41%, 19%) 80%,
              transparent 100%);
        }
        #radius-shape-1 {
          height: 220px;
          width: 220px;
          top: -60px;
          left: -130px;
          background: radial-gradient(#44006b, #ad1fff);
          overflow: hidden;
        }
        #radius-shape-2 {
          border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
          bottom: -60px;
          right: -110px;
          width: 300px;
          height: 300px;
          background: radial-gradient(#44006b, #ad1fff);
          overflow: hidden;
        }
        .bg-glass {
          background-color: hsla(0, 0%, 100%, 0.9) !important;
          backdrop-filter: saturate(200%) blur(25px);
        }
        `}
            </style>

            <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
              <div className="row gx-lg-5 align-items-center mb-5 ">
                <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
                  <h1
                    className="my-5 display-5 fw-bold ls-tight"
                    style={{ color: 'hsl(218, 81%, 75%)' }}
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
        <div className="col-4">
          <div className="card bg-glass " style={{ border: 'none' }}>
            <div className="card-body px-4 py-5 px-md-5">
              <h1>
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
              </small>
              <br />
              <small
                className="text-center  text-secondary"
                style={{ fontSize: '16px' }}
              >
                Create project using your own data
              </small>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-4" />
                  <div className="col-md-6 mb-4" />
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
