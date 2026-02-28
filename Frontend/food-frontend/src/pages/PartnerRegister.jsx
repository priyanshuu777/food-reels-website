import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const PartnerRegister = () => {
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const businessName = e.target.businessName.value
    const contactName = e.target.contactName.value
    const contactNumber = e.target.contactNumber.value
    const address = e.target.address.value
    const email = e.target.email.value
    const password = e.target.password.value

    const response = await axios.post("http://localhost:3000/api/auth/foodpartner/register",{
    
    name:businessName, 
    contactName,
    phone:contactNumber,
    address,
    email,
    password
  },{
      withCredentials: true//yeh line cookies bhejne ke liye hai
    })
  console.log("partner registered",response.data);
  navigate("/create-food")

  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">FoodApp</div>
        <div className="auth-switch">
          <Link to="/user/register">Register as user</Link>
          <Link to="/food-partner/register" className="primary">Register as partner</Link>
        </div>
        <h2 className="auth-title">Partner sign up</h2>
        <div className="auth-sub">Register as a food partner to list your menu</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Business name</label>
            <input name="businessName" className="auth-input" placeholder="Restaurant or vendor name" />
          </div>

          <div className="auth-field">
            <label className="auth-label">Contact name</label>
            <input name="contactName" className="auth-input" placeholder="Owner / manager name" />
          </div>

          <div className="auth-field">
            <label className="auth-label">Contact number</label>
            <input name="contactNumber" className="auth-input" type="tel" placeholder="+1 555 555 5555" />
          </div>

          <div className="auth-field">
            <label className="auth-label">Business address</label>
            <textarea name="address" className="auth-input" rows={3} placeholder="Street, city, state, postal code" />
          </div>

          <div className="auth-field">
            <label className="auth-label">Contact email</label>
            <input name="email" className="auth-input" placeholder="partner@example.com" />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input name="password" className="auth-input" type="password" placeholder="••••••••" />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn">Create account</button>
            <Link to="/food-partner/login" className="btn secondary">Sign in</Link>
          </div>

          <div className="auth-footer">We will verify your business before activating listings.</div>
        </form>
      </div>
    </div>
  )
}

export default PartnerRegister
