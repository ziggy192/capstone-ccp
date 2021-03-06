import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';
import { connect } from 'react-redux';

import { Image, StarRatings, ReportModal } from 'Components/common';
import { userServices } from 'Services/domain/ccp';
import { getErrorMessage } from 'Utils/common.utils';
import { formatDate, formatFloat } from 'Utils/format.utils';
import EquipmentFeebacks from './equipment-feedbacks';
import MaterialFeebacks from './material-feedbacks';
import DebrisFeebacks from './debris-feedbacks';

import IconMaterials from 'Assets/icons/materials.svg';
import IconEquipments from 'Assets/icons/equipments.svg';
import IconDebris from 'Assets/icons/debris.svg';
import { CONTRACTOR_STATUS_INFOS } from 'Common/consts';

import 'Scss/profile.scss';

class ViewProfile extends PureComponent {
  constructor(props) {
    super(props);

    const { params } = this.props.match;
    const { id } = params;

    this.state = {
      constructorId: id,
      errorMessage: null,
      contractor: {},
      isFetching: true,
      activeFeedbackTab: 0,
      isShowReportModal: false,
    };
  }

  feedbackTabs = [
    {
      name: 'Equipment',
      component: EquipmentFeebacks,
    },
    {
      name: 'Material',
      component: MaterialFeebacks,
    },
    {
      name: 'Debris',
      component: DebrisFeebacks,
    },
  ];

  /**
   * Load contractor detail
   */
  _loadData = async () => {
    const { constructorId } = this.state;

    try {
      const contractor = await userServices.getUserInfoById(constructorId);

      this.setState({
        contractor,
        isFeching: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.setState({
        errorMessage,
        isFeching: false,
      });
    }
  };

  componentDidMount() {
    this._loadData();
  }

  componentDidUpdate(prevProps) {
    this._checkForUpdateContractor(prevProps);
  }

  /**
   * Check for update contractor to load new contractor information
   */
  _checkForUpdateContractor = prevProps => {
    const { params } = this.props.match;
    const { id } = params;

    const { params: prevParams } = prevProps.match;
    const { id: prevId } = prevParams;

    if (prevId !== id) {
      this.setState(
        {
          isFeching: true,
          constructorId: id,
        },
        () => {
          this._loadData();
        }
      );
    }
  };

  _renderContractorCard = () => {
    const { contractor } = this.state;
    const { contractor: loggedContractor } = this.props;

    const statusBsColor = contractor.status
      ? CONTRACTOR_STATUS_INFOS[contractor.status].bsColor
      : '';
    const statusName = contractor.status ? CONTRACTOR_STATUS_INFOS[contractor.status].name : '';

    return (
      <div className="bg-white py-3 px-2 shadow-sm sticky-sidebar position-sticky">
        <div className="text-center">
          <div className="position-relative">
            <Image
              width={200}
              height={200}
              className="rounded-circle"
              src={contractor.thumbnailImageUrl}
            />
            {loggedContractor.id !== contractor.id && (
              <button
                onClick={this._toggleReportModal}
                id="report_contractor"
                className="btn btn-sm btn-link position-absolute report-button text-muted"
              >
                <i className="fas fa-flag" />
                <UncontrolledTooltip target="report_contractor">
                  Report bad behavior
                </UncontrolledTooltip>
              </button>
            )}
          </div>
          <h5 className="mt-2">{contractor.name}</h5>
        </div>
        <div className="d-flex justify-content-between p-2">
          <span className="text-muted">Status:</span>
          <span className={`badge badge-pill pt-1 badge-${statusBsColor}`}>{statusName}</span>
        </div>
        <div className="d-flex justify-content-between p-2">
          <span className="text-muted">Phone:</span>
          <span>{contractor.phoneNumber}</span>
        </div>
        <div className="d-flex justify-content-between p-2">
          <span className="text-muted">Email:</span>
          <span className="ml-2 text-truncate">{contractor.email}</span>
        </div>
        <div className="d-flex justify-content-between p-2">
          <span className="text-muted">Joined:</span>
          <span>{formatDate(contractor.createdTime)}</span>
        </div>
      </div>
    );
  };

  _setActiveFeedbackTab = activeFeedbackTab => {
    if (activeFeedbackTab === this.state.activeFeedbackTab) {
      return;
    }

    this.setState({
      activeFeedbackTab,
    });
  };

  _renderFeedbacksCard = () => {
    const { activeFeedbackTab, contractor, constructorId } = this.state;

    let TabComponent = null;
    return (
      <div className="card shadow-sm">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            {this.feedbackTabs.map((tab, index) => {
              const isTabActive = index === activeFeedbackTab;
              if (isTabActive) {
                TabComponent = tab.component;
              }
              return (
                <li key={index} className="nav-item">
                  <span
                    className={classnames('nav-link', {
                      active: isTabActive,
                      'cursor-poiner': !isTabActive,
                    })}
                    onClick={() => this._setActiveFeedbackTab(index)}
                  >
                    {tab.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card-body">
          {TabComponent && <TabComponent contractorId={constructorId} />}
        </div>
      </div>
    );
  };

  _renderProfile = () => {
    const { contractor } = this.state;

    return (
      <div className="mb-3">
        <div className="bg-white py-4 mt-4 shadow-sm">
          <div className="row">
            {/* Equipment */}
            <div className="col-md-4 text-center">
              <div className="d-flex justify-content-center">
                <Image src={IconEquipments} width={80} height={80} />
                <div className="pl-2 text-tight">
                  <div className="text-xx-large">{contractor.finishedHiringTransactionCount}</div>
                  <div className="lh-1 text-muted">
                    <small>
                      Finished <br /> transactions
                    </small>
                  </div>
                </div>
              </div>
              <hr className="w-50" />
              <h6 className="mt-2 mb-1">Equipment</h6>
              <div className="mb-1">
                <StarRatings rating={contractor.averageEquipmentRating} />
              </div>
              <div>
                <span className="badge badge-pill badge-warning mr-1">
                  {formatFloat(contractor.averageEquipmentRating)}
                </span>{' '}
                {contractor.equipmentFeedbacksCount} feedbacks
              </div>
              <hr className="d-md-none my-4" />
            </div>
            {/* Material */}
            <div className="col-md-4 text-center">
              <div className="d-flex justify-content-center">
                <Image src={IconMaterials} width={80} height={80} />
                <div className="pl-2 text-tight">
                  <div className="text-xx-large">{contractor.finishedMaterialTransactionCount}</div>
                  <div className="lh-1 text-muted">
                    <small>
                      Finished <br /> transactions
                    </small>
                  </div>
                </div>
              </div>
              <hr className="w-50" />
              <h6 className="mt-2 mb-1">Material</h6>
              <div className="mb-1">
                <StarRatings rating={contractor.averageMaterialRating} />
              </div>
              <div>
                <span className="badge badge-pill badge-warning mr-1">
                  {formatFloat(contractor.averageMaterialRating)}
                </span>{' '}
                {contractor.materialFeedbacksCount} feedbacks
              </div>
              <hr className="d-md-none my-4" />
            </div>
            {/* Debris */}
            <div className="col-md-4 text-center">
              <div className="d-flex justify-content-center">
                <Image src={IconDebris} width={80} height={80} />
                <div className="pl-2 text-tight">
                  <div className="text-xx-large">{contractor.finishedDebrisTransactionCount}</div>
                  <div className="lh-1 text-muted">
                    <small>
                      Finished <br /> transactions
                    </small>
                  </div>
                </div>
              </div>
              <hr className="w-50" />
              <h6 className="mt-2 mb-1">Debris</h6>
              <div className="mb-1">
                <StarRatings rating={contractor.averageDebrisRating} />
              </div>
              <div>
                <span className="badge badge-pill badge-warning mr-1">
                  {formatFloat(contractor.averageDebrisRating)}
                </span>{' '}
                {contractor.debrisFeedbacksCount} feedbacks
              </div>
            </div>
          </div>
        </div>
        <h4 className="my-3">Feedbacks</h4>
        {this._renderFeedbacksCard()}
      </div>
    );
  };

  _toggleReportModal = () => {
    const { isShowReportModal } = this.state;
    this.setState({
      isShowReportModal: !isShowReportModal,
    });
  };

  render() {
    const { isShowReportModal, contractor } = this.state;

    return (
      <div className="container profile">
        <ReportModal
          contractor={contractor}
          isOpen={isShowReportModal}
          onClose={() => this._toggleReportModal()}
        />
        <div className="row">
          <div className="col-lg-3">{this._renderContractorCard()}</div>
          <div className="col-lg-9">{this._renderProfile()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor } = authentication;

  return {
    contractor,
  };
};

export default connect(mapStateToProps)(withRouter(ViewProfile));
