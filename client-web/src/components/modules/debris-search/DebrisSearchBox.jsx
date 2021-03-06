import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { withTranslation } from 'react-i18next';

import { debrisServices } from 'Services/domain/ccp';
import { AddressInput } from 'Components/common';

class DebrisSearchBox extends PureComponent {
  constructor(props) {
    super(props);

    let criteria = {};
    if (props.criteria) {
      criteria = {
        ...props.criteria,
      };
    }

    this.state = {
      criteria,
      typeOptions: [],
    };
  }

  _loadData = async () => {
    const types = await debrisServices.getDebrisServiceTypes();
    const typeOptions = types.map(type => ({ label: type.name, value: type.id }));
    this.setState({
      typeOptions,
    });
  };

  componentDidMount() {
    this._loadData();
  }

  _search = e => {
    e.preventDefault();
    const { onSearch } = this.props;

    onSearch && onSearch(this.state.criteria);
  };

  _handleChangeCriteria = e => {
    const { name, value } = e.target;
    let { criteria } = this.state;
    criteria = {
      ...criteria,
      [name]: value,
    };

    this.setState({
      criteria,
    });
  };

  _handleSelectServiceTypes = selectedOptions => {
    const debrisTypeId = selectedOptions.map(option => option.value);
    const { criteria } = this.state;

    this.setState({
      criteria: {
        ...criteria,
        debrisTypeId,
      },
    });
  };

  /**
   * Handle user change location
   */
  _handleChangeLocation = location => {
    const { latitude, longitude, address } = location;
    const { criteria } = this.state;

    this.setState({
      criteria: {
        ...criteria,
        latitude,
        longitude,
        address,
      },
    });
  };

  render() {
    const { typeOptions, criteria } = this.state;
    const { isFetching, t } = this.props;

    return (
      <form onSubmit={this._search}>
        <div className="row">
          <div className="col-md-12 text-light">
            <h3>{t('debris.search')}</h3>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="keyword" className="text-light">
                {t('common.keyword')}:
              </label>
              <input
                type="text"
                name="q"
                id="keyword"
                className="form-control"
                value={criteria.q}
                onChange={this._handleChangeCriteria}
                placeholder={t('debris.keywordPlacholder')}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="location" className="text-light">
                {t('debris.searchAddress')}:
              </label>
              <AddressInput onSelect={this._handleChangeLocation} inputProps={{ id: 'location' }} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="service_types" className="text-light">
                {t('debris.type')}:
              </label>
              <Select
                isMulti
                openMenuOnFocus
                isSearchable={false}
                closeMenuOnSelect={false}
                tabSelectsValue={false}
                inputId="service_types"
                placeholder={t('debris.typePlaceholder')}
                options={typeOptions}
                onChange={this._handleSelectServiceTypes}
                value={
                  !typeOptions || !criteria.debrisTypeId
                    ? []
                    : typeOptions.filter(option => criteria.debrisTypeId.includes(option.value))
                }
              />
            </div>
          </div>
          <div className="col-md-12">
            <button type="submit" className="btn btn-success" disabled={isFetching}>
              {isFetching && (
                <span
                  className="spinner-border spinner-border-sm mr-1"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {t('common.search')}
            </button>
          </div>
        </div>
      </form>
    );
  }
}

DebrisSearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default withTranslation()(DebrisSearchBox);
