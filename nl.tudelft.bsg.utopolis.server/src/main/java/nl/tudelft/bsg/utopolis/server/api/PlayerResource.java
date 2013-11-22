package nl.tudelft.bsg.utopolis.server.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import nl.tudelft.bsg.utopolis.server.db.DBConnector;
import nl.tudelft.bsg.utopolis.server.model.Player;

@Path("player")
public class PlayerResource extends Resource {
	
	@GET
	@Path("/{nick}")
	@Produces(MediaType.APPLICATION_JSON)
	public Player getPlayer(@PathParam("nick") String nick) {
		return DBConnector.get().getPlayer(nick, "");
	}
	
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Player createPlayer(Player p) {
		DBConnector.get().save(p);
		return p;
	}
	
}
