import React from 'react';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>We’d love to hear from you! Reach out to us through any of the following:</p>

      <div className="contact-info">
        <p><strong>Email:</strong> support@myshop.com</p>
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p><strong>Address:</strong> 123 Market Street, Nellore, Andhra Pradesh, India</p>
      </div>

      {/* Optional: Add a simple contact form later */}
    </div>
  );
};

export default ContactUs;
