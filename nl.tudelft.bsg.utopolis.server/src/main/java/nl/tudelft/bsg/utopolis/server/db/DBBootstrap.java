package nl.tudelft.bsg.utopolis.server.db;

import java.util.Arrays;
import java.util.Date;

import nl.tudelft.bsg.utopolis.server.model.City;
import nl.tudelft.bsg.utopolis.server.model.KeyPerformanceIndicators;
import nl.tudelft.bsg.utopolis.server.model.Medals;
import nl.tudelft.bsg.utopolis.server.model.Message;
import nl.tudelft.bsg.utopolis.server.model.Player;
import nl.tudelft.bsg.utopolis.server.model.Province;
import nl.tudelft.bsg.utopolis.server.model.Race;
import nl.tudelft.bsg.utopolis.server.model.Structure;

public class DBBootstrap {
	public static void init() {
		if (DBConnector.get().getPlayers().size() == 0) {
			

			City[] cities1 = { 
					generateCity("Athens", "Georgi", Race.hele),
					generateCity("Cartage", "Wouter", Race.kart),
					generateCity("Acropolis", "Tiago", Race.pers),
					generateCity("New Rome", "Annika", Race.rome)
			};
			
			Province pr1 = new Province();
			pr1.setName("First grade");
			pr1.setCities(Arrays.asList(cities1));
			DBConnector.get().save(pr1);
			
			
		}
	}

	private static City generateCity(String cityName, String playerName, Race race) {
		Structure[] structs = { };

		Player player = new Player();
		player.setName(playerName);
		player.setNick(playerName);
		player.setPassword("pw");
		DBConnector.get().save(player);

		Message m1 = new Message(), m2 = new Message();
		m1.setEntryDate(new Date());
		m1.setSender("Teacher");
		m1.setSubject("Update from your teacher");
		m1.setMessage("Random message to " + playerName + " !");
		m1.setAssignNum(1);
		m2.setEntryDate(new Date());
		m2.setSender("Teacher");
		m2.setSubject("Another update from your teacher");
		m2.setMessage("Random hyper mega gigantic piece of text for this example. Teacher will be albe to see all of the message sent to the student!");
		m2.setAssignNum(10);
		DBConnector.get().save(m1);
		DBConnector.get().save(m2);

		Message[] messages = {
			m1,
			m2
		};
		player.setMessages(Arrays.asList(messages));
		
		City city = new City();
		city.setName(cityName);
		city.setPlayer(player);
		city.setStructures(Arrays.asList(structs));
		city.setNumCitizens((int)Math.random() * 100);
		city.setColor("0xFF0000");
		city.setRace(race);

		KeyPerformanceIndicators kpi = new KeyPerformanceIndicators((float) (Math.random() * 30f), 
				(float) (Math.random() * 30f), 
				(float) (Math.random() * 30f), 
				(float) (Math.random() * 30f), 
				(float) (Math.random() * 30f));
		city.setKpi(kpi);			
		
		Medals medals = new Medals();
		for(int i = 0; i < Math.random() * 6; i++){
			switch(i){
			case 0:
				medals.setQuest0Completed(true);
				break;
			case 1:
				medals.setQuest1Completed(true);
				break;
			case 2:
				medals.setQuest2Completed(true);
				break;
			case 3:
				medals.setQuest3Completed(true);
				break;
			case 4:
				medals.setQuest4Completed(true);
				break;
			case 5:
				medals.setQuest5Completed(true);
				break;
			
			}
		}
		city.setMedals(medals);
		
		DBConnector.get().save(city);
		
		return city;
	}
}
