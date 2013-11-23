package nl.tudelft.bsg.utopolis.server.api;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import nl.tudelft.bsg.utopolis.server.db.DBConnector;
import nl.tudelft.bsg.utopolis.server.model.City;

@Path("city")
public class CityResource extends Resource {
	
	@GET
	@Path("/{playerId}")
	@Produces(MediaType.APPLICATION_JSON)
	public City getCity(@PathParam("playerId") int playerId) {
		return DBConnector.get().getCity(playerId);
	}
	
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public City createCity(City c) {
		DBConnector.get().save(c);
		return c;
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
	public List<City> listCities() {
		return DBConnector.get().getCities();
	}
}
