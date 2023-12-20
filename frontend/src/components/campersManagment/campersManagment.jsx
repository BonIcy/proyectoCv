import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import CamperModal from '../campers/modal';
import { Button, Form, Select, Card } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from 'react-router-dom';
import "./search.css";

const CampersList = () => {
  const [campers, setCampers] = useState([]);
  const [showWorking, setShowWorking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCamper, setSelectedCamper] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const sourceRef = useRef(axios.CancelToken.source());

  useEffect(() => {
    fetchData();

    return () => {
      sourceRef.current.cancel('Operation canceled by cleanup.');
      sourceRef.current = axios.CancelToken.source();
    };
  }, [showWorking, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);

      let response;

      if (searchTerm === "") {
        response = await axios.get(
          `http://localhost:6929/cvs/Campers/WorkOrNot/${showWorking}`,
          { cancelToken: sourceRef.current.token }
        );
      } else {
        const filters = {};

        if (searchTerm !== "") {
          filters["$or"] = [
            { Name: { $regex: searchTerm, $options: "i" } },
            { LastName: { $regex: searchTerm, $options: "i" } },
          ];
        }

        response = await axios.post(
          `http://localhost:6929/cvs/Campers/SearchEngine`,
          {
            $match: filters,
          },
          { cancelToken: sourceRef.current.token }
        );
      }

      setCampers(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error("Error fetching camper data:", error);
      }
    } finally {
      setLoading(false);
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

  const deleteData = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this camper?');
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:6929/cvs/newCamper/del/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting camper:', error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchData();
    }
  };

  const searchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
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
      <Form.Field>
        <label>Search by Name:</label>
        <div className='group'>
          <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            type="text"
            placeholder="Enter camper name"
            value={searchTerm}
            onChange={searchChange}
            onKeyDown={handleKeyDown}
            className='input'
          />
        </div>
      </Form.Field>
      <Card.Group>
        {loading && <p>Loading...</p>}
        {!loading && campers.map((camper) => (
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
              <div className="ui four buttons">
                <Button color="blue" onClick={() => openModal(camper)}>
                  See Details
                </Button>
                <Button color="green" onClick={() => changeStatus(camper._id)}>
                  Change Status
                </Button>
                <Button color="red" onClick={() => deleteData(camper._id)}>
                  Delete
                </Button>
                <Link to={`/updateCamper/${camper._id}`}>
                  <Button color="yellow">
                    Update
                  </Button>
                </Link>
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
