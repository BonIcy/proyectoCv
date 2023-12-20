import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
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
    <Modal show={show} onHide={onHide} className='ModalCamer' size="lg">
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body className='content'>
        <div className='img' style={{background: camper.Gender === "Male"
                ? "url('https://i.ibb.co/kSswHKV/background-Camper-M.png') top/contain"
                : camper.Gender === "Female"
                  ? "url('https://i.ibb.co/k6rDx3Z/background-Camper-F.png') top/contain"
                  : "url('https://i.ibb.co/1TQDQzd/background-Camper-B.png') top/contain"}}>
          <img src={camper.Gender === "Male" ?  'https://i.ibb.co/rHfYYfJ/camper-Logo-removebg-preview.png': camper.Gender === "Female" ?  'https://i.ibb.co/bs4H7hs/camper-WLogo-removebg-preview.png':'https://i.ibb.co/nQdGyJF/camper-BLogo-removebg-preview.png'} alt='Camper'/>
        </div>
        <h4 className='nameCamper'>{`${camper.Name} ${camper.LastName}`}</h4>
        <h6 className='location' 
        style={{ color: camper.Gender === "Male"
          ? "#3A539B"
          : camper.Gender === "Female"
            ? "#9B3A69"
            : "#797979"}}>Star Programmer</h6>
        <div className="video-container">
          <iframe width="320" height="300" 
          src={camper.SocialMedia.DriveVideo} 
          title="YouTube video player" frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          ></iframe>
        </div>
        <div>
          <p className="details"><span className="property" style={{ color: camper.Gender === "Male"
              ? "#3A539B"
              : camper.Gender === "Female"
                ? "#9B3A69"
                : "#797979"}}>Phone:</span> <br></br> {camper.Phone}</p>
          <p className="details"><span className="property" style={{ color: camper.Gender === "Male"
              ? "#3A539B"
              : camper.Gender === "Female"
                ? "#9B3A69"
                : "#797979"}}>Email:</span> <br></br> {camper.Email}</p>
          <p className="details"><span className="property" style={{ color: camper.Gender === "Male"
              ? "#3A539B"
              : camper.Gender === "Female"
                ? "#9B3A69"
                : "#797979"}}>Location:</span> <br></br> {camper.Location}</p>
          <p className="details"><span className="property" style={{ color: camper.Gender === "Male"
              ? "#3A539B"
              : camper.Gender === "Female"
                ? "#9B3A69"
                : "#797979"}}>Salary:</span> <br></br> {camper.Salary}</p>
          <p className="details"><span className="property" style={{ color: camper.Gender === "Male"
              ? "#3A539B"
              : camper.Gender === "Female"
                ? "#9B3A69"
                : "#797979"}}>English Level:</span> <br></br> {camper.EnglishLevel}</p>
          <p className="details"><span className="property" style={{ color: camper.Gender === "Male"
              ? "#3A539B"
              : camper.Gender === "Female"
                ? "#9B3A69"
                : "#797979"}}>Gender:</span> <br></br> {camper.Gender}</p>
          <p className="details"><span className="property" style={{ color: camper.Gender === "Male"
              ? "#3A539B"
              : camper.Gender === "Female"
                ? "#9B3A69"
                : "#797979"}}>Biography:</span> <br></br> {camper.Biography}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>                
            <div>
            <h6 className='location' 
            style={{ color: camper.Gender === "Male"
              ? "#3A539B"
              : camper.Gender === "Female"
                ? "#9B3A69"
                : "#797979"}}>Skills</h6>
              <ul class="">
                { camper.Skills.map((skill, index) => (
                  <li className="details" key={index}> {skill}</li>
                ))}
              </ul>
            </div>  
            <div>
            <h6 className='location' 
            style={{ color: camper.Gender === "Male"
              ? "#3A539B"
              : camper.Gender === "Female"
                ? "#9B3A69"
                : "#797979"}}>Stacks</h6>
              <ul class="">
                  { camper.Stacks.map((Stacks, index) => (
                    <li className="details" key={index}> {Stacks}</li>
                  ))}
              </ul>
            </div>      
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>                
          {camper.SocialMedia.Github && (
            <a
              href={camper.SocialMedia.Github}
              target="_blank" 
              rel="noopener noreferrer"
            >
              <GitHubIcon sx={{ width: 56, height: 56, color: camper.Gender === "Male"
              ? "#3A539B"
              : camper.Gender === "Female"
              ? "#9B3A69"
              : "#797979" }} />
            </a>
          )}
          {camper.CV && Array.isArray(camper.CV) && camper.CV.length > 0 && camper.CV[0].Pdf && (
            <div>
              <p>CV: {camper.CV[0].Name}</p>
              <Button variant="primary" onClick={downloadPdf}>
                Download CV
              </Button>
            </div>
          )}
          {camper.SocialMedia.LinkedIn && (
            <a
              href={camper.SocialMedia.LinkedIn}
              target="_blank" 
              rel="noopener noreferrer"
          >
            <LinkedInIcon sx={{ width: 56, height: 56, color: camper.Gender === "Male"
              ? "#3A539B"
              : camper.Gender === "Female"
              ? "#9B3A69"
              : "#797979" }} />
          </a>
          )}
        </div>
      </Modal.Body>
      
    </Modal>
  );
};

export default CamperModal;
