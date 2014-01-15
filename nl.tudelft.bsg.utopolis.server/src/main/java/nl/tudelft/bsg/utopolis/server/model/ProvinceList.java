package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;
import java.util.List;

public class ProvinceList implements Serializable{

	private static final long serialVersionUID = 6168316763587907421L;
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
