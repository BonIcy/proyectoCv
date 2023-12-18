import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Select, Dropdown } from 'semantic-ui-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CamperModal from '../campers/modal';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import BottomNavigation from '@mui/material/BottomNavigation';
import TerminalIcon from '@mui/icons-material/Terminal';
import WcIcon from '@mui/icons-material/Wc';
import TypeSpecimenIcon from '@mui/icons-material/TypeSpecimen';
import Avatar from '@mui/material/Avatar';
import PinDropIcon from '@mui/icons-material/PinDrop';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import './camperCardsDesign.css';
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
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

    <div style={{backgroundColor: '#E8F4FD'}}>
       <AppBar position="static">
        <Toolbar style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '130px', 
        background: "url('https://i.ibb.co/31hK6XN/maxresdefault.png') center/cover no-repeat"}}>
    
          <Typography variant="h2" style={{ fontFamily: 'Poppins', marginBottom: '5px' }}>
            Campers Portfolio
          </Typography>

          <Typography variant="h5" sx={{ }}>
            In this section you will be able to see the profiles of our star campers.
          </Typography>
        </Toolbar>
      </AppBar>
      <Typography component="h1" variant="h5" 
      sx={{display: 'flex', flexDirection:'column', 
        marginY: '10px',
        justifyContent: 'center', alignItems: 'center',
        opacity: 0.9,
        border: "2px solid #58BC8",
        display: "block",
        color: "#000087",
        fontFamily: "monospace",
        caretColor: "#b6003f",
        fontWeight: 700,
        textAlign: "center"}}>
                    Filters
      </Typography>
      <BottomNavigation fullWidth value={value} onChange={handleChange} sx={{height: '130px', bgcolor: '#E8F4FD'}}>
        <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', textAlign: "center", marginRight: '15px'}}>
          <Avatar sx={{ m: 0.5, bgcolor: '#000087' }}>
            <TypeSpecimenIcon />
          </Avatar>
          <Typography component="h6" variant="h6">
          English Level
          </Typography>
          <Form.Field>
            <Select
              placeholder="Select English Level"
              options={englishLevelOptions}
              onChange={(e, data) => filterChange(e, data)}
              multiple 
            />
          </Form.Field>
        </div>
        <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', textAlign: "center", marginRight: '15px'}}>
          <Avatar sx={{ m: 0.5, bgcolor: '#000087' }}>
            <WcIcon />
          </Avatar>
          <Typography component="h6" variant="h6">
          Gender
          </Typography>
          <Form.Field>
            <Select
              placeholder="Select Gender"
              options={genderOptions}
              onChange={(e, data) => genderChange(e, data)}
              multiple 
            />
          </Form.Field>
        </div>
        <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', textAlign: "center"}}>
          <Avatar sx={{ m: 0.5, bgcolor: '#000087' }}>
            <TerminalIcon />
          </Avatar>
          <Typography component="h6" variant="h6">
          Skills
          </Typography>
          <Form.Field>
            <Dropdown
              placeholder="Select Skills"
              fluid
              multiple
              selection
              options={skillsOptions}
              onChange={skillsChange}
            />
          </Form.Field>
        </div>
      </BottomNavigation>
      <br></br>
      <br></br>
      <br></br>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{padding: '20px'}}>
      {campers.length === 0 || campers.every(camper => camper.Working === true) ? (
        <p>There are no available data with these parameters. :(</p>
      ) : (
        campers
          .filter(camper => camper.Working === false)
          .map(camper => (
            <>
              <Grid item xs={4} sm={4} md={4} key={camper.Name}>
              <div
                className="card"
                style={{   zIndex: '1', margin: '0 auto', backgroundColor: '#E4E4DB', borderRadius: '10px'}}
              >
                <div className="tools" style={{ display: 'flex', alignItems: 'center', padding: '9px' }}>
                  <div className="circle" style={{ padding: '0 4px' }}>
                    <span
                      className="red box"
                      style={{
                        display: 'inline-block',
                        alignItems: 'center',
                        width: '10px',
                        height: '10px',
                        padding: '1px',
                        borderRadius: '50%',
                        backgroundColor: '#ff605c',
                      }}
                    ></span>
                  </div>
                  <div className="circle" style={{ padding: '0 4px' }}>
                    <span
                      className="yellow box"
                      style={{
                        display: 'inline-block',
                        alignItems: 'center',
                        width: '10px',
                        height: '10px',
                        padding: '1px',
                        borderRadius: '50%',
                        backgroundColor: '#ffbd44',
                      }}
                    ></span>
                  </div>
                  <div className="circle" style={{ padding: '0 4px' }}>
                    <span
                      className="green box"
                      style={{
                        display: 'inline-block',
                        alignItems: 'center',
                        width: '10px',
                        height: '10px',
                        padding: '1px',
                        borderRadius: '50%',
                        backgroundColor: '#00ca4e',
                      }}
                    ></span>
                  </div>
                </div>
                <div className="card__content">
                  <div style={{maxwidth: '100%'}}>
                    <img style={{ display: 'flex', maxWidth: '300px', background: "url('https://i.ibb.co/PM60NdF/fondo2.png') center/contain no-repeat", height: 'auto', verticalAlign: 'middle', margin: '0 auto', padding: '50px',}} src={camper.Gender == "Female" ? 'https://i.ibb.co/hcVyYBB/man-in-space-2.png' : 'https://i.ibb.co/LP2yZzC/man-in-space-1.png'} alt="security"/>
                  </div>
                  <div key={camper._id} className="card" style={{ backgroundColor: '#E4E4DB', display: 'flex', alignItems: 'center',}}>
                     
                     
                      <Typography component="h6" variant="h7"  sx={{display: 'flex',
                      marginY: '10px',
                      justifyContent: 'center', alignItems: 'center',
                      opacity: 0.9,
                      border: "2px solid #58BC8",
                      display: "block",
                      color: "#000087",
                      fontFamily: "monospace",
                      caretColor: "#b6003f",
                      fontWeight: 700,
                      fontSize: '30px',
                      textAlign: "center"}}>
                        
                        <TerminalIcon  sx={{ bgcolor: '#000087', color: '#FFFFFF', borderRadius: '20%', marginRight: '10px' }}/>
                        {`${camper.Name} ${camper.LastName}`}
                      </Typography>
                      <Typography component="h6" variant="h7"  sx={{display: 'flex',
                      marginY: '10px',
                      justifyContent: 'center', alignItems: 'center',
                      opacity: 0.9,
                      border: "2px solid #58BC8",
                      display: "block",
                      color: "#000000",
                      fontFamily: "monospace",
                      caretColor: "#b6003f",
                      fontWeight: 700,
                      fontSize: '20px',
                      textAlign: "center"}}>
                        
                        <PinDropIcon  sx={{ bgcolor: '#000087', color: '#FFFFFF', borderRadius: '20%', marginRight: '10px' }}/>
                        {camper.Location}
                      </Typography>
                      <Typography component="h6" variant="h7"  sx={{display: 'flex',
                      marginY: '10px',
                      justifyContent: 'center', alignItems: 'center',
                      opacity: 0.9,
                      border: "2px solid #58BC8",
                      display: "block",
                      color: "#000000",
                      fontFamily: "monospace",
                      caretColor: "#b6003f",
                      fontWeight: 700,
                      fontSize: '20px',
                      textAlign: "center"}}>
                        
                        <AttachMoneyIcon  sx={{ bgcolor: '#000087', color: '#FFFFFF', borderRadius: '20%', marginRight: '10px' }}/>
                        {camper.Salary}
                      </Typography>
                      <Typography component="h6" variant="h7"  sx={{display: 'flex',
                      marginY: '10px',
                      justifyContent: 'center', alignItems: 'center',
                      opacity: 0.9,
                      border: "2px solid #58BC8",
                      display: "block",
                      color: "#000000",
                      fontFamily: "monospace",
                      caretColor: "#b6003f",
                      fontWeight: 700,
                      fontSize: '20px',
                      textAlign: "center"}}>
                        
                        <AddCommentIcon  sx={{ bgcolor: '#000087', color: '#FFFFFF', borderRadius: '20%', marginRight: '10px' }}/>
                        {camper.EnglishLevel}
                      </Typography>
                      <div>
                      <div class="cardS">
                          <span class="title">Skills</span>
                          <div class="card__tags">
                            <ul class="tag">
                              <li class="tag__name">JS</li>
                              { camper.Skills.map((skill, index) => (
                                <li className="tag__name" key={index}> {skill}</li>
                              ))}
                            </ul>
                          </div>
                      </div>
                    </div>
                      <Button onClick={() => openModal(camper)}>
                        See Details
                      </Button>
                    </div>  
                  </div>
              </div>
            </Grid>
            </>
          ))
      )}
    </Grid>
     

      <CamperModal show={showModal} onHide={closeModal} camper={selectedCamper} />
    </div>
  );
};

export default Campers;