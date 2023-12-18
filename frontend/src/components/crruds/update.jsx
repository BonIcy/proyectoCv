import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, Link, useLocation } from "react-router-dom";
import { Button, Form, TextArea, Select } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const Update = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({});
  const [formInit, setFormInit] = useState(false);
  const id = localStorage.getItem("dataID");
  const location = useLocation();
  const { data, collectionName } = location.state || {};
  const dataFromGet = location.state.data ? JSON.parse(location.state.data) : {};

  useEffect(() => {
    if (!formInit) {
      setFormData(dataFromGet);
      setFormInit(true);
    }
  }, [formInit, dataFromGet]);

  const inputChangee = (event, { name, value }) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateData = () => {
    let url;

    switch (collectionName) {
      case "Document_Type":
        url = `http://localhost:6929/cvs/upd/Document_Type/${id}`;
        break;
      case "Gender":
        url = `http://localhost:6929/cvs/upd/Gender/${id}`;
        break;
      case "English_Levels":
        url = `http://localhost:6929/cvs/upd/English_Levels/${id}`;
        break;
      case "Skills":
        url = `http://localhost:6929/cvs/upd/Skills/${id}`;
        break;
      default:
        console.error("Invalid collectionName");
        return;
    }

    axios
      .put(url, formData)
      .then(() => {
        history.push("/administration");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className="button-container">
        <Link to="/administration">
          <Button className="shadow2__btn">Back to administration</Button>
        </Link>
      </div>
      <div className="center-content">
        <div className="login-box">
          <Form className="create-form">
            {Object.keys(formData).map((fieldName) => (
              fieldName !== "_id" && (
                <Form.Field key={fieldName}>
                  <label style={{ color: "white" }}>{fieldName}</label>
                  {fieldName === "E_Description" || fieldName === "S_Description" ? (
                    <TextArea
                      className="input-field"
                      placeholder={fieldName}
                      name={fieldName}
                      value={formData[fieldName] || ""}
                      onChange={inputChangee}
                    />
                  ) : (
                    <Form.Input
                      className="input-field"
                      placeholder={fieldName}
                      name={fieldName}
                      value={formData[fieldName] || ""}
                      onChange={inputChangee}
                    />
                  )}
                </Form.Field>
              )
            ))}
            <center>
              <Button className="uwu" type="submit" onClick={updateData}>
                Actualizar
              </Button>
            </center>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Update;
