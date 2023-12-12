import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CamperModal from '../campers/modal'; 

const Campers = () => {
  const [campers, setCampers] = useState([]);
  const [showWorking, setShowWorking] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [selectedCamper, setSelectedCamper] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:6929/cvs/Campers/WorkOrNot/${showWorking}`)
      .then(response => {
        setCampers(response.data);
      })
      .catch(error => {
        console.error('Error fetching camper data:', error);
      });
  }, [showWorking]);

  const openDetailsModal = (camper) => {
    setSelectedCamper(camper);
    setShowModal(true);
  };

  const closeDetailsModal = () => {
    setShowModal(false);
    setSelectedCamper(null);
  };

  return (
    <div>
      {campers.map(camper => (
        <div key={camper._id} className="card">
          <h2>{`${camper.Name} ${camper.LastName}`}</h2>
          <p>Location: {camper.Location}</p>
          <p>Salary: {camper.Salary}</p>
          <p>English Level: {camper.EnglishLevel}</p>
          <p>Skills: {camper.Skills.join(', ')}</p>
          <Button onClick={() => openDetailsModal(camper)}>
            See Details
          </Button>
        </div>
      ))}

      <CamperModal show={showModal} onHide={closeDetailsModal} camper={selectedCamper} />
    </div>
  );
};

export default Campers;