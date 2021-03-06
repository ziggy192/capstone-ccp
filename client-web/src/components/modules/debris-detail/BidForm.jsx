import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Collapse, Alert } from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { authActions } from '../../../redux/actions';
import { formatPrice } from 'Utils/format.utils';
import { debrisBidServices } from 'Services/domain/ccp';
import { getErrorMessage, getRoutePath } from 'Utils/common.utils';
import { ComponentBlocking } from 'Components/common';
import { CONTRACTOR_STATUSES, routeConsts } from 'Common/consts';

class BidForm extends Component {
  constructor(props) {
    super(props);

    const { debrisId } = props;
    this.bidData = {
      debrisPost: {
        id: debrisId,
      },
    };
  }

  state = {
    isShowBidForm: false,
    validateResult: {},
  };

  /**
   * Show hide bid form
   */
  _toggleBidForm = () => {
    const { isShowBidForm } = this.state;
    this.setState({
      isShowBidForm: !isShowBidForm,
    });
  };

  /**
   * Update field value to bidData variable
   */
  _handleFieldChange = e => {
    let { name, value } = e.target;

    value = value.trim();

    this.bidData[name] = value;
  };

  /**
   * Validate bidData
   */
  _validateForm = () => {
    const { price, description } = this.bidData;
    const validateResult = {
      isValid: true,
    };

    if (!price || isNaN(price) || price < 1) {
      validateResult.isValid = false;
      validateResult.price = 'Please enter a valid price!';
    }

    const descriptionMinLength = 25;
    if (!description || description.length < descriptionMinLength) {
      validateResult.isValid = false;
      validateResult.description = `Please enter a description with at least ${descriptionMinLength}`;
    }

    return validateResult;
  };

  /**
   * Post a debris bid
   */
  _handleSubmitBid = async e => {
    e.preventDefault();

    // Validate form
    const validateResult = this._validateForm();

    // Form invalid
    if (!validateResult.isValid) {
      this.setState({
        validateResult,
      });

      return;
    }

    // Post bid
    this.setState({
      validateResult,
      isFetching: true,
    });
    try {
      const bid = await debrisBidServices.postDebrisBid(this.bidData);
      this.bidData = {
        debrisPost: this.bidData.debrisPost,
      };
      this.setState(
        {
          isFetching: false,
          isShowBidForm: false,
        },
        () => {
          const { onSuccess, contractor } = this.props;

          onSuccess &&
            onSuccess({
              ...bid,
              supplier: contractor,
            });
        }
      );
    } catch (error) {
      const message = getErrorMessage(error);
      this.setState({
        message,
        isFetching: false,
      });
    }
  };

  /**
   * Clear message to hide alert
   */
  _clearMessage = () => {
    this.setState({
      message: null,
    });
  };

  render() {
    const { isShowBidForm, message, isFetching, validateResult } = this.state;
    const { contractor, toggleLoginModal } = this.props;

    return (
      <div className="position-relative">
        {isFetching && <ComponentBlocking />}
        {contractor && contractor.status === CONTRACTOR_STATUSES.ACTIVATED && !isShowBidForm && (
          <button onClick={this._toggleBidForm} className="btn btn-lg btn-primary btn-block my-2">
            <i className="fal fa-gavel" /> Bid this request
          </button>
        )}
        {contractor && isShowBidForm && (
          <button
            onClick={this._toggleBidForm}
            className="btn btn-lg btn-outline-primary btn-block my-2"
          >
            <i className="fal fa-times" /> Close bid form
          </button>
        )}
        {contractor && (
          <Collapse isOpen={isShowBidForm}>
            {isShowBidForm && (
              <form className="bg-white p-3 shadow-sm" onSubmit={this._handleSubmitBid}>
                <h5 className="text-center">Bid this request</h5>
                <Alert color="danger" isOpen={!!message} toggle={this._clearMessage}>
                  {message}
                </Alert>
                <div className="form-group">
                  <label htmlFor="bid_price">
                    Price (K): <i className="text-danger">*</i>
                  </label>
                  <input
                    type="number"
                    name="price"
                    className={classnames('form-control', { 'is-invalid': validateResult.price })}
                    min="1"
                    id="bid_price"
                    onChange={this._handleFieldChange}
                  />
                  <div className="invalid-feedback">{validateResult.price}</div>
                </div>
                <div className="form-group">
                  <label htmlFor="bid_description">
                    Description: <i className="text-danger">*</i>
                  </label>
                  <textarea
                    name="description"
                    className={classnames('form-control', {
                      'is-invalid': validateResult.description,
                    })}
                    id="bid_description"
                    cols="30"
                    rows="3"
                    onChange={this._handleFieldChange}
                  />
                  <div className="invalid-feedback">{validateResult.description}</div>
                </div>
                <div className="form-group text-center">
                  <button type="submit" className="btn btn-lg btn-primary">
                    <i className="fal fa-gavel" /> Bid
                  </button>
                </div>
              </form>
            )}
          </Collapse>
        )}
        {!contractor && (
          <button className="btn btn-lg btn-primary btn-block my-2" onClick={toggleLoginModal}>
            <i className="fal fa-sign-in" /> Login to bid
          </button>
        )}
        {contractor && contractor.status === CONTRACTOR_STATUSES.NOT_VERIFIED && (
          <Link
            to={getRoutePath(routeConsts.PROFILE)}
            className="btn btn-lg btn-primary btn-block my-2"
          >
            Post images to verify
          </Link>
        )}
      </div>
    );
  }
}

BidForm.props = {
  debrisId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func,
  toggleLoginModal: PropTypes.func,
  contractor: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor } = authentication;

  return {
    contractor,
  };
};

const mapDispatchToProps = {
  toggleLoginModal: authActions.toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BidForm);
