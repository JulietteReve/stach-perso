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
    NavbarText
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
              <NavLink href="/">Nouvelle recherche</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/connexion">Se connecter</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/contact">Contactez-nous</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
    
  );
}

export default Header;