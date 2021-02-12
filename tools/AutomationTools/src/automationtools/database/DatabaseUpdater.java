package automationtools.database;

import java.io.File;
import java.io.FilenameFilter;

/**
 *
 * @author Pad (31.08.2018)
 */
public class DatabaseUpdater {
    
    public static final String UPDATE_SCRIPT_DIR = 
            ".." + File.separator 
            + "database_update_scripts";
    public static final String LOG_TAG = "[DB-Update] ";

    public static void main(String[] args) throws Exception {
        System.out.println(
                LOG_TAG + "Starting database update!"
        );
        DatabaseAccess dao = new DatabaseAccess();
        int currentDatabaseVersion = dao.getCurrentDatabaseVersion();
        int requiredDatabaseVersion = getRequiredDatabaseVersion();
        
        System.out.println(
                LOG_TAG + "* Current database version is: " 
                        + currentDatabaseVersion
        );
        System.out.println(
                LOG_TAG + "* Required database version is: " 
                        + requiredDatabaseVersion
        );
        
        if (currentDatabaseVersion < requiredDatabaseVersion) {
            System.out.println(
                    LOG_TAG + "Database updates required!"
            );
            dao.installDatabaseUpdates(currentDatabaseVersion, requiredDatabaseVersion);
        } else {
            System.out.println(
                    LOG_TAG + "Database is up to date, hence no update required!"
            );
        }
    }
    
    private static int getRequiredDatabaseVersion() {
        File databaseUpdateScriptFolder = new File(UPDATE_SCRIPT_DIR);
        FilenameFilter filter = (File dir, String name) -> 
                name.toLowerCase().endsWith(".sql");
        int requiredDatabaseVersion = 0;
        
        for (File databaseUpdateScript : databaseUpdateScriptFolder.listFiles(filter)) {
            try {
                int scriptVersion = Integer.parseInt(
                        databaseUpdateScript.getName().split("\\.")[0]
                );
                if (requiredDatabaseVersion < scriptVersion) {
                    requiredDatabaseVersion = scriptVersion;
                }
            } catch (NumberFormatException ignored) {
            }
        }
               
        return requiredDatabaseVersion;
    }

}
