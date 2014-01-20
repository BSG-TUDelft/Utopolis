package nl.tudelft.bsg.utopolis.server.api;

import java.util.List;

import javax.ws.rs.DELETE;
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
import nl.tudelft.bsg.utopolis.server.model.Player;

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
		Player player = DBConnector.get().getPlayer(playerId);
		List<Message> list = player.getMessages();
		MessageList result = new MessageList(list);
		return buildResponse(result);
	}
	
	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	public Response createMessage(Message m){
		DBConnector.get().save(m);
		return buildResponse(m);		
	}

	@DELETE
	@Path("/{messageId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteMessage(@PathParam("messageId") int messageId){
		DBConnector.get().deleteMessage(messageId);
		return simpleResponse(200);
	}

	
	@OPTIONS
	public Response createMessageOptions() {
		return optionsResponse();
	}
	
	@OPTIONS
	@Path("/{messageId}")
	public Response createMessageWithMessageIdOptions() {
		return optionsResponse("PUT, POST, DELETE");
	}
	
}
