import React from 'react';

const Feedback = () => (
  <form>
    <h2>Feedback</h2>
    <input type="text" placeholder="Name (optional)" />
    <textarea placeholder="Your Feedback" rows="4" required></textarea>
    <button type="submit">Submit Feedback</button>
  </form>
);

export default Feedback;
