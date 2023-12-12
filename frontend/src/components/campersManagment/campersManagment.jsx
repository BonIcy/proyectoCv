import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CampersList = () => {
  const [campers, setCampers] = useState([]);
  const [showWorking, setShowWorking] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:6929/cvs/Campers/WorkOrNot/${showWorking}`)
      .then(response => {
        setCampers(response.data);
      })
      .catch(error => {
        console.error('Error fetching camper data:', error);
      });
  }, [showWorking]);

  const changeStatus = async (id) => {
    try {
      await axios.put(`http://localhost:6929/cvs/hiring/Campers/${id}`);
      const updatedData = await axios.get(`http://localhost:6929/cvs/Campers/WorkOrNot/${showWorking}`);
      setCampers(updatedData.data);
    } catch (error) {
      console.error('Error updating camper status:', error);
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setShowWorking(true)}>Show Working</button>
        <button onClick={() => setShowWorking(false)}>Show Not Working</button>
      </div>
      {campers.map(camper => (
        <div key={camper._id} className="card">
          <h2>{`${camper.Name} ${camper.LastName}`}</h2>
          <p>Location: {camper.Location}</p>
          <p>Salary: {camper.Salary}</p>
          <p>English Level: {camper.EnglishLevel}</p>
          <p>Skills: {camper.Skills.join(', ')}</p>
          <p>Working: {camper.Working ? 'Yes' : 'No'}</p>
          <button onClick={() => changeStatus(camper._id)}>
            Change Status
          </button>
        </div>
      ))}
    </div>
  );
};

export default CampersList;
