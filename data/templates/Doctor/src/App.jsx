import React from 'react';
import Template from './index.jsx';
import doctorProfile from './data/doctorProfile.js';

export default function App() {
  return (
    <Template data={doctorProfile} />
  );
}
