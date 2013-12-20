package nl.tudelft.bsg.utopolis.server.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("ping")
public class PingResource extends Resource {
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public Response ping() {
		return simpleResponse(200, "pong");
	}
	
}
