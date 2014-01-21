package nl.tudelft.bsg.utopolis.server.api;

import java.util.Date;

import javax.ws.rs.Consumes;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import nl.tudelft.bsg.utopolis.server.db.DBConnector;
import nl.tudelft.bsg.utopolis.server.model.City;
import nl.tudelft.bsg.utopolis.server.model.Resources;
import nl.tudelft.bsg.utopolis.server.model.Structure;
import nl.tudelft.bsg.utopolis.server.model.util.StructureProperties;

@Path("poll")
public class PollResource extends Resource {

	private static final int UPDATE_TIME = 600;

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response pollCity(City c) {
		long then = c.getLastUpdate();
		DBConnector.get().save(c);
		long now = new Date().getTime();

		for (Structure s : c.getStructures()) {
			if (now - then >= UPDATE_TIME) {
				Resources generates = StructureProperties.getProperties(s)
						.getGenerates();
				c.getResources().add(generates);
			}
		}
		
		DBConnector.get().save(c);

		return buildResponse(c);
	}

	
	@OPTIONS
	public Response createPollOptions() {
		return optionsResponse();
	}
}
