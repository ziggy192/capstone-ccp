import React, { Component } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../../redux/actions';

import LoginModal from '../modules/login/LoginModal';

class Header extends Component {
  constructor(props) {
    super(props);

    this.menus = [
      {
        to: '/',
        name: 'Home',
        exact: true,
        requiredAuth: true
      },
      {
        to: '/dashboard/supplier',
        name: 'Supplier',
        requiredAuth: true
      },
      {
        to: '/dashboard/requester',
        name: 'Requester',
        requiredAuth: true
      }
    ];

    this.state = {
      showOffCanvas: false,
      isShowLoginModal: false
    };
  }

  _toggleOffCanvas = () => {
    const { showOffCanvas } = this.state;

    this.setState({
      showOffCanvas: !showOffCanvas
    });
  };

  _closeOffCanvas = () => {
    this.setState({
      showOffCanvas: false
    });
  };

  _isMenuActive = (menu) => {
    const { location } = this.props;

    if (menu.exact) {
      return location.pathname === menu.to;
    }

    return location.pathname.indexOf(menu.to) === 0;
  };

  _logout = () => {
    const { logout } = this.props;

    logout();
  };

  _toggleLoginModal = () => {
    const { location } = this.props;

    // Don't show login modal when user on login page
    if (location.pathname === '/login') {
      return;
    }

    this.setState({
      isShowLoginModal: !this.state.isShowLoginModal
    });
  };

  render() {
    const { showOffCanvas, isShowLoginModal } = this.state;
    const { user } = this.props;

    return (
      <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand py-0 text-uppercase font-weight-bold text-monospace" to="/">
            <img src="/public/assets/images/logo.png" width="40" height="40" className="d-inline-block align-top mr-1" alt="" />
            Constuction Sharing
          </Link>
          <button className="navbar-toggler" type="button" onClick={this._toggleOffCanvas}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`navbar-collapse offcanvas-collapse ${showOffCanvas ? 'open' : ''}`} id="navbarTogglerDemo03">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              {this.menus.map(menu => {
                
                if (menu.requiredAuth && !user.isAuthenticated) {
                  return null;
                }

                return (
                  <li key={menu.name} className={`nav-item ${this._isMenuActive(menu) ? 'active' : ''}`}>
                    <Link className="nav-link" to={menu.to} onClick={this._closeOffCanvas}>{menu.name}</Link>
                  </li>
                );
              })}
            </ul>
            {user.isAuthenticated &&
              <span className="dropdown">
                <a className="dropdown-toggle text-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                  <img src={user.user.contractor.thumbnailImage} className="rounded-circle mr-2" width={40} height={40} />
                  {user.user.contractor.name}
                </a>
                <div className="dropdown-menu shadow mt-2 rounded-top-0">
                  <a className="dropdown-item" href="#"><i className="fa fa-user-circle"></i> Profile</a>
                  <a className="dropdown-item" href="#"><i className="fa fa-cogs"></i> Settings</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#" onClick={this._logout}><i className="fa fa-sign-out"></i> Logout</a>
                </div>
              </span>
            }
            {!user.isAuthenticated &&
              <span>
                <button className="btn btn-outline-primary my-2 my-sm-0 mx-2" onClick={this._toggleLoginModal}>Login</button>
                <Link to="/signup"><button className="btn btn-success my-2 my-sm-0 mx-2" type="submit">Sign Up</button></Link>
              </span>
            }
          </div>
        </div>
        {!user.isAuthenticated &&
          <LoginModal isOpen={isShowLoginModal} onClose={this._toggleLoginModal} />
        }
      </nav>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state;

  return {
    user
  };
};

const mapDispatchToProps = {
  logout: userActions.logout
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
