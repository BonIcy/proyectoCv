import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, Form, Select } from 'semantic-ui-react';
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
    Skills: [],
    Biography: '',
    Stacks: '',
    Gender: '',
    Working: false,
    DocumentType: '',
    CV: null,
    VideoCamper: '',
    SocialMedia: {
      Github: '',
      LinkedIn: '',
      DriveVideo: '',
    },
  });

  const [cvData, setCvData] = useState({
    name: '',
    data: null,
  });

  const [genderOptions, setGenderOptions] = useState([]);
  const [englishLevelOptions, setEnglishLevelOptions] = useState([]);
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
  const [skillsOptions, setSkillsOptions] = useState([]);

  const history = useHistory();

  useEffect(() => {
    fetchCollectionOptions('Gender', setGenderOptions);
    fetchCollectionOptions('English_Levels', setEnglishLevelOptions);
    fetchCollectionOptions('Document_Type', setDocumentTypeOptions);
    fetchCollectionOptions('Skills', setSkillsOptions);
  }, []);

  const fetchCollectionOptions = async (collectionName, setOptions) => {
    try {
      const response = await axios.get(`http://localhost:6929/cvs/${collectionName}`);
      let options = [];

      if (collectionName === 'Gender' || collectionName === 'Document_Type') {
        options = response.data.map((option) => ({ key: option._id, text: option.Name, value: option.Name }));
      } else {
        options = response.data.map((option) => ({ key: option._id, text: option.E_Name || option.S_Name, value: option.E_Name || option.S_Name }));
      }

      setOptions(options);
    } catch (error) {
      console.error(`Error fetching ${collectionName} options:`, error);
    }
  };

  const handleCamperChange = (e, data) => {
    const { name, value } = data ? data : e.target;
    const updatedValue = name === 'Skills' ? value : value;
  
    if (name.includes('SocialMedia')) {
      const socialMediaField = name.split('.')[1];
      setCamperData((prevData) => ({
        ...prevData,
        SocialMedia: {
          ...prevData.SocialMedia,
          [socialMediaField]: updatedValue,
        },
      }));
    } else {
      setCamperData((prevData) => ({
        ...prevData,
        [name]: updatedValue,
      }));
    }
  };
  
  

  const handleCvChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setCvData((prevData) => ({
      ...prevData,
      [name]: file.name,
      data: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('pdf', cvData.data);

      Object.entries(camperData).forEach(([key, value]) => {
        if (key === 'SocialMedia') {
          Object.entries(value).forEach(([socialKey, socialValue]) => {
            formData.append(`SocialMedia.${socialKey}`, socialValue);
          });
        } else if (key === 'Skills') {
          value.forEach((skill) => {
            formData.append('Skills', skill);
          });
        } else {
          formData.append(key, value);
        }
      });

      const response = await axios.post('http://localhost:6929/cvs/newCamper/add', formData);
      console.log(response.data);
      history.push('/campersList');
    } catch (error) {
      console.error('Error posting camper:', error.response);
    }
  };


  return (
    <div>
      <h2>Create New Camper</h2>
      <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input type="text" name="Name" value={camperData.Name} onChange={(e) => handleCamperChange(e, e.target)} required />

      <label>Last Name:</label>
      <input type="text" name="LastName" value={camperData.LastName} onChange={(e) => handleCamperChange(e, e.target)} required />

      <label>Email:</label>
      <input type="email" name="Email" value={camperData.Email} onChange={(e) => handleCamperChange(e, e.target)} required />

      <label>Phone:</label>
      <input type="text" name="Phone" value={camperData.Phone} onChange={(e) => handleCamperChange(e, e.target)} required />

      <label>Identification:</label>
      <input type="text" name="identification" value={camperData.identification} onChange={(e) => handleCamperChange(e, e.target)} required />

      <label>Location:</label>
      <input type="text" name="Location" value={camperData.Location} onChange={(e) => handleCamperChange(e, e.target)} required />

      <label>Salary:</label>
      <input type="number" name="Salary" value={camperData.Salary} onChange={(e) => handleCamperChange(e, e.target)} required />

      <label>Biography:</label>
      <textarea name="Biography" value={camperData.Biography} onChange={(e) => handleCamperChange(e, e.target)} required />

      <label>Stacks:</label>
      <input type="text" name="Stacks" value={camperData.Stacks} onChange={(e) => handleCamperChange(e, e.target)} required />


      <Form.Field>
          <label>Gender:</label>
          <Select
            name="Gender"
            value={camperData.Gender}
            options={genderOptions}
            onChange={handleCamperChange}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>English Level:</label>
          <Select
            name="EnglishLevel"
            value={camperData.EnglishLevel}
            options={englishLevelOptions}
            onChange={handleCamperChange}
            required
          />
        </Form.Field>

      <Form.Field>
          <label>Document Type:</label>
          <Select
            name="DocumentType"
            value={camperData.DocumentType}
            options={documentTypeOptions}
            onChange={handleCamperChange}
            required
          />
        </Form.Field>

      <label>Skills:</label>
      <Select
        name="Skills"
        placeholder="Select Skills"
        value={camperData.Skills}
        options={skillsOptions.map((option) => ({ key: option.key, text: option.text, value: option.value }))}
        onChange={handleCamperChange}
        multiple
    />


        <label>CV (PDF):</label>
        <input type="file" name="pdf" accept=".pdf" onChange={handleCvChange} />

        <label>Video Camper:</label>
        <input type="text" name="VideoCamper" value={camperData.VideoCamper} onChange={(e) => handleCamperChange(e, e.target)} />

        <label>Github:</label>
        <input type="text" name="SocialMedia.Github" value={camperData.SocialMedia.Github} onChange={handleCamperChange} />

        <label>LinkedIn:</label>
        <input type="text" name="SocialMedia.LinkedIn" value={camperData.SocialMedia.LinkedIn} onChange={handleCamperChange} />

        <label>Presentation Video:</label>
        <input type="text" name="SocialMedia.DriveVideo" value={camperData.SocialMedia.DriveVideo} onChange={handleCamperChange} />
        <button type="submit">Post Camper</button>
      </form>
    </div>
  );
};

export default PostCamper;