package jaxrs.resources;

import daos.ConstructionDAO;
import entities.ConstructionEntity;
import entities.ContractorEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;

import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;

@Stateless
@RolesAllowed("contractor")
public class ConstructionResource {
	private ContractorEntity contractorEntity;

	@Inject
	ConstructionDAO constructionDao;

	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimId;
	public ConstructionResource() {
	}

	public void setContractorEntity(ContractorEntity contractorEntity) {
		this.contractorEntity = contractorEntity;
	}



	@GET
	public Response getConstructionsByContractorId() {
		return Response.ok(contractorEntity.getConstructions()).build();
	}

	public void validateConstructionAll(long constructionId) {
		//validate construction id
		ConstructionEntity foundConstruction = constructionDao.findByIdWithValidation(constructionId);

		if (foundConstruction.getContractor().getId() != contractorEntity.getId()) {
			throw new BadRequestException(String.format("construction id=%s not belongs to contractor id=%s!"
					, constructionId, contractorEntity.getId()
			));
		}



	}

	@GET
	@Path("{constructionId:\\d+}")
	public Response getConstructionByConstructionId(
			@PathParam("constructionId") long constructionId
	) {

		validateConstructionAll(constructionId);
		return Response.ok(constructionDao.findByID(constructionId,false)).build();
	}

	@POST
	@RolesAllowed("contractor")
	public Response postConstructionByContractorId(
			@Valid ConstructionEntity constructionEntity
	) {

		if (contractorEntity.getId() != claimId.getValue().longValue()) {
			throw new BadRequestException("You cannot edit other people's construction");
		}

		constructionEntity.setContractor(contractorEntity);
		constructionDao.persist(constructionEntity);

		return Response.status(Response.Status.CREATED).entity(constructionDao.findByID(constructionEntity.getId())).build();
	}


	@PUT
	@Path("{constructionId:\\d+}")
	@RolesAllowed("contractor")
	public Response updateConstructionByContractorId(
			@PathParam("constructionId") long constructionId,
			@Valid ConstructionEntity constructionEntity
	) {

		if (contractorEntity.getId() != claimId.getValue().longValue()) {
			throw new BadRequestException("You cannot edit other people's construction");
		}

		validateConstructionAll(constructionId);


		ConstructionEntity foundConstruction = constructionDao.findByID(constructionId);
		//todo use mapper here ?

		//get what needed
		foundConstruction.setContractor(contractorEntity);
		foundConstruction.setAddress(constructionEntity.getAddress());
		foundConstruction.setName(constructionEntity.getName());
		foundConstruction.setLatitude(constructionEntity.getLatitude());
		foundConstruction.setLongitude(constructionEntity.getLongitude());




		return Response.ok(constructionDao.merge(foundConstruction)).build();
	}

	@DELETE
	@Path("{constructionId:\\d+}")
	@RolesAllowed("contractor")
	public Response deleteConstructionByContractorId(
			@PathParam("constructionId") long constructionId) {

		if (contractorEntity.getId() != claimId.getValue().longValue()) {
			throw new BadRequestException("You cannot edit other people's construction");
		}

		validateConstructionAll(constructionId);

		ConstructionEntity foundConstruction = constructionDao.findByID(constructionId);
		foundConstruction.setDeleted(true);
		constructionDao.merge(foundConstruction);
		return Response.ok().build();

	}

}
