import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CamperModal = ({ show, onHide, camper }) => {
  if (!camper) {
    return null;
  }
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Camper Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Name: {`${camper.Name} ${camper.LastName}`}</p>
        <p>Email: {camper.Email}</p>
        <p>Phone: {camper.Phone}</p>
        <p>Location: {camper.Location}</p>
        <p>Salary: {camper.Salary}</p>
        <p>English Level: {camper.EnglishLevel}</p>
        <p>Gender: {camper.Gender}</p>
        <p>Biography: {camper.Biography}</p>

        {camper.SocialMedia && (
          <div>
            {camper.SocialMedia.LinkedIn && (
              <p>LinkedIn: {camper.SocialMedia.LinkedIn}</p>
            )}
            {camper.SocialMedia.Github && (
              <p>Github: {camper.SocialMedia.Github}</p>
            )}
            {camper.SocialMedia.DriveVideo && (
              <div>
                <p>Drive Video:</p>
                <Button variant="primary" href={camper.SocialMedia.DriveVideo} target="_blank" rel="noopener noreferrer">
                  Open Video
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CamperModal;
