import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Loader from '../components/loader';
import { Context } from '../contexts/Context';
import backgroundImage from '../public/images/DRKBkgrd.png'
import 'animate.css';
import { getRoleFromToken } from '../utils/auth';
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
  const formSubmit = async(e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }
    setSubmitted(true); 
    context.setLoaderState(true);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginDetails)
        });

        const result = await response.json();

        if (response.status === 400) {
            setError(result.message);
        } else if (response.status === 200) {
            localStorage.setItem('access_token', result.accessToken);
            localStorage.setItem('sessionId', result.sessionId);
            if (localStorage.getItem('route') && localStorage.getItem('route') !== '/login') {
                router.push(localStorage.getItem('route'));
            } else {
            const role = getRoleFromToken(result.accessToken)
            if(role == "internal"){
              router.push('/dashboard');
            }
            else{
              router.push('/User/dashboard');
            }
            }
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error(error.message);
    }

    context.setLoaderState(false);
}

  // const formSubmit = async(e)=>{
  //   e.preventDefault()
  //   const validationErrors = validate();
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }
  //   setSubmitted(true); 
  //   context.setLoaderState(true)
  //   try {
  //     const sessionOut = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"authentication/sessionOut?username="+loginDetails?.userName)
  //     const loginApi = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"authentication/authenticate",{
  //       method: 'POST',
  //               headers: {
  //                   'Content-Type': 'application/json'
  //               },
  //               body: JSON.stringify(loginDetails)
  //     })
  //     const loginApiRes = await loginApi.json()
  //     if(loginApiRes?.statusCode == 4004){
  //       setError(loginApiRes?.message)
  //     }
  //     if(loginApiRes?.statusCode == 0){
  //       localStorage.setItem("access_token",loginApiRes?.payload?.accessToken)
  //       localStorage.setItem("sessionId",loginApiRes?.payload?.sessionId)
  //       if(localStorage.getItem('route') && localStorage.getItem('route') !=="/login"){
  //         router.push(localStorage.getItem('route'))
  //       }
  //       else{
  //         router.push("/admin")
  //       }
  //     }     
      
  //   } catch (error) {
  //     console.log(error.message)
  //   }
  //   context.setLoaderState(false) 
  // }
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
    <div className="deep-background container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth">
          <div className="row flex-grow h-100">
            <div className="col-lg-4 d-none d-lg-block">
              <div className="d-flex align-items-end h-100 animate__animated animate__fadeInLeft">
              <img className="left-side" src="/images/Hello_Title.png" alt="" />
              </div>
            </div>
            <div className="col-lg-4 mx-auto d-flex align-items-center">
              <div className="auth-form-light w-100 py-4 px-3 h-100 animate__animated animate__fadeInDown">
                <div className="top">
                <div className="background-image">
                  <img src="/images/J_logo.png" alt="" />
                </div>
                <div className="text-center">
              <h3>Sign in</h3>
               {/* <p>Don't have an account? Create One</p>  */}
               </div>
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
                  <div className="mt-5">
                    <button className="btn btn-block text-white btn-lg font-weight-medium" type='submit'>SIGN IN</button>
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
                {/* <div className="bottom mt-3">
                  <Link href="#">Forgot Username / password ?</Link>
                  <label htmlFor="checkbox" className='d-flex justify-content-center align-items-center'><input type="checkbox" id="checkbox" className='me-2'/>Keep Me Sign in</label>
                </div> */}
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-block animate__animated animate__fadeInRight">
              <img className="right-side" src="/images/Jarvis_Logo.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loader/>
    </>
  )
}
