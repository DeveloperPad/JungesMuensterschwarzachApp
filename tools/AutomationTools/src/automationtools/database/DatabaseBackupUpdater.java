package automationtools.database;

/**
 *
 * @author Pad (14.02.2021)
 */
public class DatabaseBackupUpdater {

    public static void main(String[] args) throws Exception {
        DatabaseBackUpper.main(args);
        DatabaseUpdater.main(args);
    }

}
