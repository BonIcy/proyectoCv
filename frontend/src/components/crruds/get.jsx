import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Button, Select } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function Get() {
    const [APIData, setAPIData] = useState([]);
    const [collectionName, setCollectionName] = useState('Gender');
    const [forceUpdate, setForceUpdate] = useState(false);

    useEffect(() => {
        fetchData();
    }, [collectionName, forceUpdate]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:6929/cvs/${collectionName}`);
            setAPIData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const onDelete = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');
        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:6929/cvs/del/${collectionName}/${id}`);
                setForceUpdate(prevState => !prevState);
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        }
    };

    const renderCardData = () => {
        if (APIData.length === 0) {
            return <div>There are no available data</div>;
        }

        return APIData.map((data) => (
            <Card key={data._id}>
                <Card.Content>
                    <Card.Header>{data.Name || data.E_Name || data.S_Name}</Card.Header>
                    <Card.Meta>ID: {data._id}</Card.Meta>
                    <Card.Description>
                        {data.Abbreviation && (
                            <>
                                <strong>Abbreviation:</strong> {data.Abbreviation}
                                <br />
                            </>
                        )}
                        {data.E_Description && (
                            <>
                                <strong>Description:</strong> {data.E_Description}
                                <br />
                            </>
                        )}
                        {data.S_Description && (
                            <>
                                <strong>Description:</strong> {data.S_Description}
                                <br />
                            </>
                        )}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className="ui two buttons">
                        <Link
                            to={{
                                pathname: '/update',
                                state: { data: JSON.stringify(data), collectionName: collectionName },
                            }}
                            onClick={() => localStorage.setItem('dataID', data._id)}
                        >
                            <Button basic color="green">
                                Update
                            </Button>
                        </Link>
                        <Button basic color="red" onClick={() => onDelete(data._id)}>
                            Delete
                        </Button>
                    </div>
                </Card.Content>
            </Card>
        ));
    };

    const collectionChange = (event, data) => {
        setCollectionName(data.value);
    };

    const collectionOptions = [
        { key: 'gender', text: 'Gender', value: 'Gender' },
        { key: 'english_Levelvs', text: 'English Levels', value: 'English_Levels' },
        { key: 'skills', text: 'Skills', value: 'Skills' },
        { key: 'document_Type', text: 'Document Type', value: 'Document_Type' },
    ];

    return (
        <div>
            <div className="center-content">
                <h2 className='Ttitul'>{collectionName}</h2>
                <Select
                    placeholder="Select Collection"
                    options={collectionOptions}
                    onChange={collectionChange}
                />
                <div className="button-container">
                    <Link to="/postData">
                        <Button className="post-button">Post Data</Button>
                    </Link>
                </div>
                <Card.Group>
                    {renderCardData()}
                </Card.Group>
            </div>
        </div>
    );
}
