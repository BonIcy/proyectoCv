import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import CamperModal from '../campers/modal';
import { Card, Button, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from 'react-router-dom';


const CampersList = () => {
  const [campers, setCampers] = useState([]);
  const [showWorking, setShowWorking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCamper, setSelectedCamper] = useState(null);

  useEffect(() => {
    fetchData();
  }, [showWorking]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:6929/cvs/Campers/WorkOrNot/${showWorking}`);
      setCampers(response.data);
    } catch (error) {
      console.error('Error fetching camper data:', error);
    }
  };

  const openModal = (camper) => {
    setSelectedCamper(camper);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCamper(null);
  };

  const changeStatus = async (id) => {
    try {
      await axios.put(`http://localhost:6929/cvs/hiring/Campers/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error updating camper status:', error);
    }
  };

  const postData = async () => {
    // logica de postt
  };

  const updateData = async () => {
    // logica de update
  };

  const deleteData = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this camper?');
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:6929/cvs/del/Campers/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting camper:', error);
      }
    }
  };

  return (
    <div>
      <div>
          <div className="button-container">
              <Link to="/postCamper">
                  <Button className="post-button">Post Camper</Button>
              </Link>
          </div>
        <button onClick={() => setShowWorking(true)}>Show Working</button>
        <button onClick={() => setShowWorking(false)}>Show Not Working</button>
      </div>
      <Card.Group>
        {campers.map(camper => (
          <Card key={camper._id}>
            <Card.Content>
              <Card.Header>{`${camper.Name} ${camper.LastName}`}</Card.Header>
              <Card.Meta>ID: {camper._id}</Card.Meta>
              <Card.Description>
                <p>Location: {camper.Location}</p>
                <p>Salary: {camper.Salary}</p>
                <p>English Level: {camper.EnglishLevel}</p>
                <p>Skills: {camper.Skills.join(', ')}</p>
                <p>Working: {camper.Working ? 'Yes' : 'No'}</p>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui three buttons">
                <Button color="blue" onClick={() => openModal(camper)}>
                  See Details
                </Button>
                <Button color="green" onClick={() => changeStatus(camper._id)}>
                  Change Status
                </Button>
                <Button color="red" onClick={() => deleteData(camper._id)}>
                  Delete
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>

      <CamperModal show={showModal} onHide={closeModal} camper={selectedCamper} />
    </div>
  );
};

export default CampersList;