// import React, { useState } from 'react'
// import "./Css/login.css"

// function LoginSignUp() {

//   const [state, setState] = useState('Login')
//   const [formData, setformData] = useState({
//     username: "",
//     email: "",
//     password: ""
//   })
//   const changeHandler = (e) => {
//     setformData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const login = async () => {
//     console.log("Login function executed", formData);
//     let responseData;
//     await fetch('https://project-think-backend.onrender.com/login', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     }).then((Response) => Response.json()).then((data) => responseData = data)
//     if (responseData.success) {
//       localStorage.setItem('auth-token', responseData.token);
//       window.location.replace("/");
//     }
//     else {
//       alert(responseData.errors);
//     }
//   }

//   const signup = async () => {
//     console.log("Sign Up function executed", formData);
//     let responseData;
//     await fetch('https://project-think-backend.onrender.com/signup', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     }).then((Response) => Response.json()).then((data) => responseData = data)
//     if (responseData.success) {
//       localStorage.setItem('auth-token', responseData.token);
//       window.location.replace("/");
//     }
//     else {
//       alert(responseData.errors);
//     }
//   }

//   return (
//     <div className="LoginSignUp" >
//       <div className="container">
//         <h1>{state}</h1>
//         <div className="feild">
//           {state === "Sign Up" ? <input type="text" name='username' value={formData.username} onChange={changeHandler} placeholder='Enter Your Name' /> : <></>}
//           <input type="email" name='email' value={formData.email} onChange={changeHandler} placeholder='Enter Your Email' />
//           <input type="pass" name='password' value={formData.password} onChange={changeHandler} placeholder='Enter Your Password' />
//         </div>
//         <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
//         {
//           state === "Sign Up" ?
//             <p className="alredy-login"> Already have an accounnt <span onClick={() => { setState("Login") }}>Login here</span></p> :
//             <p className="alredy-login"> Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>
//         }
//         <div className="agree">
//           <input type="checkbox" name='' id='' />
//           <p>By continuing, i agree to the term of use & privacy policy.</p>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginSignUp



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Css/login.css";

function LoginSignUp() {
  const [state, setState] = useState('Login');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    let responseData;
    await fetch('https://project-think-backend.onrender.com/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      localStorage.setItem('role', responseData.role);
      navigate(responseData.role === "admin" ? "/admin" : "/");
    } else {
      alert(responseData.errors || responseData.message);
    }
  };

  const signup = async () => {
    const dataToSend = {
      name: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role || "user",
    };

    let responseData;
    await fetch('https://project-think-backend.onrender.com/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => res.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      localStorage.setItem('role', responseData.role);
      navigate(responseData.role === "admin" ? "/admin" : "/");
    } else {
      alert(responseData.errors || responseData.message);
    }
  };

  return (
    <div className="LoginSignUp">
      <div className="container">
        <h1>{state}</h1>
        <div className="feild">
          {state === "Sign Up" && (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={changeHandler}
              placeholder="Enter Your Name"
              required
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            placeholder="Enter Your Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            placeholder="Enter Your Password"
            required
          />
          {state === "Sign Up" && (
            <select name="role" value={formData.role} onChange={changeHandler} required>
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}
        </div>

        <button onClick={() => (state === "Login" ? login() : signup())}>
          Continue
        </button>

        {state === "Sign Up" ? (
          <p className="alredy-login">
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="alredy-login">
            Create an account?{" "}
            <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}

        <div className="agree">
          <input type="checkbox" required />
          <p>By continuing, I agree to the Terms of Use & Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginSignUp;
