import React from 'react';
import {Container,Row, Col} from 'reactstrap';
import Nav from './Nav';




function SignInScreen() {
  return (
    <div className='globalStyle'>
          <Nav />
          
          <Container className='shopPage'>
            <Col xs='12' lg='6' >
              <p>hello</p>
            </Col>
          </Container>
    </div>  

  );
}

export default SignInScreen; 