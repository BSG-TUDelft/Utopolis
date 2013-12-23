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
import nl.tudelft.bsg.utopolis.server.model.City;
import nl.tudelft.bsg.utopolis.server.model.Structure;

@Path("city")
public class CityResource extends Resource {

	@GET
	@Path("/{playerId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getCity(@PathParam("playerId") int playerId) {
		return buildResponse(DBConnector.get().getCity(playerId));
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createCity(City c) {
		DBConnector.get().save(c);
		return buildResponse(c);
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateCity(City c) {
		DBConnector.get().save(c);
		return simpleResponse(200);
	}

	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON)
	public Response listCities() {
		return buildResponse(DBConnector.get().getCities());
	}

	@OPTIONS
	@Path("/{playerId}/structure")
	public Response createStructureOptions() {
		return optionsResponse();
	}

	@PUT
	@Path("/{playerId}/structure")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createStructure(@PathParam("playerId") int playerId,
			Structure s) {
		City c = DBConnector.get().getCity(playerId);
		c.getStructures().add(s);
		DBConnector.get().save(c);
		return buildResponse(s);
	}
}
