import Link from 'next/link';
import { useEffect, useState } from 'react';
export default function Login() {
  const [loginDetails,setLoginDetails] = useState({username:"",password:""})
  const [error,setError] = useState(false)
  const formSubmit = async(e)=>{
    e.preventDefault()
    try {
      const loginApi = await fetch("https://jharvis.com/JarvisV2/signin",{
        method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginDetails)
      })
      const loginApiRes = await loginApi.json()
      alert(loginApiRes)
      console.log(loginApiRes)
    } catch (error) {
      console.log(error.message)
    }
  }
  const handleInput = (e)=>{
    setLoginDetails({...loginDetails,[e.target.name]:e.target.value})
  }
  useEffect(()=>{
console.log("loginDetails",loginDetails)
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
                <form className="pt-3" onSubmit={formSubmit}>
                  <div className="form-group">
                    <input type="email" name='username' onChange={handleInput} className="form-control form-control-lg" id="exampleInputEmail1" placeholder="Username"/>
                  </div>
                  <div className="form-group">
                    <input type="password" name='password' onChange={handleInput} className="form-control form-control-lg" id="exampleInputPassword1" placeholder="Password"/>
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
