package nl.tudelft.bsg.utopolis.server.db;

import java.io.Serializable;
import java.util.List;

import nl.tudelft.bsg.utopolis.server.model.Player;
import nl.tudelft.bsg.utopolis.server.model.Province;
import nl.tudelft.bsg.utopolis.server.model.Structure;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Query;
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

	public Player getPlayer(String nick, String password) {
		Query query = getSession().createQuery(
				"from Person where nick = :nick and password = :password ");
		query.setParameter("nick", nick);
		return (Player) query.uniqueResult();
	}

	public Structure getStructure(int id) {
		Query query = getSession()
				.createQuery("from Structure where id = :id");
		query.setParameter("id", id);
		return (Structure) query.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	public List<Province> getRegions() {
		return getSession().createQuery("from Region").list();
	}

	public long count(Class<?> clazz) {
		Criteria criteria = getSession().createCriteria(clazz);
		criteria.setProjection(Projections.rowCount());
		return (Long) criteria.uniqueResult();
	}

}
