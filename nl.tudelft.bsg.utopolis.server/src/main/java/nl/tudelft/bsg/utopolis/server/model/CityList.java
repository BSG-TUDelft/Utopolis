package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;
import java.util.List;

public class CityList implements Serializable {

	private static final long serialVersionUID = -2498852110972889364L;
	private List<City> cities;
	
	public CityList(){
		
	}
	
	public CityList(List<City> cities){
		this.cities = cities;
	}
	
	public List<City> getCities() {
		return cities;
	}
	public void setCities(List<City> cities) {
		this.cities = cities;
	}
	
	
}