package nl.tudelft.bsg.utopolis.server.api;

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
import nl.tudelft.bsg.utopolis.server.model.Structure;

@Path("structure")
public class StructureResource extends Resource {
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Structure getStructure(@PathParam("id") int id) {
		return DBConnector.get().getStructure(id);
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Structure createStructure(Structure s) {
		DBConnector.get().save(s);
		return s;
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateStructure(Structure s) {
		System.out.println("TESTTTTTT");
		//DBConnector.get().save(s);
		return simpleResponse(200);
	}
	
}
