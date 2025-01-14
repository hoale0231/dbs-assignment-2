import {Modal, Button, Form, Row, Col} from 'react-bootstrap'
import { useState, useEffect } from "react";
import "./ProductDescription.css"

var number = '^[0-9\b]+$';

export default function ProductDescription(props) {
  const {id, setproductDescription, deleteProduct, action} = props
  const [info, setInfo] = useState({ProdType: "Device"})
  const [prodType, setProdType] = useState('Device')

  useEffect(() => {
    if (action !== "Edit") {  
      return;
    } 
    fetch("/get/infoproduct?id="+id)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        response.text().then(text => { alert(text);})
      }
    })
    .then((data) => {setInfo(data); setProdType(data.ProdType)})
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })
  }, [id, action])
    
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    setValidated(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
      event.preventDefault();
    } else {
      var query = action === "Edit" ? "/edit/infoproduct" : "/add/product"
      const product = {}
      Object.keys(info).forEach( k => {if (info[k] !== "") product[k] = info[k];})
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(product)
      };
      fetch(query, requestOptions)
      .then(response => {
        if (response.ok) {
          setproductDescription(-1)
          window.location.reload(false);
        } else {
          response.text().then(text => { alert(text);})
        }
      }) 
    }
    event.stopPropagation();
    event.preventDefault();
  };

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    info[name] = value;
    if (name === "ProdType") setProdType(value)
  }

  return(
    <div className="popup-background">
      <Modal.Dialog className="popup" size="lg">
        <Modal.Header closeButton onClick={() => setproductDescription(-1)}>
          <Modal.Title>{action} Product</Modal.Title>
        </Modal.Header>

        <Modal.Body className="body-popup">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="ID" attrName="ID" md="4" disable={action === 'Edit'}/>
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="ProdName" attrName="Product Name" required={true} md="4"/>
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="manufacture" attrName="Brand" md="4"/>
            </Row>
            <Row className="mb-3">
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="PriceIn" attrName="Import Price" required={true} md="4" pattern={number}/>
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Price" attrName="Default Price" required={true} md="4" pattern={number}/>
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Insurance" attrName="Insurance" md="4" pattern={number}/>
            </Row>
            <Row className="mb-3">
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="1        " attrName="Quantity - Mộ Đức" required={true} md="4" pattern={number}/>
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="2        " attrName="Quantity - TP Quảng Ngãi" required={true} md="4" pattern={number}/>
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="3        " attrName="Quantity - Đức Phổ" md="4" required={true} pattern={number}/>
            </Row>
            <Row className="mb-3">
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="TotalQuantity" attrName="Total Quantity" md="4" disable={true} pattern={number}/>
              <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Other" attrName="Other" md="4"/>
              <Form.Group as={Col} md={4}>
                <Form.Label>Product Type</Form.Label>
                <Form.Select value={info.ProdType} name="ProdType" onChange={handleInputChange} disabled={action === 'Edit'}>
                  <option value="Device">Electronic device</option>
                  <option value="Accessory">Accessory</option>
                </Form.Select>
              </Form.Group>  
            </Row>
            {prodType === "Device" ? <Device info={info} handleInputChange={handleInputChange} action={action}/> : <Accessory info={info} handleInputChange={handleInputChange} action={action}/>}

            <Modal.Footer>
              <Button type="submit">Save Changes</Button>
              {action === "Edit" ? <Button variant="danger" onClick={() => {deleteProduct(id);}}>Delete Product</Button> : <p/>}
            </Modal.Footer>
          </Form>
        </Modal.Body>

      </Modal.Dialog>
    </div>
  )
}

function Device(props) {
  const {info, handleInputChange, action} = props
  const [deviceType, setDeviceType] = useState('Other')

  const handleDeviceTypeChange = function(event) {
    handleInputChange(event)
    const target = event.target;
    setDeviceType(target.value)
  }

  useEffect(() => setDeviceType(info.DeviceType), [info])

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
          <Form.Select defaultValue={deviceType} name="DeviceType" onChange={handleDeviceTypeChange} disabled={action === 'Edit'}>
            <option value="Laptop">Laptop</option>
            <option value="Phone">Phone</option>
            <option value="Tablet">Tablet</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>
      </Row>
      {deviceType === "Laptop" ? <Laptop info={info} handleInputChange={handleInputChange}/> : 
      deviceType === "Phone" ? <Phone info={info} handleInputChange={handleInputChange}/> : 
      deviceType === "Tablet" ? <Tablet info={info} handleInputChange={handleInputChange}/> : <div/>}
    </div>
  )
}

function Accessory(props) {
  const {info, handleInputChange, action} = props
  const [deviceType, setDeviceType] = useState('Other')

  const handleDeviceTypeChange = function(event) {
    handleInputChange(event)
    const target = event.target;
    setDeviceType(target.value)
  }

  useEffect(() => setDeviceType(info.AccsoryType), [info])

  return (
    <div>
      <Row className="mb-3">
        <InputGroupCustom info={info} handleInputChange={handleInputChange} attr="Connection" attrName="Connection" md="4"/>
        <Form.Group as={Col} md={4}>
          <Form.Label>Device</Form.Label>
          <Form.Select defaultValue={deviceType} name="AccsoryType" onChange={handleDeviceTypeChange} disabled={action === 'Edit'}>
            <option value="Mouse">Mouse</option>
            <option value="Headphone">HeadPhone</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>
      </Row>
      {deviceType === "Mouse" ? <Mouse info={info} handleInputChange={handleInputChange}/> : 
      deviceType === "Headphone" ? <HeadPhone info={info} handleInputChange={handleInputChange}/> : <div/>}
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
  const {info, attr, attrName, required, handleInputChange, md, disable, pattern} = props
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
        pattern={pattern}
      />
      <Form.Control.Feedback type="invalid">
        Invalid {attrName}
      </Form.Control.Feedback>
  </Form.Group>
  )
}