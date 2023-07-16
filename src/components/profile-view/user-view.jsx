import React from 'react';
import { Row, Col, CardGroup } from 'react-bootstrap';


export const UserView = ({ user }) => {
    return (
        <Row>
          <CardGroup></CardGroup>
          <Col md={12}>
          <div >
            <span>Username: </span>
            <span className='fw-bolder'>{user.Username}</span>
          </div>
          <div >
            <span>Email: </span>
            <span className='fw-bolder'>{user.Email}</span>
          </div>
          <div >
            <span>Birthday: </span>
            <span className='fw-bolder'>{user.Birthday}</span>
          </div>
          </Col>
        </Row>
    );
};