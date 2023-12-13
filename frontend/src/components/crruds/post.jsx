import React, { useState, useEffect } from 'react';
import { Button, Form, Message, Select } from 'semantic-ui-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Post = () => {
  const [formData, setFormData] = useState({});
  const [collectionName, setCollectionName] = useState('Gender');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const inputChange = (event, data) => {
    setFormData({ ...formData, [data.name]: data.value });
  };

  const collectionChange = (event, data) => {
    setCollectionName(data.value);
  };

  const SumbitData = () => {
    axios
      .post(`http://localhost:6929/cvs/add/${collectionName}`, formData)
      .then((response) => {
        setSuccessMessage(response.data.message);
        setErrorMessage('');
        setFormData({}); 
        setIsSuccessVisible(true);

        setTimeout(() => {
          setIsSuccessVisible(false);
        }, 3000);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setSuccessMessage('');
      });
  };

  const collectionOptions = [
    { key: 'gender', text: 'Gender', value: 'Gender' },
    { key: 'english_Levelvs', text: 'English Levels', value: 'English_Levels' },
    { key: 'skills', text: 'Skills', value: 'Skills' },
    { key: 'document_Type', text: 'Document Type', value: 'Document_Type' },
  ];

  const renderForm = () => {
    switch (collectionName) {
      case 'Gender':
        return (
          <div>
            <h2 className='Ttitul'>Post Gender</h2>
            <Form success={!!successMessage} error={!!errorMessage}>
              <Form.Group widths='equal'>
                <Form.Input
                  fluid
                  label='Name'
                  name='Name'
                  placeholder='Name'
                  onChange={inputChange}
                />
                <Form.Input
                  fluid
                  label='Abbreviation'
                  name='Abbreviation'
                  placeholder='Abbreviation'
                  onChange={inputChange}
                />
              </Form.Group>
              <Message success content={successMessage} />
              <Message error content={errorMessage} />
            </Form>
          </div>
        );
      case 'Document_Type':
        return (
          <div>
            <h2 className='Ttitul'>Post Document Type</h2>
            <Form success={!!successMessage} error={!!errorMessage}>
              <Form.Group widths='equal'>
                <Form.Input
                  fluid
                  label='Name'
                  name='Name'
                  placeholder='Name'
                  onChange={inputChange}
                />
                <Form.Input
                  fluid
                  label='Abbreviation'
                  name='Abbreviation'
                  placeholder='Abbreviation'
                  onChange={inputChange}
                />
              </Form.Group>
              <Button onClick={SumbitData}>Submit</Button>
              <Message success content={successMessage} />
              <Message error content={errorMessage} />
            </Form>
          </div>
        );
        case 'English_Levels':
            return (
              <div>
                <h2 className='Ttitul'>Post English Levels</h2>
                <Form success={!!successMessage} error={!!errorMessage}>
                  <Form.Group widths='equal'>
                    <Form.Input
                      fluid
                      label='Name'
                      name='E_Name'
                      placeholder='Name'
                      onChange={inputChange}
                    />
                    <Form.TextArea
                      fluid
                      label='Description'
                      name='E_Description'
                      placeholder='Description'
                      onChange={inputChange}
                    />
                  </Form.Group>
                  <Message success content={successMessage} />
                  <Message error content={errorMessage} />
                </Form>
              </div>
            );
          case 'Skills':
            return (
              <div>
                <h2 className='Ttitul'>Post Skills</h2>
                <Form success={!!successMessage} error={!!errorMessage}>
                  <Form.Group widths='equal'>
                    <Form.Input
                      fluid
                      label='Name'
                      name='S_Name'
                      placeholder='Name'
                      onChange={inputChange}
                    />
                    <Form.TextArea
                      fluid
                      label='Description'
                      name='S_Description'
                      placeholder='Description'
                      onChange={inputChange}
                    />
                  </Form.Group>
                  <Message success content={successMessage} />
                  <Message error content={errorMessage} />
                </Form>
              </div>
            );
          default:
            return null;
        }
      };
      return (
        <div>
            <Link to="/administration">
                <Button>Back to Administration</Button>
             </Link>
          <h2 className='Ttitul'>Post Data</h2>
          <Select
            placeholder="Select Collection"
            options={collectionOptions}
            onChange={collectionChange}
          />
          {renderForm()}
    
          <Button onClick={SumbitData}>Submit</Button>
          {isSuccessVisible && (
            <Message success>
              <Message.Header>Success!</Message.Header>
              <p>{successMessage}</p>
            </Message>
          )}
    
        </div>
      );
    };
    
    export default Post;