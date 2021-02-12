package automationtools.database;

import static automationtools.database.DatabaseUpdater.LOG_TAG;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Scanner;

/**
 *
 * @author Pad (31.08.2018)
 */
public class DatabaseAccess {

    private final DatabaseCredentials credentials;
    private Connection connection;
    private Statement statement;
    private ResultSet resultSet;
    
    public DatabaseAccess() {
        this.credentials = new DatabaseCredentials();
    }

    public DatabaseAccess(DatabaseCredentials credentials) {
        this.credentials = credentials;
    }

    private void setUp() throws SQLException {
        connection = DriverManager.getConnection(
                credentials.getUrl(),
                getCredentialProperties()
        );
    }

    private Properties getCredentialProperties() {
        Properties connectionProperties = new Properties();
        connectionProperties.put("user", credentials.getUser());
        connectionProperties.put("password", credentials.getPassword());
        connectionProperties.put("serverTimezone", credentials.getServerTimeZone());
        connectionProperties.put("useSSL", "false");
        return connectionProperties;
    }

    private void tearDown() {
        try {
            if (resultSet != null) {
                resultSet.close();
            }
            if (statement != null) {
                statement.close();
            }
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException ignored) {
        }
    }

    public int getCurrentDatabaseVersion() throws SQLException {
        try {
            setUp();

            statement = connection.createStatement();
            resultSet = statement.executeQuery(
                    "SELECT indexValue FROM indices WHERE indexType='database'"
            );
            resultSet.next();

            return resultSet.getInt("indexValue");
        } catch (SQLException e) {
            throw e;
        } finally {
            tearDown();
        }
    }

    private void setDatabaseVersion(int version) throws SQLException {
        try {
            setUp();

            statement = connection.createStatement();
            statement.execute(
                    "UPDATE indices SET indexValue=" + version
                    + " WHERE indexType='database'"
            );
        } catch (SQLException e) {
            throw e;
        } finally {
            tearDown();
        }
    }

    public void installDatabaseUpdates(
            int currentDatabaseVersion, int requiredDatabaseVersion)
            throws IOException, SQLException {
        if (currentDatabaseVersion + 1 == requiredDatabaseVersion) {
            System.out.println(
                    LOG_TAG + "Installing updates of version "
                    + requiredDatabaseVersion + ":"
            );
        } else {
            System.out.println(
                    LOG_TAG + "Installing updates of versions "
                    + (currentDatabaseVersion + 1) + " to "
                    + requiredDatabaseVersion + ":"
            );
        }

        int installedVersion = currentDatabaseVersion;
        int versionToInstall = installedVersion + 1;

        for (; versionToInstall <= requiredDatabaseVersion; versionToInstall++) {
            File updateScript = new File(
                    DatabaseUpdater.UPDATE_SCRIPT_DIR + File.separator
                    + versionToInstall + ".sql"
            );

            if (!updateScript.exists() || !updateScript.isFile()) {
                System.err.println("Update script '" 
                        + updateScript.getAbsolutePath() + "' is not a file!");
                break;
            }

            try {
                installUpdate(updateScript);
            } catch (SQLException e) {
                System.err.println("Error while installing script for update " 
                        + versionToInstall + ": " + e.getMessage());
                break;
            }

            installedVersion = versionToInstall;
            System.out.println(
                    LOG_TAG + "+ Installed updates of version " + installedVersion
            );
        }

        if (currentDatabaseVersion < installedVersion) {
            setDatabaseVersion(installedVersion);
        }

        if (installedVersion != requiredDatabaseVersion) {
            throw new IOException(
                    DatabaseUpdater.LOG_TAG + "Update script for version "
                    + versionToInstall + " not found or corrupted!"
            );
        } else {
            System.out.println(
                    LOG_TAG + "Database has been updated to version "
                    + installedVersion + "!"
            );
        }
    }

    private void installUpdate(File updateScript)
            throws SQLException, FileNotFoundException {
        List<Statement> statements = new ArrayList<>();

        try (Scanner scanner = new Scanner(updateScript, "UTF-8")) {
            setUp();
            scanner.useDelimiter("(;(\r)?\n)|(--\n)"); // separates sql statements
            connection.setAutoCommit(false); // begin of transaction

            while (scanner.hasNext()) {
                String rawStatement = scanner.next();

                if (rawStatement.startsWith("/*!") && rawStatement.endsWith("*/")) {
                    int i = rawStatement.indexOf(" ");
                    rawStatement = rawStatement.substring(
                            i + 1,
                            rawStatement.length() - " */".length()
                    );
                }

                if (rawStatement.trim().length() > 0) {
                    Statement batchStatement = connection.createStatement();
                    batchStatement.execute(rawStatement);
                    statements.add(batchStatement);
                }
            }

            connection.commit();
        } catch (FileNotFoundException | SQLException e) {
            connection.rollback();
            throw e;
        } finally {
            tearDown();

            statements.forEach(executedStatement -> {
                try {
                    executedStatement.close();
                } catch (SQLException ignored) {
                }
            });
        }
    }
    
    public void backUpDatabase(File backUpDirectory) throws Exception {
        try {
            Process runtimeProcess = Runtime.getRuntime().exec(
                "mysqldump"
                + " -u " + credentials.getUser()
                + " -p" + credentials.getPassword()
                + " " + credentials.getDatabase()
                + " -r " + escapePath(backUpDirectory.getPath())
                        + File.separator 
                        + escapePath(credentials.getDatabase()) 
                        + ".sql"
            );

            StringBuilder error = new StringBuilder();
            try (BufferedReader input = new BufferedReader(
                    new InputStreamReader(runtimeProcess.getErrorStream()))) {
                String line;
                while ((line = input.readLine()) != null) {
                    error.append(line);
                }
            }

            if (runtimeProcess.waitFor() != 0){
                throw new Exception(error.toString());
            }
        } catch (Exception exc) {
            throw new Exception("Database dump could not be created: " + exc.getMessage());
        }
    }
    
    private String escapePath(String path) {
        return path.replace(
                " ", 
                System.getProperty("os.name").toLowerCase().contains("win")?
                        "^ " : "\\ "
        );
    }

}
