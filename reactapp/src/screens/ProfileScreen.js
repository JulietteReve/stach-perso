import React from 'react';
import {Container,Row} from 'reactstrap';
import {connect} from 'react-redux';




function ProfileScreen(props) {
  console.log('user', props.user)
  return (
    <div>
        <p>ProfileScreen</p>
    </div>
  );
}

function mapStateToProps(state){
  return {user: state.user}
}

export default connect(
  mapStateToProps,
  null,
)(ProfileScreen);

