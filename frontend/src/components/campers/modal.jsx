import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CamperModal = ({ show, onHide, camper }) => {
  if (!camper) {
    return null;
  }

  const downloadPdf = () => {
    if (Array.isArray(camper.CV) && camper.CV.length > 0 && camper.CV[0].Pdf) {
      const pdfData = atob(camper.CV[0].Pdf);

      const pdfBlob = new Blob([new Uint8Array(pdfData.split('').map((char) => char.charCodeAt(0)))], {
        type: 'application/pdf',
      });

      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = camper.CV[0].Name || 'document.pdf';
      downloadLink.click();
    }
  };
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

        {camper.CV && Array.isArray(camper.CV) && camper.CV.length > 0 && camper.CV[0].Pdf && (
          <div>
            <p>CV: {camper.CV[0].Name}</p>
            <Button variant="primary" onClick={downloadPdf}>
              Download CV
            </Button>
          </div>
        )}
      </Modal.Body>
      
    </Modal>
  );
};

export default CamperModal;
