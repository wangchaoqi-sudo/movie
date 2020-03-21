package recommend
import java.sql.{Connection, DriverManager, PreparedStatement}
import org.apache.spark.sql.{DataFrame, Row, SQLContext}

object DeleteFromMySQL {

  val url = "jdbc:mysql://wangchaoqi01:3306/movierecommend?useUnicode=true&characterEncoding=UTF-8&useSSL=false"
  val prop = new java.util.Properties
  prop.setProperty("user", "root")
  prop.setProperty("password", "root")
  def delete(userid:Int): Unit = {
    var conn: Connection = null
    var ps: PreparedStatement = null
    val sql = "delete from recommendresult where userid="+userid
    conn = DriverManager.getConnection(url,prop)
    ps = conn.prepareStatement(sql)
    ps.executeUpdate()

    if (ps != null) {
      ps.close()
    }
    if (conn != null) {
      conn.close()
    }
  }

}