import React from 'react';
import {Container,Row} from 'reactstrap';
import {connect} from 'react-redux';




function AppointmentScreen(props) {
  console.log(props.appointmentChoice)
  return (
    <div>
        <p>AppointmentScreen</p>
    </div>
  );
}

function mapStateToProps(state){
  return {appointmentChoice: state.appointmentChoice}
}

export default connect(
  mapStateToProps,
  null,
)(AppointmentScreen);

