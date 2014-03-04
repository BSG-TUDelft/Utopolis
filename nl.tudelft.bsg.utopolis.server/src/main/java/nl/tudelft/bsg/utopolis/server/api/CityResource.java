package nl.tudelft.bsg.utopolis.server.api;

import java.util.HashSet;
import java.util.Set;

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
import nl.tudelft.bsg.utopolis.server.game.QuestEngine;
import nl.tudelft.bsg.utopolis.server.model.City;
import nl.tudelft.bsg.utopolis.server.model.CityList;
import nl.tudelft.bsg.utopolis.server.model.Structure;

@Path("city")
public class CityResource extends Resource {

	@GET
	@Path("/{playerId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getCity(@PathParam("playerId") int playerId) {
		City city = DBConnector.get().getCityByPlayerId(playerId);
		return buildResponse(city);

	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createCity(City c) {
		DBConnector.get().save(c);
		return buildResponse(c);
	}
	
	@OPTIONS
	public Response createCityOptions() {
		return optionsResponse();
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
		return buildResponse(new CityList(DBConnector.get().getCities()));
	}
	

	@OPTIONS
	@Path("/{playerId}/structure")
	public Response createStructureOptions() {
		return optionsResponse();
	}

	@PUT
	@Path("/{playerId}/structure")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createStructure(@PathParam("playerId") int playerId,
			Structure s) {
		City c = DBConnector.get().getCityByPlayerId(playerId);
		c.getStructures().add(s);

		// Run Quest engine
		Set<Integer> completedQuests = new QuestEngine().calculateCompletedQuests(c);
		c.getPlayer().setCompletedQuests(completedQuests);

		DBConnector.get().save(c);
		return buildResponse(c);
	}

	@POST
	@Path("/{playerId}/citizens/{assignedCitizens}")
	public Response assignCitizens(@PathParam("playerId") int playerId, @PathParam("assignedCitizens") int assignedCitizens) {
		City c = DBConnector.get().getCityByPlayerId(playerId);
		System.out.println(c.getNumCitizens());
		c.setNumCitizens(c.getNumCitizens() + assignedCitizens);
		DBConnector.get().save(c);
		System.out.println(c.getNumCitizens());
		return simpleResponse(200);
	}

}


