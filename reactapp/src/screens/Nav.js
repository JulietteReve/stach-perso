import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import '../App.css';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink, 
  } from 'reactstrap';
import {connect} from 'react-redux';

function Header(props) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    console.log(props.user.email)

  if (props.user.email) {
    return (
    
      <div className='navBar'>
      <Navbar light expand="md" >
        <NavbarBrand href="/" className='titleNavBar' ><h2>'Stach</h2></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav  navbar className='navBarText'>
            <NavItem>
              <Link to='/'><NavLink>Nouvelle recherche</NavLink></Link>
            </NavItem>
            <NavItem>
              <Link to='/profil'><NavLink>Mes rendez-vous</NavLink></Link>
            </NavItem>
            <NavItem>
              <Link to='/deconnexion'><NavLink>Se déconnecter</NavLink></Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
    
  );
  } else {
    return(
    <div className='navBar'>
      <Navbar light expand="md" >
        <NavbarBrand href="/" className='titleNavBar' ><h2>'Stach</h2></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav  navbar className='navBarText'>
            <NavItem>
              <Link to='/'><NavLink>Nouvelle recherche</NavLink></Link>
            </NavItem>
            <NavItem>
              <Link to='/connexion'><NavLink>Se connecter</NavLink></Link>
            </NavItem>

          </Nav>
        </Collapse>
      </Navbar>
    </div>
    );
  }

  
}

function mapStateToProps(state){
  return {user: state.user}
}

export default connect(
  mapStateToProps,
  null,
)(Header);

