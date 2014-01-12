package nl.tudelft.bsg.utopolis.server.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import nl.tudelft.bsg.utopolis.server.db.DBConnector;
import nl.tudelft.bsg.utopolis.server.model.Province;
import nl.tudelft.bsg.utopolis.server.model.ProvinceList;

@Path("province")
public class ProvinceResource extends Resource {
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getProvince(@PathParam("id") int id) {
		return buildResponse(DBConnector.get().getProvince(id));
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createProvince(Province p) {
		DBConnector.get().save(p);
		return buildResponse(p);
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateProvince(Province p) {
		DBConnector.get().save(p);
		return simpleResponse(200);
	}
	
	@OPTIONS
	public Response createProvinceOptions() {
		return optionsResponse();
	}
	
	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON)
	public Response listProvinces() {
		return buildResponse(new ProvinceList(DBConnector.get().getProvinces()));
	}

}
