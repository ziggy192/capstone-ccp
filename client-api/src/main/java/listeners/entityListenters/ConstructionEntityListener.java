package listeners.entityListenters;

import daos.EquipmentDAO;
import entities.ConstructionEntity;
import entities.EquipmentEntity;

import javax.ejb.Singleton;
import javax.inject.Inject;
import javax.persistence.*;

public class ConstructionEntityListener {

	@Inject
	EquipmentDAO equipmentDAO;

	//must be after update that equipment get the infor from this construction
	@PostUpdate
	void postUpdate(ConstructionEntity constructionEntity) {
		for (EquipmentEntity equipmentEntity : constructionEntity.getEquipmentEntities()) {
			equipmentEntity.setLatitude(constructionEntity.getLatitude());
			equipmentEntity.setLongitude(constructionEntity.getLongitude());
			equipmentEntity.setAddress(constructionEntity.getAddress());
			equipmentDAO.merge(equipmentEntity);
		}
	}

	@PostRemove
	void postRemove(Object object) {
		//do nothing because equipment already have location data

	}
}
