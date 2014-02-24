package nl.tudelft.bsg.utopolis.server.model.util;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import com.eclipsesource.json.JsonObject;
import nl.tudelft.bsg.utopolis.server.model.Resources;
import nl.tudelft.bsg.utopolis.server.model.Structure;

public class StructureProperties {
	private Resources cost;
	private Resources requirements;
	private Resources generates;
	private long buildTime;
	private int citizenCap;

	public StructureProperties(Resources cost, Resources requirements,
			Resources generates, long buildTime, int citizenCap) {
		this.cost = cost;
		this.requirements = requirements;
		this.generates = generates;
		this.buildTime = buildTime;
		this.citizenCap = citizenCap;
	}
	
	public static StructureProperties getProperties(Structure s) {
		FileReader reader;
		
		String sid = s.getStructureId();
		String structureTypeId = sid.substring(sid.lastIndexOf('_')+1);
		try {
			reader = new FileReader( "src/main/config/structureproperties.json");
			JsonObject allProperties = JsonObject.readFrom(reader);
			JsonObject structProps = allProperties.get(structureTypeId).asObject();
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
			
			return new StructureProperties(cost, requirements, generates, buildTime, citizenCap);
		
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;	
	}

	public Resources getCost() {
		return cost;
	}

	public Resources getRequirements() {
		return requirements;
	}

	public Resources getGenerates() {
		return generates;
	}

	public long getBuildTime() {
		return buildTime;
	}

	public int getCitizenCap() {
		return citizenCap;
	}

    /** Tries to parse a float value corresponding to propertyName in given propertyObject
     * @param propertyObject JsonObject 
     * @param propertyName
     * @return Float value if property is found, 0 if no property can be found */
    private static float parseNullableFloat(JsonObject propertyObject, String propertyName) {
    	
    	return propertyObject.get(propertyName) == null ? 0f : propertyObject.get(propertyName).asFloat();
    }
	
}
