import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import CamperModal from '../campers/modal';
import { Button, Form, Select, Card } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from 'react-router-dom';
import "./search.css";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import Grid from '@mui/material/Grid';

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
 
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{padding: '20px'}}>
        {campers.map((camper) => (
           <>
           <Grid item xs={4} sm={4} md={4} key={camper.Name}>
             <div className='cardCamer' style={{background: camper.Gender === "Male"
             ? "url('https://i.ibb.co/tQ815sK/Cover-2.png') center/cover no-repeat"
             : camper.Gender === "Female"
               ? "url('https://i.ibb.co/SyHfdD8/Cover-1.png') center/cover no-repeat"
               : "url('https://i.ibb.co/GnpKhT6/Cover-3.png') center/cover no-repeat", height: '750px'}}>
               <div className="content">
                 <span></span>
                 <div className='img'>
                   <img src={camper.Gender === "Male" ?  'https://i.ibb.co/rHfYYfJ/camper-Logo-removebg-preview.png': camper.Gender === "Female" ?  'https://i.ibb.co/bs4H7hs/camper-WLogo-removebg-preview.png':'https://i.ibb.co/nQdGyJF/camper-BLogo-removebg-preview.png'} alt='Camper'/>
                 </div>
                 <h4 className='nameCamper'>{`${camper.Name} ${camper.LastName}`}</h4>
                 <h6 className='location' 
                 style={{ color: camper.Gender === "Male"
                 ? "#3A539B"
                 : camper.Gender === "Female"
                   ? "#9B3A69"
                   : "#797979"}}>{camper.Location}</h6>
                 <p className='Info'>Salary <br></br>
                   {camper.Salary}</p>
                 <p className='Info'>English Level <br></br>
                 {camper.EnglishLevel}</p>
                 <p className='Info'>Working <br></br>
                 {camper.Working ? 'Yes' : 'No'}</p>
                 <div style={{ backgroundColor: camper.Gender === "Male"
                 ? "#3A539B"
                 : camper.Gender === "Female"
                 ? "#9B3A69"
                 : "#797979", paddingBlock: '20px'}}>
                 <p className='Skills'>Skills</p>
                 <ul class="tag">
                     { camper.Skills.map((skill, index) => (
                       <li className="tag__name" key={index}> {skill}</li>
                     ))}
                   </ul>
                   <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>                
                    <AddCircleIcon sx={{ width: 56, height: 56, color: '#ccc' }} onClick={() => openModal(camper)}/>
                    <ChangeCircleIcon sx={{ width: 56, height: 56, color: '#ccc' }} onClick={() => changeStatus(camper._id)}/>
                    <DeleteForeverIcon sx={{ width: 56, height: 56, color: '#ccc' }} onClick={() => deleteData(camper._id)}/> 
                    <Link to={`/updateCamper/${camper._id}`}>
                      <DriveFileRenameOutlineIcon sx={{ width: 56, height: 56, color: '#ccc' }}/>
                    </Link>
                   </div>
                 </div>
               </div>
             </div>
         </Grid>
         </>
        ))}
      </Grid>
    

      <CamperModal show={showModal} onHide={closeModal} camper={selectedCamper} />
    </div>
  );
};

export default CampersList;
