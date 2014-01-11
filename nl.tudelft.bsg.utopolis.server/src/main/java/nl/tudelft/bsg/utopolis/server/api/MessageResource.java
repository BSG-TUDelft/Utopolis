package nl.tudelft.bsg.utopolis.server.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import nl.tudelft.bsg.utopolis.server.db.DBConnector;
import nl.tudelft.bsg.utopolis.server.model.Message;
import nl.tudelft.bsg.utopolis.server.model.MessageList;

@Path("message")
public class MessageResource extends Resource {

	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON)
	public Response listMessages(){
		return buildResponse(new MessageList(DBConnector.get().getMessages()));
	}
	
	@GET
	@Path("/{playerId}/list")
	@Produces(MediaType.APPLICATION_JSON)
	public Response listPlayerMessages(@PathParam("playerId") int playerId){
		return buildResponse(new MessageList(DBConnector.get().getPlayerMessages(playerId)));
	}
	
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createMessage(Message m){
		DBConnector.get().save(m);
		return buildResponse(m);		
	}
	
	@OPTIONS
	public Response createMessageOptions() {
		return optionsResponse();
	}
}
