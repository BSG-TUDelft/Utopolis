package nl.tudelft.bsg.utopolis.server;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.ext.ContextResolver;

import nl.tudelft.bsg.utopolis.server.db.DBBootstrap;
import nl.tudelft.bsg.utopolis.server.db.DBConnector;
import nl.tudelft.bsg.utopolis.server.model.Resources;
import nl.tudelft.bsg.utopolis.server.model.util.StructureProperties;

import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.moxy.json.MoxyJsonConfig;
import org.glassfish.jersey.server.ResourceConfig;

import com.eclipsesource.json.JsonObject;

/**
 * Main class.
 *
 */
public class Main {
    // Base URI the Grizzly HTTP server will listen on
    public static final String BASE_URI = "http://localhost:8080/api/";

    
    
    /**
     * Starts Grizzly HTTP server exposing JAX-RS resources defined in this application.
     * @return Grizzly HTTP server.
     */
    public static HttpServer startServer() {
		/*
		 * Todo: read structure properties here, store in application variable
		
		FileReader reader;
		try {
			reader = new FileReader( "src/main/config/structureproperties.json");
			JsonObject allProperties = JsonObject.readFrom(reader);
			JsonObject structProps = allProperties.get("house").asObject();
			Resources cost = new Resources(),
					requirements = new Resources(),
					generates = new Resources();

			
			// Parse cost
			JsonObject costProps = structProps.get("cost").asObject();
			if(costProps != null){			
				float wood = parseNullableFloat(costProps, "wood");
				float food = parseNullableFloat(costProps, "food");
				float metal = parseNullableFloat(costProps, "metal");
				float stone = parseNullableFloat(costProps, "stone"); 

				cost.setWood(wood);
				cost.setFood(food);
				cost.setMetal(metal);
				cost.setStone(stone);
			}

			// Parse requirements
			JsonObject reqProps = structProps.get("requirements").asObject();
			if(reqProps != null){			
				float knowledge = parseNullableFloat(costProps, "knowledge");
				float culture = parseNullableFloat(costProps, "culture");

				requirements.setWood(knowledge);
				requirements.setFood(culture);
			}
			
			// Parse generates
			JsonObject genProps = structProps.get("generates").asObject();
			if(genProps != null){			
				float wood = parseNullableFloat(costProps, "wood");
				float food = parseNullableFloat(costProps, "food");
				float metal = parseNullableFloat(costProps, "metal");
				float stone = parseNullableFloat(costProps, "stone"); 
				float knowledge = parseNullableFloat(costProps, "knowledge");
				float culture = parseNullableFloat(costProps, "culture");
				float spirituality = parseNullableFloat(costProps, "spirituality");
				float safety = parseNullableFloat(costProps, "safety");
				float peace = parseNullableFloat(costProps, "peace");
				float diplomacy = parseNullableFloat(costProps, "diplomacy");
				float trade = parseNullableFloat(costProps, "trade");
				float economy = parseNullableFloat(costProps, "economy");

				generates.setWood(wood);
				generates.setFood(food);
				generates.setMetal(metal);
				generates.setStone(stone);
				generates.setKnowledge(knowledge);
				generates.setCulture(culture);
				generates.setSpirituality(spirituality);
				generates.setSafety(safety);
				generates.setPeace(peace);
				generates.setDiplomacy(diplomacy);
				generates.setTrade(trade);
				generates.setEconomy(economy);
			}
			
			long buildTime = structProps.get("buildTime").asLong();
			int citizenCap = structProps.get("citizenCap").asInt();
			
			StructureProperties properties = new StructureProperties(cost, requirements, generates, buildTime, citizenCap);
		
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}//*/
		
    	
        // create a resource config that scans for JAX-RS resources and providers
        // in nl.tudelft.bsg.utopolis.server package
        final ResourceConfig rc = new ResourceConfig()
        		.packages("nl.tudelft.bsg.utopolis.server.api")
        		.register(createMoxyJsonResolver());
        // create and start a new instance of grizzly http server
        // exposing the Jersey application at BASE_URI
        return GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);
    }
    
	public static ContextResolver<MoxyJsonConfig> createMoxyJsonResolver() {
        final MoxyJsonConfig moxyJsonConfig = new MoxyJsonConfig();
        Map<String, String> namespacePrefixMapper = new HashMap<String, String>(1);
        namespacePrefixMapper.put("http://www.w3.org/2001/XMLSchema-instance", "xsi");
        moxyJsonConfig.setNamespacePrefixMapper(namespacePrefixMapper).setNamespaceSeparator(':');
        return moxyJsonConfig.resolver();
    }

    /**
     * Main method.
     * @param args
     * @throws IOException
     */
    public static void main(String[] args) throws IOException {
        final HttpServer server = startServer();
        DBConnector.get();
        DBBootstrap.init();

        System.out.println(String.format("Jersey app started with WADL available at "
                + "%sapplication.wadl\nHit enter to stop it...", BASE_URI));
        System.in.read();
        server.stop();
    }

    /** Tries to parse a float value corresponding to propertyName in given propertyObject
     * @param propertyObject JsonObject 
     * @param propertyName
     * @return Float value if property is found, 0 if no property can be found */
    private static float parseNullableFloat(JsonObject propertyObject, String propertyName) {
    	
    	return propertyObject.get(propertyName) == null ? 0f : propertyObject.get(propertyName).asFloat();
    }
}

