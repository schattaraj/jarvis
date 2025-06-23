import { useState } from "react";
import { useRouter } from "next/router";
import { Form } from "react-bootstrap";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = () => {
    const realOtp = localStorage.getItem("otp_token");
    if (otp === realOtp) {
      localStorage.removeItem("otp_token");
      const role = localStorage.getItem("post2faRole");
      localStorage.removeItem("post2faRole");

      if (
        localStorage.getItem("route") &&
        localStorage.getItem("route") !== "/login"
      ) {
        router.push(localStorage.getItem("route"));
      } else if (role === "internal") {
        router.push("/dashboard");
      } else {
        router.push("/User/dashboard");
      }
    } else {
      setError("Invalid OTP");
    }
  };

  return (
    <div className="deep-background container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth">
          <div className="row flex-grow h-100">
            <div className="col-lg-4 d-none d-lg-block">
              <div className="d-flex align-items-end h-100 animate__animated animate__fadeInLeft">
                <img
                  className="left-side"
                  src="/images/Hello_Title.png"
                  alt=""
                />
              </div>
            </div>
            <div className="col-lg-4 mx-auto d-flex align-items-center">
              <div className="auth-form-light w-100 py-4 px-3 h-100 animate__animated animate__fadeInDown">
                <div className="top">
                  <div className="background-image">
                    <img src="/images/J_logo.png" alt="" />
                  </div>
                  <div className="text-center">
                    <h3>Two-Factor Authentication</h3>
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <Form className="pt-3">
                    <div className="form-group">
                      <Form.Control
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {error}
                      </Form.Control.Feedback>
                    </div>

                    <div className="mt-5">
                      <button
                        className="btn btn-block text-white btn-lg font-weight-medium"
                        type="button"
                        onClick={handleVerify}
                      >
                        Verify
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-block animate__animated animate__fadeInRight">
              <img
                className="right-side"
                src="/images/Jarvis_Logo.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
