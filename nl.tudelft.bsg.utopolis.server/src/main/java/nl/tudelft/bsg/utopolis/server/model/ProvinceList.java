package nl.tudelft.bsg.utopolis.server.model;

import java.util.List;

public class ProvinceList {

	private List<Province> provinces;
	
	public ProvinceList(){
		
	}
	
	public ProvinceList(List<Province> provinces){
		this.provinces = provinces;
	}
	
	public List<Province> getProvinces() {
		return provinces;
	}
	public void setProvinces(List<Province> provinces) {
		this.provinces = provinces;
	}
	
}
