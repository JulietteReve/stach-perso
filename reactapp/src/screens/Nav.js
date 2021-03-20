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
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText, 
  } from 'reactstrap';

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

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
              <Link to='/connexion'><NavLink>Se connecter</NavLink></Link>
            </NavItem>
            <NavItem>
              <Link to='/contact'><NavLink>Contactez-nous</NavLink></Link>
            </NavItem>
            <NavItem>
              <Link to='/profil'><NavLink>TEMPORAIRE</NavLink></Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
    
  );
}

export default Header;