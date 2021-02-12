package automationtools.database;

import java.io.File;
import java.io.FileReader;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 *
 * @author Pad (31.08.2018)
 */
public class DatabaseCredentials {

    private String url;
    private String user;
    private String password;
    private String serverTimeZone;

    public DatabaseCredentials() {
        JSONParser parser = new JSONParser();
        String secretsDir = System.getenv("JMA_SECRETS");
        String databaseConfigPath = secretsDir + File.separator
                + "database.json";
        String serverConfigPath = secretsDir + File.separator
                + "server.json";
        
        if (secretsDir == null) {
            System.err.println("Environment variable 'JMA_SECRETS' is not set!");
        }
        
        try (
                FileReader databaseConfigReader = new FileReader(databaseConfigPath);
                FileReader serverConfigReader = new FileReader(serverConfigPath)
            ) {
            JSONObject databaseConfig = (JSONObject) parser.parse(databaseConfigReader);
            JSONObject serverConfig = (JSONObject) parser.parse(serverConfigReader);
            
            this.url = (String) databaseConfig.get("jdbc_url");
            this.user = (String) databaseConfig.get("username");
            this.password = (String) databaseConfig.get("password");
            this.serverTimeZone = (String) serverConfig.get("timezone");
        } catch (Exception exc) {
            System.err.println("Database config file does not exist"
                    + "or could not be parsed correctly!");
            exc.printStackTrace();
        }
    }
    
    public String getUrl() {
        return url;
    }
    
    public String getUser() {
        return user;
    }
    
    public String getPassword() {
        return password;
    }
    
    public String getDatabase() {
        return url.substring(url.lastIndexOf("/") + 1);
    }
    
    public String getServerTimeZone() {
        return serverTimeZone;
    }

}
