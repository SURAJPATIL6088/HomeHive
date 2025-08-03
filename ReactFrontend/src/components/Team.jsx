import React from 'react';

const Team = () => {
  const members = [
    { name: "Suraj Patil", role: "Full-stack Developer" },
    { name: "Aditya Mane", role: "Backend Developer" },
    { name: "Rajnandini", role: "Frontend Engineer" },
    { name: "Janhvi", role: "Frontend Engineer" },
    { name: "Sakshi", role: "Frontend Engineer" },
  ];

  return (
    <div>
      <h2>Meet Our Team</h2>
      {members.map((member, index) => (
        <div key={index} style={{ margin: '1rem 0' }}>
          <h4>{member.name}</h4>
          <p>{member.role}</p>
        </div>
      ))}
    </div>
  );
};

export default Team;
