import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Select, Dropdown } from 'semantic-ui-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CamperModal from '../campers/modal';

const Campers = () => {
  const [campers, setCampers] = useState([]);
  const [showWorking, setShowWorking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCamper, setSelectedCamper] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const [genderOptions, setGenderOptions] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [englishLevelOptions, setEnglishLevelOptions] = useState([]);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
  
        if (filterValue === null && (selectedGender === null || selectedGender.length === 0) && selectedSkills.length === 0) {
          response = await axios.get(`http://localhost:6929/cvs/Campers/WorkOrNot/${showWorking}`);
        } else {
          const filters = {};
  
          if (filterValue !== null) {
            filters['EnglishLevelInfo._id'] = { $in: filterValue };
          }
  
          if (selectedGender !== null && selectedGender.length > 0) {
            filters['GenderInfo._id'] = { $in: selectedGender };
          }
  
          if (selectedSkills.length > 0) {
            filters['SkillsInfo._id'] = { $all: selectedSkills };
          }
  
          response = await axios.post(`http://localhost:6929/cvs/Campers/SearchEngine`, {
            $match: filters,
          });
        }
  
        setCampers(response.data);
      } catch (error) {
        console.error('Error fetching camper data:', error);
      }
    };
  
    fetchData();
  }, [showWorking, filterValue, selectedGender, selectedSkills]);

  useEffect(() => {
    axios.get('http://localhost:6929/cvs/Gender/')
      .then(response => {
        const options = response.data.map(option => ({
          key: option._id,
          text: option.Name,
          value: option._id,
        }));
        setGenderOptions(options);
      })
      .catch(error => {
        console.error('Error fetching Gender data:', error);
      });
  }, []);

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

  useEffect(() => {
    axios.get('http://localhost:6929/cvs/Skills/')
      .then(response => {
        const options = response.data.map(option => ({
          key: option._id,
          text: option.S_Name,
          value: option._id,
        }));
        setSkillsOptions(options);
      })
      .catch(error => {
        console.error('Error fetching Skills data:', error);
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

  const genderChange = (e, data) => {
    const value = data.value;
    setSelectedGender(value);
  };

  const skillsChange = (e, data) => {
    const value = data.value;
    setSelectedSkills(value);
  };

  return (
    <div>
      <Form.Field>
        <label>Filter by English Level:</label>
        <Select
          placeholder="Select English Level"
          options={englishLevelOptions}
          onChange={(e, data) => filterChange(e, data)}
          multiple 
        />
      </Form.Field>

      <Form.Field>
        <label>Filter by Gender:</label>
        <Select
          placeholder="Select Gender"
          options={genderOptions}
          onChange={(e, data) => genderChange(e, data)}
          multiple 
        />
      </Form.Field>


      <Form.Field>
        <label>Filter by Skills:</label>
        <Dropdown
          placeholder="Select Skills"
          fluid
          multiple
          selection
          options={skillsOptions}
          onChange={skillsChange}
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