package nl.tudelft.bsg.utopolis.server.model.util;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;

import com.eclipsesource.json.JsonObject;
import com.eclipsesource.json.JsonValue;

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
			JsonObject structProps = allProperties.get("house").asObject();
			JsonObject requirements = structProps.get("requirements").asObject();
			JsonObject cost = structProps.get("cost").asObject();
			JsonObject generates = structProps.get("generates").asObject();
			
			return new StructureProperties(
					new Resources(2, 0, 0, 1, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 4, 4, 0, 0), 
					new Resources(1, 1, 1, 0, 1, 1, 1, 1), 
					30000, 
					4);
			
			Resources resources = new Resources();
			resources.setCitizens(0);
			resources.setCulture(.);
			System.out.println(k);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

		if (sid.endsWith("house")) {
			return new StructureProperties(
						new Resources(2, 0, 0, 1, 0, 0, 0, 0), 
						new Resources(0, 0, 0, 0, 4, 4, 0, 0), 
						new Resources(1, 1, 1, 0, 1, 1, 1, 1), 
						30000, 
						4);
			/*
			food, metal, stone, wood,    knowledge, culture, citizens, societal
			*/
		} else if (sid.endsWith("farm")) {
			return new StructureProperties(
					new Resources(2, 2, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 4, 4, 0, 0), 
					new Resources(2, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
			/*
			cost: {
				metal: 2,
				food: 2
			},
			requirements: {
				knowledge: 4,
				culture: 4
			},
			buildTime: 30000,
			generates: {
				food: 2,
				health: 1,
				economy: 1,
				trade: 1
			},
			citizenCap: 6
			 */
		} else if (sid.endsWith("corral")) {
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
			/*
			cost: {
				metal: 4,
				food: 2
			},
			requirements: {
				knowledge: 4,
				culture: 4
			},
			buildTime: 30000,
			generates: {
				food: 4,
				health: 1,
				diplomacy: 1
			},
			citizenCap: 6
			 */
		} else if (sid.endsWith("market")) {
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
			/*
			 cost: {
				metal: 100,
				stone: 100,
				wood: 1000,
				food: 5000
			},
			requirements: {
				knowledge: 100,
				culture: 250
			},
			buildTime: 30000,
			generates: {
				stone: 8,
				metal: 8,
				wood: 8,
				food: 16,
				knowledge: 10,
				culture: 10,
				diplomacy: 5,
				trade: 5,
				peace: 5
			},
			citizenCap: 6
			 */
		} else if (sid.endsWith("storehouse")) {
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
			/*
			 cost: {
				wood: 50,
				stone: 50,
				metal: 50,
				food: 100
			},
			requirements: {
				knowledge: 4,
				culture: 4
			},
			buildTime: 120000,
			generates: {
				stone: 6,
				metal: 6,
				wood: 6,
				food: 8,
				economy: 3
			},
			citizenCap: 8
			 */
		} else if (sid.endsWith("barracks")) {
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
			/*
			 cost: {
				wood: 100,
				food: 200
			},
			requirements: {
				knowledge: 40,
				culture: 40
			},
			buildTime: 120000,
			generates: {
				wood: 10,
				metal: 10,
				stone: 10,
				safety: 5,
				peace: 5
			},
			citizenCap: 10
			 */
		} else if (sid.endsWith("blacksmith")) {
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
			/*
			 cost: {
				wood: 50,
				food: 100,
				metal: 25,
				stone: 25
			},
			requirements: {

			},
			buildTime: 240000,
			generates: {
				knowledge: 5,
				stone: 5,
				safety: 1,
				diplomacy: 1
			},
			citizenCap: 8
			 */
		} else if (sid.endsWith("tower")) {
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
			/*
			 cost: {
				stone: 25,
				metal: 25,
				food: 50
			},
			requirements: {
				knowledge: 25,
				culture: 25
			},
			buildTime: 120000,
			generates: {
				stone: 15,
				knowledge: 5,
				safety: 2
			},
			citizenCap: 10
			 */
		} else if (sid.endsWith("civic")) {
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
			/*
			 cost: {
				stone: 1,
				metal: 1,
				food: 2
			},
			requirements: {
				knowledge: 4,
				culture: 4
			},
			buildTime: 30000,
			generates: {
				knowledge: 1,
				culture: 1,
				peace: 1
			},
			citizenCap: 20
			 */
		} else if (sid.endsWith("fortress")) {
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
			/*
			 cost: {
				stone: 500,
				metal: 200,
				food: 1000
			},
			requirements: {
				knowledge: 500,
				culture: 500
			},
			buildTime: 300000,
			generates: {
				culture: 35,
				knowledge: 35,
				safety: 5,
				peace: 5,
				diplomacy: 5
			},
			citizenCap: 25
			 */
		} else if (sid.endsWith("temple")) {
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
			/*
			cost: {
				stone: 500,
				food: 5000
			},
			requirements: {
				knowledge: 250,
				culture: 250
			},
			buildTime: 600000,
			generates: {
				culture: 35,
				spirituality: 15
			},
			citizenCap: 30 
			 */
		} else if (sid.endsWith("flag")) {
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
			/*
			 cost: {
				stone: 0,
				food: 0
			},
			requirements: {
				knowledge: 0,
				culture: 0
			},
			buildTime: 100000
			 */
		} else if (sid.endsWith("tree")) {
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
		} else {
			System.out.println("ERROR - UNKNOWN STRUCTURE: " + sid);
			return new StructureProperties(
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					new Resources(0, 0, 0, 0, 0, 0, 0, 0), 
					0, 
					0);
		}
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
	
}
