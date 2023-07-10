import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('All fields are required!');
      return;
    }

    try {
      const response = await api.post('/user/login', { email, password }, { withCredentials: true });

      if (response.status === 200) {
        toast.success('Successfully Logged In!');
        navigate('/AGCloud');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Invalid Credentials. Try Again!');
      } else if (error.response && error.response.status === 500) {
        toast.error('Server Error. Try Again!');
      } else {
        console.error('An error occurred:', error.message);
      }
    }
  };

  return (
    <>
      <div className="row overflow-hidden">
        <div className="col-8 overflow-hidden">
          <section className="background-radial-gradient overflow-hidden" style={{ height: ' 100vh ' }}>
            <style>
              {`
              /* CSS styles for background and shape omitted for brevity */
              `}
            </style>
            {/* Background and shape elements omitted for brevity */}
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
              <small className="text-center text-secondary" style={{ fontSize: '16px' }}>
                Experience our built-in database projects
                <br />
                or
              </small>
              <br />
              <small className="text-center  text-secondary" style={{ fontSize: '16px' }}>
                Create project using your own data
              </small>
              <form onSubmit={handleSubmit}>
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
                  type="submit"
                  className="btn btn-primary btn-block mb-4 rounded-pill btn-lg"
                >
                  Sign In
                </button>
                <div className="text-center mt-5">
                  <p>
                    Don&apos;t have an account?{' '}
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
