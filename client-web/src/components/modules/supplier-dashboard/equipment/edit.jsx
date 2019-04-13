import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import classnames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';

import { equipmentServices } from 'Src/services/domain/ccp';
import { Image } from 'Src/components/common';
import Skeleton from 'react-loading-skeleton';
import { getRoutePath, getErrorMessage } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';
import { ComponentBlocking, DropzoneUploadImage } from 'Components/common';
import { constructionActions, equipmentTypeCategoryActions } from "Redux/actions";
import { getEquipmentTypeCategories } from 'Services/domain/ccp/equipment.services';

class EditEquipment extends Component {

  state = {
    equipment: {},
    editedData: {}
  };

  /**
   * Load equipment detail
   */
  _loadData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    const data = await equipmentServices.getEquipmentById(id);

    this.setState({
      equipment: data
    });
  };

  _loadConstructions = () => {
    const { loadAllConstructions, construction, contractor } = this.props;

    if (construction.items.length > 0) {
      return;
    }

    loadAllConstructions(contractor.id);
  };

  _loadEquipmentTypeCategory = () => {
    const { loadEquipmentTypeCategories, equipmentTypeCategory } = this.props;

    if (equipmentTypeCategory.length > 0) {
      return;
    }

    loadEquipmentTypeCategories();
  };

  componentDidMount() {
    this._loadData();
    this._loadConstructions();
    this._loadEquipmentTypeCategory();
  }

  /**
   * Handle on field change
   */
  _handleFieldChange = e => {
    let { name, value } = e.target;
    const { construction } = this.props;
    const { editedData } = this.state;

    if (name === 'constructionId') {
      name = 'construction';
      value = construction.items.find(item => item.id === +value);
    }

    this.setState({
      editedData: {
        ...editedData,
        [name]: value
      }
    });
  };

  /**
   * Reset edited data
   */
  _handleResetForm = e => {
    e.preventDefault();

    this.setState({
      editedData: {}
    });
  };

  /**
   * Handle submit form
   */
  _handleFormSubmit = async e => {
    e.preventDefault();
    const { equipment, editedData } = this.state;
    const data = {
      ...equipment,
      ...editedData
    };

    let result;
    try {
      this.setState({ isFetching: true });
      result = await equipmentServices.updateEquipment(equipment.id, data);

      if (!result.id) {
        this.setState({
          isFetching: false,
          error: {
            ...result
          }
        });
      }

      this.setState({
        isFetching: false,
        isSuccess: true,
        equipment: data
      });
    } catch (error) {
      console.log(error);
      this.setState({
        isFetching: false,
        error
      });
    }
  };

  /**
   * Set state needDeletedImageId to show confirm on current image
   */
  _showConfirmDeleteImage = needDeletedImageId => {
    this.setState({
      needDeletedImageId
    });
  };

  /**
   * Set image as thumbnail of the equipment
   */
  _handleSetImageAsThumbnail = async id => {
    const { equipment } = this.state;

    const data = {
      ...equipment,
      thumbnailImage: {
        id
      }
    };

    this.setState({
      isChangingImage: true
    });
    try {
      await equipmentServices.updateEquipment(equipment.id, data);

      this.setState({
        equipment: data,
        isChangingImage: false
      });
    } catch (error) {
      const message = getErrorMessage(error);

      this.setState({
        message,
        isChangingImage: false
      });
    }
  };

  /**
   * A component confirm delete image
   */
  _renderConfirmDeleteImage = id => {
    return (
      <div className="confirm-delete d-flex flex-column justify-content-center align-items-center">
        <p className="text-light">This action can not reverse!</p>
        <button className="btn btn-danger" onClick={() => this._confirmDeleteImage(id)}>Delete</button>
        <button className="btn btn-outline-primary mt-2" onClick={this._cancelDeleteImage}>Cancel</button>
      </div>
    );
  };

  /**
   * Delete image by id after confirmed
   */
  _confirmDeleteImage = async id => {
    const { equipment } = this.state;
    let { equipmentImages } = equipment;

    equipmentImages = equipmentImages.filter(image => image.id !== id);

    this.setState({
      isChangingImage: true
    });

    try {
      await equipmentServices.deleteEquipmentImage(equipment.id, id);

      this.setState({
        isChangingImage: false,
        equipment: {
          ...equipment,
          equipmentImages
        }
      });
    } catch (error) {
      const message = getErrorMessage(error);
      this.setState({
        message,
        isChangingImage: false
      });
    }
  };

  /**
   * Clear need delete image
   */
  _cancelDeleteImage = () => {
    this.setState({
      needDeletedImageId: undefined
    });
  };

  /**
   * Render list image with action buttons
   */
  _renderImages = () => {
    const { equipment, needDeletedImageId } = this.state;
    const { equipmentImages, thumbnailImage } = equipment;

    if (!Array.isArray(equipmentImages)) {
      return null;
    }

    return equipmentImages.map(image => {
      return (
        <CSSTransition
          key={image.id}
          timeout={500}
          classNames="item"
          className="col-md-6 my-2"
        >
          <div>
            <div className={classnames("image-with-times", { thumbnail: image.id === thumbnailImage.id })}>
              <Image
                className="w-100"
                src={image.url}
                alt={`${equipment.name} thumbnail image`}
              />
              {image.id === thumbnailImage.id &&
                <span className="badge badge-primary badge-pill">Thumbnail</span>
              }
              <span className="actions">
                {image.id !== thumbnailImage.id &&
                  <button
                    id={`set_as_thumnail_${image.id}`}
                    className="btn btn-sm btn-primary shadow mr-2"
                    onClick={() => this._handleSetImageAsThumbnail(image.id)}
                    >
                    <i className="fas fa-thumbtack"></i>
                    <UncontrolledTooltip
                      target={`set_as_thumnail_${image.id}`}
                    >
                      Set as thumbnail
                    </UncontrolledTooltip>
                  </button>
                }
                {image.id !== thumbnailImage.id &&
                  <button
                    className="btn btn-sm btn-outline-danger shadow bg-white text-danger"
                    id={`delete_image_${image.id}`}
                    onClick={() => this._showConfirmDeleteImage(image.id)}
                  >
                    <i className="fas fa-times"></i>
                    <UncontrolledTooltip
                      target={`delete_image_${image.id}`}
                    >
                      Delete this image
                    </UncontrolledTooltip>
                  </button>
                }
              </span>
              {needDeletedImageId === image.id &&
                this._renderConfirmDeleteImage(image.id)
              }
            </div>
          </div>
        </CSSTransition>
      );
    });
  };

  /**
   * Upload and add image into equipment on user select images
   */
  _handleFilesSelected = async files => {

    if (!Array.isArray(files) || files.length === 0) {
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append("file", file);
    });

    this.setState({
      isChangingImage: true
    });

    // Upload images
    try {
      const images = await equipmentServices.uploadEquipmentImage(formData);
      const imageIds = images.map(image => ({ id: image.id }));
      const { equipment } = this.state;
      await equipmentServices.addImagesIntoEquipment(imageIds, equipment.id);
      equipment.equipmentImages = [
        ...equipment.equipmentImages,
        ...images
      ];

      this.setState({
        isChangingImage: false,
        equipment
      });
    } catch (error) {
      const message = getErrorMessage(error);
      this.setState({
        message,
        isChangingImage: false
      });
    }
  };

  _renderDetailForm = () => {
    const { equipment, editedData, isSuccess, isFetching, error } = this.state;
    const { construction } = this.props;

    const data = {
      ...equipment,
      ...editedData
    };

    return (
      <div className="bg-white px-2 py-3 sticky-top sticky-sidebar">
        {/* TODO: Add back to list link */}
        <h4>Information: <Link to={getRoutePath(routeConsts.EQUIPMENT_MY)} className="btn btn-sm btn-outline-info float-right"><i className="fal fa-chevron-left"></i> Back to list</Link></h4>
        {isSuccess &&
          <div className="alert alert-success">Save successfully!</div>
        }
        {error &&
          <div className="alert alert-warning">{error.message}</div>
        }
        <form onSubmit={this._handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="equipment_name">Name:</label>
            <input type="text" id="equipment_name" name="name" className="form-control"
              value={data.name}
              onChange={this._handleFieldChange}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="equipment_dailyPrice">Daily price:</label>
            <input type="text" id="equipment_dailyPrice" name="dailyPrice" className="form-control"
              value={data.dailyPrice}
              onChange={this._handleFieldChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="equipment_description">Description:</label>
            <textarea type="text"
              className="form-control"
              rows={4}
              id="equipment_description"
              name="description"
              value={data.description}
              onChange={this._handleFieldChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="equipment_construction">Construction:</label>
            <select
              className="form-control"
              id="equipment_construction"
              name="constructionId"
              value={data.construction.id}
              onChange={this._handleFieldChange}
            >
              {construction.items.map(construction => {
                return (<option key={construction.id} value={construction.id}>{construction.name}</option>);
              })}
            </select>
            <div className="mt-2">Address:</div>
            <p className="text-muted"> {data.construction.address}</p>
          </div>
          <div className="form-group">
            <button className="btn btn-primary" disabled={Object.keys(editedData).length === 0 || isFetching}>
              {isFetching ? <span class="spinner-border spinner-border-sm"></span> : <i className="fas fa-save"></i>} Save
            </button>
            <button className="btn btn-outline-primary ml-2" onClick={this._handleResetForm}><i className="fas fa-undo"></i> Reset</button>
          </div>
        </form>
      </div>
    );
  };

  render() {
    const { equipment, isChangingImage, message } = this.state;

    if (!equipment.id) {
      return (
        <div className="container py-3">
          <Skeleton height={500} />
        </div>
      );
    }

    return (
      <div className="container">
        <h1 className="my-3">Edit equipment: {equipment.name}</h1>
        {message &&
          <div className="alert alert-warning">{message}</div>
        }
        <div className="row">
          <div className="col-md-4">
            {this._renderDetailForm()}
          </div>
          <div className="col-md-8">
            <div className="bg-white px-2 py-3 position-relative">
              {isChangingImage &&
                <ComponentBlocking />
              }
              <h4>Thumbnail image:</h4>
              <DropzoneUploadImage onChange={this._handleFilesSelected} />
              <TransitionGroup className="row">
                {this._renderImages()}
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { authentication, construction, equipmentTypeCategory } = state;
  const { contractor } = authentication;

  return {
    contractor,
    construction,
    equipmentTypeCategory,
  };
};

const mapDispatchToProps = {
  loadAllConstructions: constructionActions.loadAllConstructions,
  loadEquipmentTypeCategories: equipmentTypeCategoryActions.loadAllCategories,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditEquipment);
