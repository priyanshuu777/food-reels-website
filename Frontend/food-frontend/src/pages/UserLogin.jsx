import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogin = () => {
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    const response = await axios.post("http://localhost:3000/api/auth/user/login",{
    
    email,
    password
  },{
     withCredentials: true//yeh line cookies bhejne ke liye hai 
    })
  console.log("user logged in",response.data);
     navigate("/")

    // Example axios POST:
    // try {
    //   const res = await axios.post('http://localhost:5000/api/login', { email, password })
    //   console.log('login response', res.data)
    // } catch (err) {
    //   console.error('login error', err)
    // }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">FoodApp</div>
        <div className="auth-switch">
          <Link to="/user/login" className="primary">Log in as user</Link>
          <Link to="/food-partner/login">Log in as partner</Link>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <div className="auth-sub">Log in to your user account</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input name="email" className="auth-input" placeholder="you@example.com" />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input name="password" className="auth-input" type="password" placeholder="••••••••" />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn">Sign in</button>
            <Link to="/user/register" className="btn secondary">Create account</Link>
          </div>

          <div className="auth-footer">Need help? Contact support.</div>
        </form>
      </div>
    </div>
  )
}

export default UserLogin
