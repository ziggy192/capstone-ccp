import React from 'react';
import LoginForm from './LoginForm';

const Login = () => {
  return (
    <div className="container my-auto">
      <div className="row">
        <div className="col-md-12">
          <h2 className="text-center">Login</h2>
        </div>
        <div className="col-md-8 offset-md-2">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
