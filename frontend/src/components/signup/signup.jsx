import React, { useState } from 'react';

const SignUpPage = () => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }
    console.log(formData);
  };
  const {
    firstName, lastName, email, password, confirmPassword, companyName,
  } = formData;

  return (
    <>
      <div className="row">
        <div className="col-8">
          <section
            className="background-radial-gradient overflow-hidden"
            style={{ height: '100vh' }}
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
              <div className="row gx-lg-5 align-items-center mb-5">
                <div
                  className="col-lg-6 mb-5 mb-lg-0"
                  style={{
                    zIndex: 10,
                  }}
                >
                  <h1
                    className="my-5 display-5 fw-bold ls-tight"
                    style={{ color: 'hsl(218, 81%, 75%)' }}
                  >
                    <br />
                    <span style={{ color: 'hsl(218, 81%, 95%)' }} />
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
            <div
              className="mb-5 mb-lg-0 text-center"
              style={{
                zIndex: 10,
              }}
            >
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
          </section>
        </div>
        <div className="col-4">
          <div className="card bg-glass" style={{ border: 'none' }}>
            <div className="card-body px-4 py-5 px-md-5">
              <div className="">
                <h1>
                  {' '}
                  <strong
                    className="text-center"
                    style={{ marginLeft: '5rem' }}
                  >
                    Sign Up
                  </strong>
                </h1>
              </div>

              <br />

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-4" />
                  <div className="col-md-6 mb-4" />
                </div>

                <div className="form-outline mb-4">
                  <input
                    style={{ borderRadius: '50px' }}
                    type="text"
                    className="form-control"
                    placeholder="Enter First Name"
                    required
                    name="firstName"
                    value={firstName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    style={{ borderRadius: '50px' }}
                    type="text"
                    className="form-control"
                    placeholder="Enter Last Name"
                    required
                    name="lastName"
                    value={lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-outline mb-4">
                  <input
                    style={{ borderRadius: '50px' }}
                    type="email"
                    className="form-control"
                    placeholder="Enter Email here"
                    required
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-outline mb-4">
                  <input
                    style={{ borderRadius: '50px' }}
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-outline mb-4">
                  <input
                    style={{ borderRadius: '50px' }}
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    required
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-outline mb-4">
                  <input
                    style={{ borderRadius: '50px' }}
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
                  type="submit"
                  className="btn btn-primary btn-block mb-4 rounded-pill btn-lg"
                >
                  Create Account
                </button>

                <div className="text-center mt-5">
                  <p>
                    Already Have Account&nbsp;
                    <span
                      className="text-primary font-weight-bold"
                      style={{ cursor: 'pointer' }}
                    >
                      Sign In
                    </span>
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
