package friends;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.PreparedStatement;
import com.mysql.jdbc.Statement;

import auth.AuthUtils;
import database.DataBaseUtils;

public class FriendsUtils {
	
	/**
	 * Add a a new friendship to the database. 
	 * @param fromId user id
	 * @param toId friend id
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	
	public static void addFriendToDatabase(int fromId, int toId)
			throws InstantiationException, IllegalAccessException,
			ClassNotFoundException, SQLException {
				
		Timestamp date = new Timestamp(System.currentTimeMillis());				

		String sql = "INSERT INTO `friends` "
				+ "(`from`, `to`, `date`)" + " VALUE(?,?,?)";
		
		Connection connection = DataBaseUtils.getMySQLConnection();
		PreparedStatement ps = (PreparedStatement) connection.prepareStatement(sql);

		ps.setInt(1, fromId);
		ps.setInt(2, toId);
		ps.setTimestamp(3, date);

		ps.executeUpdate();

		ps.close();
		connection.close();

		System.out.println("Friend added from : " + fromId + " to : " + toId);

	}
	
	/** 
	 * Remove existing friendship for the database.
	 * @param userKey
	 * @param friendLogin
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */

	public static void removeFriendFromDatabase(int fromId, int toId)
			throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException {			
		
		String sql = "DELETE FROM `friends` WHERE `from`=" + fromId 
				+ " AND `to`=" + toId;

		Connection connection = DataBaseUtils.getMySQLConnection();
		Statement st = (Statement) connection.createStatement();
		
		st.executeUpdate(sql);
		
		System.out.println("Friend removed to : " + toId + " from : " + fromId);
		
		st.close();
		connection.close();	

	}
	
	/**
	 * Returns a list of friends for this user.
	 * @param id id
	 * @return a list of friends for this user
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	public static List<JSONObject> getFriendsForUserId(int id)
			throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException, JSONException{
		
		String sql = "SELECT `to` FROM `friends` where `from` = ?";
		List<JSONObject> friendList = new ArrayList<JSONObject>();
		
		Connection connection = DataBaseUtils.getMySQLConnection();
		PreparedStatement ps = (PreparedStatement) connection.prepareStatement(sql);
		
		ps.setInt(1, id);
		ResultSet rs = ps.executeQuery();
						
		while(rs.next()){
			
			int friendId = rs.getInt("to");
			
			JSONObject friend = new JSONObject().put("id", friendId).put("login", AuthUtils.getUserLoginFromId(friendId));					
			
			friendList.add(friend);
		}		
		return friendList;
	}
	
	/**
	 * Tests if the two users are already friends.
	 * @param fromId user id
	 * @param toId friend id
	 * @return true | false
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	
	public static boolean alreadyFriends(int fromId, int toId)
			throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		
		String sql = "SELECT * FROM `friends` WHERE `from` = ? AND `to` = ?";
		boolean areFriends = true;
		
		Connection connection = DataBaseUtils.getMySQLConnection();
		PreparedStatement ps = (PreparedStatement) connection.prepareStatement(sql);
		
		ps.setInt(1, fromId);
		ps.setInt(2, toId);
		
		ResultSet rs = ps.executeQuery();
		
		if (!rs.next()){
			areFriends = false;
		}
		
		return areFriends;
	}		
}
