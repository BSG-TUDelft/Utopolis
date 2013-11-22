package nl.tudelft.bsg.utopolis.server.api;

import java.util.List;

import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Variant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A class that contains convenient methods for Resource classes. The methods
 * defined by this class add facilities for response generation. Other Resource
 * classes should extend this class.
 * 
 */
public class Resource {
	/**
	 * Instantiate a logger.
	 */
	private static final Logger logger = LoggerFactory
			.getLogger(Resource.class);

	/**
	 * Some HTTP response codes.
	 */
	protected static final int HTTP_NOT_AUTHORIZED = 401;
	protected static final int HTTP_NOT_FOUND = 404;
	protected static final int HTTP_INTERNAL_SERVER_ERROR = 500;

	/**
	 * With each request the headers of that request are injected into the
	 * requestHeaders parameter.
	 */
	@Context
	private HttpHeaders requestHeaders;

	/**
	 * With each request URI info is injected into the uriInfo parameter.
	 */
	@Context
	private UriInfo uriInfo;

	/**
	 * Translates a content byte array to a proper response.
	 * 
	 * @param content
	 *            The content byte array.
	 * @return The proper Response containing the content.
	 */
	protected Response responseJson(byte[] content) {
		return responseJson(new String(content));
	}

	/**
	 * Translates a JSON String to a proper response.
	 * 
	 * @param content
	 *            The content String.
	 * @return The proper Response containing the content.
	 */
	protected Response responseJson(String content) {
		return Response.ok(content, MediaType.APPLICATION_JSON).build();
	}

	/**
	 * Generates a simple response with no body.
	 * 
	 * @param status
	 *            Status code of the response.
	 * @return Simple response with no body.
	 */
	protected Response simpleResponse(int status) {
		return Response.status(status).type(MediaType.WILDCARD).build();
	}

	/**
	 * Generates a simple 200 OK response that contains a String message in the
	 * response body.
	 * 
	 * @param msg
	 *            Message that goes in the body of the response.
	 * @return Simple response with the given message in the body.
	 */
	protected Response simpleResponse(String msg) {
		return Response.ok(msg, MediaType.TEXT_PLAIN).build();
	}

	/**
	 * Generates a simple response that contains a String message in the body.
	 * 
	 * @param status
	 *            Status code of the response.
	 * @param msg
	 *            Message that goes in the body of the response.
	 * @return Simple response with the given message in the body.
	 */
	protected Response simpleResponse(int status, String msg) {
		return Response.status(status).type(MediaType.TEXT_PLAIN).entity(msg)
				.build();
	}

	/**
	 * Generates a 404 NOT FOUND response, a standard message will be added to
	 * the body.
	 * 
	 * @return Simple 404 response with a simple message in the body.
	 */
	protected Response notFound() {
		return simpleResponse(HTTP_NOT_FOUND, "Not found.");
	}

	/**
	 * Generates a 404 NOT FOUND response, a message can be added to the body.
	 * 
	 * @param msg
	 *            Message that goes in the body of the response.
	 * @return Simple 404 response with a message in the body.
	 */
	protected Response notFound(String msg) {
		return simpleResponse(HTTP_NOT_FOUND, msg);
	}

	/**
	 * Generates a 500 INTERNAL SERVER ERROR response without a body. Also logs
	 * the exception.
	 * 
	 * @param t
	 *            The exception that was thrown.
	 * @return Simple 500 response, with no body.
	 */
	protected Response internalServerError(Throwable t) {
		logger.error(t.getMessage());
		return simpleResponse(HTTP_INTERNAL_SERVER_ERROR,
				"Internal server error.");
	}

	/**
	 * Generates a 401 NOT AUTHORIZED response without a body.
	 * 
	 * @return Simple 401 response, with no body.
	 */
	protected Response notAuthorized() {
		return simpleResponse(HTTP_NOT_AUTHORIZED, "Not authorized.");
	}

	/**
	 * Generates a 406 NOT ACCEPTABLE response.
	 * 
	 * @return Simple 406 response.
	 */
	protected Response notAcceptable() {
		return Response.notAcceptable(variantXmlJson()).build();
	}

	private List<Variant> variantXmlJson() {
		return Variant.mediaTypes(MediaType.TEXT_XML_TYPE,
				MediaType.APPLICATION_XML_TYPE,
				MediaType.APPLICATION_XHTML_XML_TYPE, MediaType.TEXT_HTML_TYPE,
				MediaType.APPLICATION_JSON_TYPE).build();
	}

	/**
	 * Getter for the request headers.
	 * 
	 * @return The request headers.
	 */
	protected HttpHeaders getRequestHeaders() {
		return requestHeaders;
	}

	/**
	 * Getter for the request query parameters.
	 * 
	 * @return The query parameters.
	 */
	protected MultivaluedMap<String, String> getQueryParameters() {
		return uriInfo.getQueryParameters();
	}

	protected Logger getLogger() {
		return logger;
	}
}
