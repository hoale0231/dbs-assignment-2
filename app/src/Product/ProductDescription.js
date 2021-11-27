import {Modal, Button, Form, Row, Col} from 'react-bootstrap'
import { useState, useEffect } from "react";
import "./ProductDescription.css"

export default function ProductDescription(props) {
  const {id, setproductDescription, deleteProduct, action} = props
  const [info, setInfo] = useState({})

  useEffect(() => {
    fetch("/api/product/info?id="+id)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } 
      throw response
    })
    .then((data) => {console.log(data);setInfo(data)})
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })
  }, [id])
    
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      // query = ""
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(info)
      };
      fetch('/api/order_management/add', requestOptions) 
    }
  };

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    info[name] = value;
  }


  return(
    <div className="popup-background">
      <Modal.Dialog className="popup" size="lg">
        <Modal.Header closeButton onClick={() => setproductDescription({id:-1})}>
          <Modal.Title>{action}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="body-popup">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="ID" attrName="ID" required={true} md="4" disable={true}/>
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="ProdName" attrName="Product Name" required={true} md="8"/>
            </Row>
            <Row className="mb-3">
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="PriceIn" attrName="Import Price" required={true} md="4"/>
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Price" attrName="Default Price" required={true} md="4"/>
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Insurance" attrName="Insurance" md="4"/>
            </Row>
            <Row className="mb-3">
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="TotalQuantity" attrName="Total Quantity" md="4" disable={true}/>
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Other" attrName="Other" md="4"/>
              <Form.Group as={Col} md={4}>
                <Form.Label>Product Type</Form.Label>
                <Form.Select value={info.ProdType} name="ProdType" onChange={handleInputChange} disabled>
                  <option value="Device">Electronic device</option>
                  <option value="Accessory">Accessory</option>
                </Form.Select>
              </Form.Group>  
            </Row>
            {info.ProdType === "Device" ? <Device info={info} handleInputChange={handleInputChange}/> : <Accessory info={info} handleInputChange={handleInputChange}/>}
            <Form.Group className="mb-3" md="1">
                <Form.Check label="Available" defaultChecked={info.Available}/>
            </Form.Group>
            <Modal.Footer>
              <Button type="submit">Save Changes</Button>
              <Button variant="danger" onClick={() => {deleteProduct(id); setproductDescription({id: -1})}}>Delete Product</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>

      </Modal.Dialog>
    </div>
  )
}

function Device(props) {
  const {info, handleInputChange} = props
  return (
    <div>
      <Row className="mb-3">
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Battery" attrName="Battery" md="4"/>
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="RAM" attrName="RAM" md="4"/>
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Screen" attrName="Screen" md="4"/>
      </Row>
      <Row className="mb-3">
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="DateRelease" attrName="Date Release" md="4"/>
        <Form.Group as={Col} md={4}>
          <Form.Label>Device</Form.Label>
          <Form.Select defaultValue={info.DeviceType} name="DeviceType" onChange={handleInputChange} disabled>
            <option value="Laptop">Laptop</option>
            <option value="Phone">Phone</option>
            <option value="Tablet">Tablet</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>
      </Row>
      {info.DeviceType === "Laptop" ? <Laptop info={info} handleInputChange={handleInputChange}/> : 
      info.DeviceType === "Phone" ? <Phone info={info} handleInputChange={handleInputChange}/> : 
      info.DeviceType === "Tablet" ? <Tablet info={info} handleInputChange={handleInputChange}/> : <div/>}
    </div>
  )
}

function Accessory(props) {
  const {info, handleInputChange} = props
  return (
    <div>
      <Row className="mb-3">
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Connection" attrName="Connection" md="4"/>
        <Form.Group as={Col} md={4}>
          <Form.Label>Device</Form.Label>
          <Form.Select defaultValue={info.AccsoryType} name="AccsoryType" onChange={handleInputChange} disabled>
            <option value="Mouse">Mouse</option>
            <option value="HeadPhone">HeadPhone</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>
      </Row>
      {info.AccsoryType === "Mouse" ? <Mouse info={info} handleInputChange={handleInputChange}/> : 
      info.AccsoryType === "HeadPhone" ? <HeadPhone info={info} handleInputChange={handleInputChange}/> : <div/>}
    </div>
  )
}

function Laptop(props) {
  const {info, handleInputChange} = props
  return (
    <div>
      <Row className="mb-3">
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="CPU" attrName="CPU" md="4"/>
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="GPU" attrName="GPU" md="4"/>
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="HardDisk" attrName="HardDisk" md="4"/>
      </Row>
    </div>
  )
}

function Phone(props) {
  const {info, handleInputChange} = props
  return (
    <div>
      <Row className="mb-3">
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Chip" attrName="Chip" md="3"/>
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Camera" attrName="Camera" md="3"/>
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="InDisk" attrName="InDisk" md="3"/>
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="SIM" attrName="SIM" md="3"/>
      </Row>
    </div>
  )
}

function Tablet(props) {
  const {info, handleInputChange} = props
  return (
    <div>
      <Row className="mb-3">
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Chip" attrName="Chip" md="4"/>
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Camera" attrName="Camera" md="4"/>
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="InDisk" attrName="InDisk" md="4"/>
      </Row>
    </div>
  )
}

function Mouse(props) {
  const {info, handleInputChange} = props
  return (
    <div>
      <Row className="mb-3">
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="DPI" attrName="DPI" md="4"/>
      </Row>
    </div>
  )
}

function HeadPhone(props) {
  const {info, handleInputChange} = props
  return (
    <div>
      <Row className="mb-3">
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="HPhoneType" attrName="HPhoneType" md="4"/>
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Battery" attrName="Battery" md="4"/>
      </Row>
    </div>
  )
}

function InputGroupCustom(props) {
  const {info, attr, attrName, required, handleInputChange, md, disable} = props
  return (
    <Form.Group as={Col} md={md}>
      <Form.Label>{attrName}</Form.Label>
      <Form.Control
        required={required}
        disabled={disable}
        name={attr}
        type="text"
        defaultValue={info[attr]}
        onChange={handleInputChange}
      />
      <Form.Control.Feedback type="invalid">
        Invalid {attr}
      </Form.Control.Feedback>
  </Form.Group>
  )
}