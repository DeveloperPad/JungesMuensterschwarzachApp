package automationtools.database;

import java.io.File;
import java.io.FileReader;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 *
 * @author Pad (14.02.2021)
 */
public class RepositoryCredentials {

    public static RepositoryCredentials instance;

    private String repository;

    private RepositoryCredentials() throws Exception {
        JSONParser parser = new JSONParser();
        String secretsDir = System.getenv("JMA_SECRETS");
        if (secretsDir == null) {
            secretsDir = "/var/data/secrets/jma";
        }
        String repositoryConfigPath = secretsDir + File.separator + "backup.json";

        try (FileReader backupConfigReader = new FileReader(repositoryConfigPath)) {
            JSONObject backupConfig = (JSONObject) parser.parse(backupConfigReader);

            this.repository = (String) backupConfig.get("repository");
        } catch (Exception exc) {
            throw new Exception("Could not read repository secrets file: " + exc.getMessage());
        }
    }

    public static RepositoryCredentials getInstance() throws Exception {
        if (instance == null) {
            instance = new RepositoryCredentials();
        }

        return instance;
    }

    public String getRepository() {
        return this.repository;
    }

}
