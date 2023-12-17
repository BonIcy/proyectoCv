import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Select } from 'semantic-ui-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CamperModal from '../campers/modal';

const Campers = () => {
  const [campers, setCampers] = useState([]);
  const [showWorking, setShowWorking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCamper, setSelectedCamper] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const [englishLevelOptions, setEnglishLevelOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (filterValue === null) {
          response = await axios.get(`http://localhost:6929/cvs/Campers/WorkOrNot/${showWorking}`);
        } else {
          response = await axios.post(`http://localhost:6929/cvs/Campers/SearchEngine`, {
            EnglishLevel: filterValue,
            $match: {
              'EnglishLevelInfo._id': filterValue 
            },
          });
        }

        setCampers(response.data);
      } catch (error) {
        console.error('Error fetching camper data:', error);
      }
    };

    fetchData();
  }, [showWorking, filterValue]);

  useEffect(() => {
    axios.get('http://localhost:6929/cvs/English_Levels/')
      .then(response => {
        const options = response.data.map(option => ({
          key: option._id,
          text: option.E_Name,
          value: option._id,
        }));
        setEnglishLevelOptions(options);
      })
      .catch(error => {
        console.error('Error fetching English Levels data:', error);
      });
  }, []);

  const openModal = (camper) => {
    setSelectedCamper(camper);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCamper(null);
  };

  const filterChange = (e, data) => {
    const value = data.value;
    setFilterValue(value);
  };

  return (
    <div>
      <Form.Field>
        <label>Filter by English Level:</label>
        <Select
          placeholder="Select English Level"
          options={englishLevelOptions}
          onChange={filterChange}
        />
      </Form.Field>
  
      {campers.length === 0 || campers.every(camper => camper.Working === true) ? (
        <p>There are no available data with these parameters. :(</p>
      ) : (
        campers
          .filter(camper => camper.Working === false)
          .map(camper => (
            <div key={camper._id} className="card">
              <h2>{`${camper.Name} ${camper.LastName}`}</h2>
              <p>Location: {camper.Location}</p>
              <p>Salary: {camper.Salary}</p>
              <p>English Level: {camper.EnglishLevel}</p>
              <p>Skills: {camper.Skills.join(', ')}</p>
              <Button onClick={() => openModal(camper)}>
                See Details
              </Button>
            </div>
          ))
      )}
  
      <CamperModal show={showModal} onHide={closeModal} camper={selectedCamper} />
    </div>
  );
  };
  
  export default Campers;