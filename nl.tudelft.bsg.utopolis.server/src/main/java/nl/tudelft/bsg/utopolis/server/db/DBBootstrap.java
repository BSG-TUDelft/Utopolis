package nl.tudelft.bsg.utopolis.server.db;

import java.util.Arrays;

import nl.tudelft.bsg.utopolis.server.model.City;
import nl.tudelft.bsg.utopolis.server.model.KeyPerformanceIndicators;
import nl.tudelft.bsg.utopolis.server.model.Player;
import nl.tudelft.bsg.utopolis.server.model.Province;
import nl.tudelft.bsg.utopolis.server.model.Race;
import nl.tudelft.bsg.utopolis.server.model.Structure;

public class DBBootstrap {
	public static void init() {
		if (DBConnector.get().getPlayers().size() == 0) {
//			Structure s1 = new Structure();
//			s1.setX(1);
//			s1.setY(2);
//			s1.setZ(3);
//			s1.setRotation(90);
//			s1.setScale(0.2);
//			s1.setStructType(StructureType.barracks);
//			s1.setRace(Race.iber);
//			s1.setStructureId("iber_barracks");
//			s1.setMaxCitizens(100);
//			s1.setNumCitizens(13);
//			DBConnector.get().save(s1);
//
//			Structure s2 = new Structure();
//			s2.setX(10);
//			s2.setY(20);
//			s2.setZ(30);
//			s2.setRotation(180);
//			s2.setScale(0.4);
//			s2.setStructType(StructureType.blacksmith);
//			s2.setRace(Race.iber);
//			s2.setStructureId("iber_blacksmith_struct");
//			s2.setMaxCitizens(200);
//			s2.setNumCitizens(133);
//			DBConnector.get().save(s2);
//
//			Structure[] structs1 = { s1, s2 };
			Structure[] structs1 = { };

			Player p1 = new Player();
			p1.setName("John Doe");
			p1.setNick("JD");
			p1.setPassword("pw");
			DBConnector.get().save(p1);

			City c1 = new City();
			c1.setName("Sparta");
			c1.setPlayer(p1);
			c1.setStructures(Arrays.asList(structs1));
			c1.setNumCitizens(1337);
			c1.setColor("0xFF0000");
			c1.setRace(Race.kart);

			KeyPerformanceIndicators kpi = new KeyPerformanceIndicators(40f, 23f, 45f, 12f, 49f);
			c1.setKpi(kpi);			
			
			DBConnector.get().save(c1);

			City[] cities1 = { c1 };

			Province pr1 = new Province();
			pr1.setName("Rome");
			pr1.setCities(Arrays.asList(cities1));
			DBConnector.get().save(pr1);
		}
	}
}
