package jaxrs.resources;

import daos.MaterialTypeDAO;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

@Path("materialTypes")
public class MaterialTypeResource {
	@Inject
	MaterialTypeDAO materialTypeDAO;


	@GET
	public Response getAllmaterialType() {
		return Response.ok(materialTypeDAO.findAll()).build();

	}

	@GET
	@Path("{id:\\d+}")
	public Response getmaterialTypeById(@PathParam("id") long id) {
		return Response.ok(materialTypeDAO.findByIdWithValidation(id)).build();
	}

}