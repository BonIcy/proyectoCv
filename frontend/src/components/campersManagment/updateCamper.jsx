import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link, useLocation,useParams } from "react-router-dom";
import { Button, Form, Select } from 'semantic-ui-react';

const UpdateCamper = () => {
  const { id } = useParams();
  const history = useHistory();

  const [campers, setCampers] = useState([]);
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

  const [genderOptions, setGenderOptions] = useState([]);
  const [englishLevelOptions, setEnglishLevelOptions] = useState([]);
  const [DocumentTypeOptions, setDocumentTypeOptions] = useState([]);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    fetchCollectionOptions('Gender', setGenderOptions);
    fetchCollectionOptions('English_Levels', setEnglishLevelOptions);
    fetchCollectionOptions('Document_Type', setDocumentTypeOptions);
    fetchCollectionOptions('Skills', setSkillsOptions);

    loadCampers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [campers]);

  const loadCampers = async () => {
    try {
      const response = await axios.get('http://localhost:6929/cvs/Info/Campers');
      setCampers(response.data);
    } catch (error) {
      console.error('Error loading campers:', error);
    }
  };

const fetchData = () => {
  try {
    const foundCamper = campers.find((camper) => camper._id == id);
    if (foundCamper) {
      setCamperData({
        ...foundCamper,
        pdf: foundCamper?.CV?.Pdf || null,
        Github: foundCamper?.SocialMedia?.Github || '',
        LinkedIn: foundCamper?.SocialMedia?.LinkedIn || '',
        PresentationVideo: foundCamper?.SocialMedia?.DriveVideo || '',
        Gender: foundCamper?.Gender || '',
        TypeDocument: foundCamper?.TypeDocument || '',
      })
    } else {
      console.log(`The data from Camper with ID ${id} is loading...`);
    }
  } catch (error) {
    console.error(`Error fetching camper data for ID ${id}:`, error);
  }
};

  const fetchCollectionOptions = async (collectionName, setOptions) => {
    try {
      const response = await axios.get(`http://localhost:6929/cvs/${collectionName}`);
      let options = [];

      if (collectionName === 'Gender' || collectionName == 'Document_Type') {
        options = response.data.map((option) => ({ key: option._id, text: option.Name, value: option.Name }));
      } else if (collectionName === 'Skills') {
        options = response.data.map((option) => ({ key: option.S_Name, text: option.S_Name, value: option.S_Name }));
      } else {
        options = response.data.map((option) => ({ key: option._id, text: option.E_Name || option.S_Name, value: option.E_Name || option.S_Name }));
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
    const file = e.target.files[0];
    setPdfData(file);
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      if (pdfData !== null) {
        formData.append("pdf", pdfData);
      }
  
      const validProperties = ['pdf', 'Name', 'LastName', 'Email', 'Phone', 'identification', 'Location', 'Salary', 'EnglishLevel', 'Biography', 'Skills', 'Stacks', 'Gender', 'TypeDocument', 'Github', 'LinkedIn', 'PresentationVideo'];
  
      Object.entries(camperData).forEach(([key, value]) => {
        if (validProperties.includes(key)) {
          if (key === 'SocialMedia') {
            Object.entries(value).forEach(([socialKey, socialValue]) => {
              formData.append(`Social_Network.${socialKey}`, socialValue);
            });
          } else if (key === 'Skills') {
            value.forEach((skill) => {
              formData.append('Skills', skill._id);
            });
          } else if (key === 'Stacks') {
            value.forEach((stack) => {
              formData.append('Stacks', stack);
            });
          } else {
            formData.append(key, value);
          }
        }
      });
  
      const response = await axios.put(`http://localhost:6929/cvs/newCamper/upd/${id}`, formData);
      history.push('/managmentCampers');
    } catch (error) {
      console.error('Error updating camper:', error.response);
    }
  };
  return (
    <div>
      <h2>Update Camper</h2>
      <div className="button-container">
        <Link to="/managmentCampers">
          <Button className="shadow2__btn">Back to Camper Administration</Button>
        </Link>
      </div>
      <form onSubmit={submitUpdate}>
        <div>
          <label>Name:</label>
          <input type="text" name="Name" value={camperData.Name} onChange={(e) => camperChange(e, e.target)} required />
        </div>

        <div>
          <label>Last Name:</label>
          <input type="text" name="LastName" value={camperData.LastName} onChange={(e) => camperChange(e, e.target)} required />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="Email" value={camperData.Email} onChange={(e) => camperChange(e, e.target)} required />
        </div>

        <div>
          <label>Phone:</label>
          <input type="text" name="Phone" value={camperData.Phone} onChange={(e) => camperChange(e, e.target)} required />
        </div>

        <div>
          <label>Identification:</label>
          <input type="text" name="identification" value={camperData.identification} onChange={(e) => camperChange(e, e.target)} required />
        </div>

        <div>
          <label>Location:</label>
          <input type="text" name="Location" value={camperData.Location} onChange={(e) => camperChange(e, e.target)} required />
        </div>

        <div>
          <label>Salary:</label>
          <input type="number" name="Salary" value={camperData.Salary} onChange={(e) => camperChange(e, e.target)} required />
        </div>

        <div>
          <label>Biography:</label>
          <textarea name="Biography" value={camperData.Biography} onChange={(e) => camperChange(e, e.target)} required />
        </div>

        <div>
          <label>Stacks:</label>
          <textarea
            name="Stacks"
            value={camperData.Stacks.join('\n')} 
            onChange={(e) => camperChange(e, e.target)}
            required
          />
        </div>

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
            name="DocumentType"
            value={camperData.DocumentType}
            options={DocumentTypeOptions}
            onChange={camperChange}
            required
          />
        </Form.Field>

        <div>
          <label>Skills:</label>
          <Select
            name="Skills"
            placeholder="Select Skills"
            value={camperData.Skills}
            options={skillsOptions}
            onChange={camperChange}
            multiple
          />
        </div>

        <div>
          <label>Cv (PDF):</label>
          <input type="file" name="pdf" accept=".pdf" onChange={pdfChange} />
          {camperData.pdf && (
            <a href={`data:application/pdf;base64,${camperData.pdf}`} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          )}
        </div>

        <div>
          <label>Github:</label>
          <input type="text" name="Github" value={camperData.Github} onChange={camperChange} />
        </div>

        <div>
          <label>LinkedIn:</label>
          <input type="text" name="LinkedIn" value={camperData.LinkedIn} onChange={camperChange} />
        </div>

        <div>
          <label>Presentation Video:</label>
          <input type="text" name="PresentationVideo" value={camperData.PresentationVideo} onChange={camperChange} />
        </div>

        <button type="submit">Update Camper</button>
      </form>
    </div>
  );
};

export default UpdateCamper;
