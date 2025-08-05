import React from 'react';

const ContactUs = () => (
  <form>
    <h2>Contact Us</h2>
    <input type="text" placeholder="Your Name" required />
    <input type="email" placeholder="Your Email" required />
    <textarea placeholder="Your Message" rows="4" required></textarea>
    <button type="submit">Send Message</button>
  </form>
);

export default ContactUs;
