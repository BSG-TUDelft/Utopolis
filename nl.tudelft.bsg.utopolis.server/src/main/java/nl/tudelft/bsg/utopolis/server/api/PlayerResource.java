package nl.tudelft.bsg.utopolis.server.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import nl.tudelft.bsg.utopolis.server.model.Player;

@Path("player")
public class PlayerResource extends Resource {
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Player getPlayer() {
		Player p = new Player();
		p.setName("Name");
		p.setNick("Nick");
		p.setPassword("Password");
		return p;
	}
	
}
