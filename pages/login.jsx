import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Loader from '../components/loader';
import { Context } from '../contexts/Context';
export default function Login() {
  const [loginDetails,setLoginDetails] = useState({userName:"",password:""})
  const [error,setError] = useState(false)
  const [errors,setErrors] = useState({})
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter()
  const context = useContext(Context)
  const validate = () => {
    const errors = {};

    if (!loginDetails.userName) {
      errors.userName = 'Username is required';
    } else if (!/\S+@\S+\.\S+/.test(loginDetails.userName)) {
      errors.userName = 'Username is invalid';
    }

    if (!loginDetails.password) {
      errors.password = 'Password is required';
    } else if (loginDetails.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };
  const formSubmit = async(e)=>{
    e.preventDefault()
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true); 
    context.setLoaderState(true)
    try {
      const loginApi = await fetch("https://www.jharvis.com/JarvisV2/authenticate",{
        method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginDetails)
      })
      const loginApiRes = await loginApi.json()
      localStorage.setItem("access_token",loginApiRes.payload.accessToken)
      localStorage.setItem("sessionId",loginApiRes.payload.sessionId)
      if(localStorage.getItem('route') && localStorage.getItem('route') !=="/login"){
        router.push(localStorage.getItem('route'))
      }
      else{
        router.push("/admin")
      }
      
    } catch (error) {
      console.log(error.message)
    }
    context.setLoaderState(false) 
  }
  const handleInput = (e)=>{
    const { name, value } = e.target;
    setLoginDetails({
      ...loginDetails,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  }
  useEffect(()=>{

  },[loginDetails])
  return (
    <>
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth">
          <div className="row flex-grow">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left p-5">
                <div className="brand-logo">
                  <img src="../../assets/images/logo-black.png"/>
                </div>
                <h4>Hello! let's get started</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>
               {error && <div className="alert alert-danger">{error}</div>}
                <Form className="pt-3" onSubmit={formSubmit} noValidate>
                  <div className="form-group">
                    <Form.Control
            required
            type="email"
            placeholder="Username" 
            name="userName"
            value={loginDetails.userName}
            onChange={handleInput}
            isInvalid={!!errors.userName}
          />
             <Form.Control.Feedback type="invalid">
                {errors.userName}
              </Form.Control.Feedback>
                  </div>
                  <div className="form-group">
                    <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={loginDetails.password}
                onChange={handleInput}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-block bg-green-gradient text-white btn-lg font-weight-medium auth-form-btn" type='submit'>SIGN IN</button>
                  </div>
                  {/* <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input"/> Keep me signed in </label>
                    </div>
                    <Link href="#" className="auth-link text-black">Forgot password?</Link>
                  </div>
                
                  <div className="text-center mt-4 font-weight-light"> Don't have an account? <Link href="/register" className="text-primary">Create</Link>
                  </div> */}
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loader/>
    </>
  )
}
