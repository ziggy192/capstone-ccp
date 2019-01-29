package entities;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "equipment", schema = "capstone_ccp")

@NamedQueries({
		@NamedQuery(name = "EquipmentEntity.searchEquipment", query = "select e from EquipmentEntity  e where exists (select t from e.availableTimeRanges t where t.beginDate <= :curBeginDate and :curBeginDate <= :curEndDate  and  :curEndDate <= t.endDate)"),
		@NamedQuery(name = "EquipmentEntity.getAll", query = "select  e from EquipmentEntity e")
})

public class EquipmentEntity {
	private long id;
	private String name;
	private Integer dailyPrice;
	private Integer deliveryPrice;
	private String description;
	private String status;
	private String thumbnailImage;

	private Boolean isDeleted;
	private Timestamp createdTime;
	private Timestamp updatedTime;


	private String address;
	private Double latitude;
	private Double longitude;

	private EquipmentTypeEntity equipmentType;

	private ContractorEntity constructor;
	private Integer constructionId;

	private List<AvailableTimeRangeEntity> availableTimeRanges;
	private Collection<DescriptionImageEntity> descriptionImages;


	public EquipmentEntity() {
	}


	@Id
	@GeneratedValue
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "name", nullable = true, length = 255)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Basic
	@Column(name = "daily_price", nullable = true)
	public Integer getDailyPrice() {
		return dailyPrice;
	}

	public void setDailyPrice(Integer dailyPrice) {
		this.dailyPrice = dailyPrice;
	}

	@Basic
	@Column(name = "delivery_price", nullable = true)
	public Integer getDeliveryPrice() {
		return deliveryPrice;
	}

	public void setDeliveryPrice(Integer deliveryPrice) {
		this.deliveryPrice = deliveryPrice;
	}

	@Basic
	@Column(name = "description", nullable = true, length = -1)
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Basic
	@Column(name = "status", nullable = true, length = 45)
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@ManyToOne
	@JoinColumn(name = "equipment_type_id")
	public EquipmentTypeEntity getEquipmentType() {
		return equipmentType;
	}

	public void setEquipmentType(EquipmentTypeEntity equipmentType) {
		this.equipmentType = equipmentType;
	}


	@ManyToOne()
	@JoinColumn(name = "contractor_id", insertable = false, updatable = false)
	public ContractorEntity getConstructor() {
		return constructor;
	}

	public void setConstructor(ContractorEntity constructor) {
		this.constructor = constructor;
	}

	@Basic
	@Column(name = "construction_id", nullable = true)
	public Integer getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(Integer constructionId) {
		this.constructionId = constructionId;
	}


	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "equipment_id")
	public List<AvailableTimeRangeEntity> getAvailableTimeRanges() {
		return availableTimeRanges;
	}

	public void setAvailableTimeRanges(List<AvailableTimeRangeEntity> availableTimeRanges) {
		this.availableTimeRanges = availableTimeRanges;
	}

	public void addAvailableTimeRange(AvailableTimeRangeEntity availableTimeRangeEntity) {
		this.availableTimeRanges.add(availableTimeRangeEntity);
		availableTimeRangeEntity.setEquipment(this);
	}

	public void deleteAvailableTimeRange(AvailableTimeRangeEntity availableTimeRangeEntity) {
		this.availableTimeRanges.remove(availableTimeRangeEntity);
		availableTimeRangeEntity.setEquipment(null);
	}


	public void deleteAllAvailableTimeRange() {
		for (AvailableTimeRangeEntity availableTimeRange : availableTimeRanges) {
			availableTimeRange.setEquipment(null);
		}
		this.availableTimeRanges.clear();
	}


	@Basic
	@Column(name = "thumbnail_image")
	public String getThumbnailImage() {
		return thumbnailImage;
	}

	public void setThumbnailImage(String thumbnailImage) {
		this.thumbnailImage = thumbnailImage;
	}

	@Basic
	@Column(name = "is_deleted",nullable = true)
	public Boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(Boolean deleted) {
		isDeleted = deleted;
	}

	@Basic
	@Column(name = "created_time")
	public Timestamp getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time")
	public Timestamp getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(Timestamp updatedTime) {
		this.updatedTime = updatedTime;
	}

	@Basic
	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Basic
	@Column(name = "lat")
	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	@Basic
	@Column(name = "long")
	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	@OneToMany(mappedBy = "equipment")
	public Collection<DescriptionImageEntity> getDescriptionImages() {
		return descriptionImages;
	}

	public void setDescriptionImages(Collection<DescriptionImageEntity> descriptionImagesById) {
		this.descriptionImages = descriptionImagesById;
	}
}