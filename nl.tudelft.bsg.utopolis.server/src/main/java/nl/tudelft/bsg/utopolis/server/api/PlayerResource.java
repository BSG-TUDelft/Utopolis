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
import nl.tudelft.bsg.utopolis.server.model.Player;
import nl.tudelft.bsg.utopolis.server.model.PlayerList;

@Path("player")
public class PlayerResource extends Resource {
	
	@GET
	@Path("/{nick}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getPlayer(@PathParam("nick") String nick) {
		return buildResponse(DBConnector.get().getPlayer(nick, ""));
	}
	
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createPlayer(Player p) {
		DBConnector.get().save(p);
		return buildResponse(p);
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updatePlayer(Player p) {
		DBConnector.get().save(p);
		return simpleResponse(200);
	}
	
	@OPTIONS
	public Response createPlayerOptions() {
		return optionsResponse();
	}
	
	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON)
	public Response listPlayers() {
		return buildResponse(new PlayerList(DBConnector.get().getPlayers()));
	}
}
