package nl.tudelft.bsg.utopolis.server.db;

import java.io.Serializable;
import java.util.List;

import nl.tudelft.bsg.utopolis.server.model.City;
import nl.tudelft.bsg.utopolis.server.model.Message;
import nl.tudelft.bsg.utopolis.server.model.Player;
import nl.tudelft.bsg.utopolis.server.model.Province;
import nl.tudelft.bsg.utopolis.server.model.Structure;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.criterion.Projections;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;

public class DBConnector {
	private static DBConnector instance = null;

	private SessionFactory sessionFactory;
	private ServiceRegistry serviceRegistry;

	private Session session;

	private DBConnector() {
		sessionFactory = configureSessionFactory();
	}

	public static DBConnector get() {
		if (instance == null) {
			instance = new DBConnector();
		}
		return instance;
	}

	private SessionFactory configureSessionFactory() throws HibernateException {
		Configuration configuration = new Configuration();
		configuration.configure();
		serviceRegistry = new ServiceRegistryBuilder().applySettings(
				configuration.getProperties()).buildServiceRegistry();
		sessionFactory = configuration.buildSessionFactory(serviceRegistry);
		return sessionFactory;
	}

	private Session getSession() {
		if (session == null || !session.isOpen())
			session = openSession();
		return session;
	}

	private Session openSession() {
		return sessionFactory.openSession();
	}

	private void closeSession() {
		if (session != null && session.isOpen())
			session.close();
	}

	public void close() {
		session.close();
		sessionFactory.close();
	}

	public void save(Serializable object) {
		closeSession();
		Session session = openSession();
		Transaction transaction = null;
		try {
			transaction = session.beginTransaction();
			session.saveOrUpdate(object);
			transaction.commit();
		} catch (RuntimeException e) {
			System.err.println(e.getMessage());
			e.printStackTrace();
			if (transaction != null)
				transaction.rollback();
		} finally {
			session.close();
		}
	}

	public void saveAll(List<? extends Serializable> objects) {
		closeSession();
		Session session = openSession();
		Transaction transaction = null;
		try {
			transaction = session.beginTransaction();
			for (Serializable object : objects)
				session.saveOrUpdate(object);
			transaction.commit();
		} catch (RuntimeException e) {
			System.err.println(e.getMessage());
			if (transaction != null)
				transaction.rollback();
		} finally {
			session.close();
		}
	}
	
	public Player getPlayer(int id) {
		return (Player) getSession()
				.createQuery("from Player where id = :id")
				.setParameter("id", id)
				.uniqueResult();
	}

	public Player getPlayer(String nick, String password) {
		return (Player) getSession()
				.createQuery("from Player where nick = :nick")
				.setParameter("nick", nick)
				.uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	public List<Player> getPlayers() {
		return getSession()
				.createQuery("from Player")
				.list();
	}
	
	public City getCityByPlayerId(int playerId) {
		City city = (City) getSession()
			.createQuery("from City where player_id = :player_id")
			.setParameter("player_id", playerId)
			.uniqueResult();
		
		// This is extremely lame but if you can tell me how to do bidirectional relationship I'd be happy to know!
		// this describes the situation I think but I can't make it work http://stackoverflow.com/questions/14844691/how-can-i-get-moxy-to-assign-a-parent-when-unmarshalling-a-child-with-an-xmlinve
		city.setProvinceId(getProvinceForCity(city).getId());

		return city;
	}

	/** Attemps to find a player in the database that has nick and password of given player. Only password is case sensitive
	 * @param nick
	 * @param password
	 * @return player if a player is found with  given credentials*/
	public Player validate(String nick, String password){
		Player player = (Player)getSession()
			.createQuery("from Player where nick = :nick")
			.setParameter("nick", nick)
			.uniqueResult();
		// Check pwd seperately because SQL is case insensitive
		if(player != null && player.getPassword().equals(password)){
			return player;
		}
		return null;
	}
		
	private Province getProvinceForCity(City city) {
		List<Province> provinces = getProvinces();
		for(Province province : provinces){
			if(province.getCities().contains(city))
				return province;
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	public List<City> getCities() {
		List<City> cityList = getSession()
			.createQuery("from City")
			.list();
		for(City city : cityList){
			city.setProvinceId(getProvinceForCity(city).getId());
		}
		
		return cityList;
	}
	
	@SuppressWarnings("unchecked")
	public List<Message> getMessages() {
		return getSession()
				.createQuery("from Message")
				.list();
	}
	
	
	@SuppressWarnings("unchecked")
	public List<Message> getPlayerMessages(int playerId) {
		return getSession()
				.createQuery("from Message where player_id = :player_id")
				.setParameter("player_id", playerId)
				.list();
	}
	
	public Message getMessage(int messageId) {
		return (Message) getSession()
				.createQuery("from Message where id = :message_id")
				.setParameter("message_id", messageId)
				.uniqueResult();
	}
	
	public void deleteMessage(int messageId) {
		Message message = getMessage(messageId);
		/*Player player = message.getPlayer();
		List<Message> all = getPlayerMessages(player.getId());
		for(Message msg : all){
			if(msg.getId() == messageId)
				all.remove(msg);
		}
		
		player.setMessages(all);*/
		getSession().delete(message);
	}
	
	

	public Structure getStructure(int id) {
		return (Structure) getSession()
				.createQuery("from Structure where id = :id")
				.setParameter("id", id)
				.uniqueResult();
	}
	
	public Province getProvince(int id) {
		return (Province) getSession()
				.createQuery("from Province where id = :id")
				.setParameter("id", id)
				.uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	public List<Province> getProvinces() {
		return getSession()
				.createQuery("from Province")
				.list();
	}

	public long count(Class<?> clazz) {
		return (Long) getSession()
				.createCriteria(clazz)
				.setProjection(Projections.rowCount())
				.uniqueResult();
	}

}
