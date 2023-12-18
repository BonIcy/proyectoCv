import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useHistory, Link, useLocation,useParams } from "react-router-dom";
import { Button, Form,Message, Select } from 'semantic-ui-react';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const PostCamper = () => {
  const [camperData, setCamperData] = useState({
    Name: '',
    LastName: '',
    Email: '',
    Phone: '',
    identification: '',
    Location: '',
    Salary: '',
    EnglishLevel: '',
    Biography: '',
    Skills: [],
    Stacks: [],
    Gender: '',
    TypeDocument: '',
    pdf: null,
    Github: '',
    LinkedIn: '',
    PresentationVideo: '',
  });

  const [pdfData, setpdfData] = useState({
    data: null
  });

  const [genderOptions, setGenderOptions] = useState([]);
  const [englishLevelOptions, setEnglishLevelOptions] = useState([]);
  const [TypeDocumentOptions, setTypeDocumentOptions] = useState([]);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetchCollectionOptions('Gender', setGenderOptions);
    fetchCollectionOptions('English_Levels', setEnglishLevelOptions);
    fetchCollectionOptions('Document_Type', setTypeDocumentOptions);
    fetchCollectionOptions('Skills', setSkillsOptions);
  }, []);

  const fetchCollectionOptions = async (collectionName, setOptions) => {
    try {
      const response = await axios.get(`http://localhost:6929/cvs/${collectionName}`);
      let options = [];
  
      if (collectionName === 'Gender' || collectionName === 'Document_Type') {
        options = response.data.map((option) => ({ key: option._id, text: option.Name, value: option._id }));
      } else if (collectionName === 'Skills') {
        options = response.data.map((option) => ({ key: option._id, text: option.S_Name, value: option._id }));
      } else {
        options = response.data.map((option) => ({ key: option._id, text: option.E_Name || option.S_Name, value: option._id || option._id }));
      }
  
      setOptions(options);
    } catch (error) {
      console.error(`Error fetching ${collectionName} options:`, error);
    }
  };
  

  const camperChange = (e, data) => {
    const { name, value } = data ? data : e.target;
    let updatedValue = value;
  
    if ((name === 'Skills' || name === 'Stacks') && typeof value === 'string') {
      updatedValue = value.split('\n').map((item) => item.trim());
    }
  
    setCamperData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };
  

  const pdfChange = (e) => {
    const { name, files } = e.target;
    const file = files[0]
    console.log(file);
    setpdfData((prevData) => ({
      ...prevData,
      pdf: file,
    }));
  };

  const Sumbitt = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      console.log(pdfData);
      formData.append("pdf", pdfData.pdf);

  
  
      Object.entries(camperData).forEach(([key, value]) => {
        if (key === 'SocialMedia') {
          Object.entries(value).forEach(([socialKey, socialValue]) => {
            formData.append(`Social_Network.${socialKey}`, socialValue);
          });
        } else if (key === 'Skills') {
          value.forEach((skill) => {
            formData.append('Skills', skill);
          });
        } else if (key === 'Stacks') {
          value.forEach((Stacks) => {
            formData.append('Stacks', Stacks);
          });
        } else {
          formData.append(key, value);
        }
      });
      
      const response = await axios.post('http://localhost:6929/cvs/newCamper/add', formData);

      setSuccessMessage('Camper posted successfully!');
      setErrorMessage('');
      setIsSuccessVisible(true);
      setCamperData({
        Name: '',
        LastName: '',
        Email: '',
        Phone: '',
        identification: '',
        Location: '',
        Salary: '',
        EnglishLevel: '',
        Biography: '',
        Skills: [],
        Stacks: [],
        Gender: '',
        TypeDocument: '',
        pdf: null,
        Github: '',
        LinkedIn: '',
        PresentationVideo: '',
      });
  
      setpdfData({ data: null });
      // history.push('/managmentCampers');
    } catch (error) {
      console.error('Error posting camper:', error.response);
      setErrorMessage('Error posting camper. Please try again.');
      setSuccessMessage('');
    }
  };
  


  return (
    <div>
      <h2>Create New Camper</h2>
      <div className="button-container">
        <Link to="/managmentCampers">
          <Button className="shadow2__btn">Back to Camper Administration</Button>
        </Link>
      </div>
      <form onSubmit={Sumbitt}>
      <label>Name:</label>
      <input type="text" name="Name" value={camperData.Name} onChange={(e) => camperChange(e, e.target)} required />

      <label>Last Name:</label>
      <input type="text" name="LastName" value={camperData.LastName} onChange={(e) => camperChange(e, e.target)} required />

      <label>Email:</label>
      <input type="email" name="Email" value={camperData.Email} onChange={(e) => camperChange(e, e.target)} required />

      <label>Phone:</label>
      <input type="text" name="Phone" value={camperData.Phone} onChange={(e) => camperChange(e, e.target)} required />

      <label>Identification:</label>
      <input type="text" name="identification" value={camperData.identification} onChange={(e) => camperChange(e, e.target)} required />

      <label>Location:</label>
      <input type="text" name="Location" value={camperData.Location} onChange={(e) => camperChange(e, e.target)} required />

      <label>Salary:</label>
      <input type="number" name="Salary" value={camperData.Salary} onChange={(e) => camperChange(e, e.target)} required />

      <label>Biography:</label>
      <textarea name="Biography" value={camperData.Biography} onChange={(e) => camperChange(e, e.target)} required />

      <label>Stacks:</label>
        <textarea
          name="Stacks"
          value={camperData.Stacks.join('\n')} 
          onChange={(e) => camperChange(e, e.target)}
          required
        />


      <Form.Field>
          <label>Gender:</label>
          <Select
            name="Gender"
            value={camperData.Gender}
            options={genderOptions}
            onChange={camperChange}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>English Level:</label>
          <Select
            name="EnglishLevel"
            value={camperData.EnglishLevel}
            options={englishLevelOptions}
            onChange={camperChange}
            required
          />
        </Form.Field>

      <Form.Field>
          <label>Document Type:</label>
          <Select
            name="TypeDocument"
            value={camperData.TypeDocument}
            options={TypeDocumentOptions}
            onChange={camperChange}
            required
          />
        </Form.Field>

      <label>Skills:</label>
      <Select
        name="Skills"
        placeholder="Select Skills"
        value={camperData.Skills}
        options={skillsOptions}
        onChange={camperChange}
        multiple
        />


        <label>pdf (PDF):</label>
        <input type="file" name="pdf" accept=".pdf" onChange={pdfChange} />


        <label>Github:</label>
        <input type="text" name="Github" value={camperData.Github} onChange={camperChange} />

        <label>LinkedIn:</label>
        <input type="text" name="LinkedIn" value={camperData.LinkedIn} onChange={camperChange} />

        <label>Presentation Video:</label>
        <input type="text" name="PresentationVideo" value={camperData.PresentationVideo} onChange={camperChange} />
        <button type="submit">Post Camper</button>
      </form>
      {isSuccessVisible && (
        <Message success>
          <Message.Header>Success!</Message.Header>
          <p>{successMessage}</p>
        </Message>
      )}
      {errorMessage && (
        <Message error>
          <Message.Header>Error!</Message.Header>
          <p>{errorMessage}</p>
        </Message>
        )}
    </div>
  );
};

export default PostCamper;