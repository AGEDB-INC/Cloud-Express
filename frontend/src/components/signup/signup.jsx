import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

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
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      companyName,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !companyName
    ) {
      toast.error('All fields are required!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    const submitData = { ...formData };
    delete submitData.confirmPassword;

    try {
      const response = await api.post('/user/signup', submitData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('Successfully Signed Up!');
        navigate('/login');
      } else {
        console.error('SignUp failed');
        toast.error('SignUp failed!');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = error.response.data.errors;
        errors.forEach((error) => {
          toast.error(error.msg);
        });
      } else if (error.response && error.response.status === 401) {
        toast.error('Email Already Exists. Try Again!');
      } else {
        console.error('An error occurred:', error.response);
        toast.error('SignUp failed! Please try again');
      }
    }
  };

  const { firstName, lastName, email, password, confirmPassword, companyName } = formData;

  return (
    <>
      {/* Rest of the component code */}
    </>
  );
};

export default SignUpPage;
