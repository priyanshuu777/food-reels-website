import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const UserRegister = () => {
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()

    const firstName = e.target.firstName.value
    const lastName = e.target.lastName.value
    const email = e.target.email.value
    const password = e.target.password.value

 const response = await axios.post("http://localhost:3000/api/auth/user/register",{
    
    fullname: firstName + " " + lastName,
    email,
   password
  },{
     withCredentials: true//yeh line cookies bhejne ke liye hai 
    })
  console.log("user registered",response.data);

  navigate("/")
  //axios ka use kiya hai data bhejne ke liye backend ko

    // Example axios POST (uncomment and set your endpoint):
    // try {
    //   const res = await axios.post('http://localhost:5000/api/register', { firstName, lastName, email, password })
    //   console.log('server response', res.data)
    // } catch (err) {
    //   console.error('register error', err)
    // }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">FoodApp</div>
        <div className="auth-switch">
          <Link to="/user/register" className="primary">Register as user</Link>
          <Link to="/food-partner/register">Register as partner</Link>
        </div>
        <h2 className="auth-title">Create account</h2>
        <div className="auth-sub">Register as a user to explore meals</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">First name</label>
            <input name="firstName" className="auth-input" placeholder="First name" />
          </div>

          <div className="auth-field">
            <label className="auth-label">Last name</label>
            <input name="lastName" className="auth-input" placeholder="Last name" />
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input name="email" className="auth-input" placeholder="you@example.com" />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input name="password" className="auth-input" type="password" placeholder="••••••••" />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn">Create account</button>
            <Link to="/user/login" className="btn secondary">Sign in</Link>
          </div>

          <div className="auth-footer">By continuing you agree to our terms and privacy.</div>
        </form>
      </div>
    </div>
  )
}

export default UserRegister
