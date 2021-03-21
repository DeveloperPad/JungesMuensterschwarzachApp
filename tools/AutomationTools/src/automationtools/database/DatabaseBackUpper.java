package automationtools.database;

import java.io.File;

import org.apache.commons.io.FileUtils;

import automationtools.utils.ShellUtils;

/**
 *
 * @author Pad (16.10.2019)
 */
public class DatabaseBackUpper {

    public static final String LOG_TAG = "[DB-Backup] ";
    public static final String BACKUP_PATH = "backup";
    public static final String IMAGE_DIRECTORY = "storedImages";

    public static void main(String[] args) throws Exception {
        if (System.getenv("JMA_BUILD_TYPE") == "local") {
            System.out.println(LOG_TAG + "Skipping local database backup!");
            System.exit(0);
        }
        
        System.out.println(LOG_TAG + "Starting database backup!");

        setGitAuthor();
        checkoutBackUpDirectory();
        cleanBackUpDirectory();

        backUpDatabase();
        backUpImages();

        commitBackUpDirectory();
        pushBackUpDirectory();

        System.out.println(LOG_TAG + "Finished database backup!");
    }

    private static void setGitAuthor() throws Exception {
        try {
            ShellUtils.executeShell(
                new String[] {
                    "git",
                    "config",
                    "--system",
                    "user.email",
                    "lucas@luckev.info"
                }
            );
            ShellUtils.executeShell(
                new String[] {
                    "git",
                    "config",
                    "--system",
                    "user.name",
                    "Lucas Kinne"
                }
            );
        } catch (Exception exc) {
            throw new Exception(
                "Could not set git author information: " + exc.getMessage()
            );
        }
    }

    private static void checkoutBackUpDirectory() throws Exception {
        try {
            System.out.println(LOG_TAG + "* Checking out backup repository!");
            FileUtils.deleteDirectory(new File(BACKUP_PATH));
            ShellUtils.executeShell(
                new String[] {
                    "git",
                    "clone",
                    "--branch",
                    System.getenv("JMA_BUILD_TYPE"),
                    RepositoryCredentials.getInstance().getRepository(),
                    BACKUP_PATH
                }
            );
            System.out.println(
                LOG_TAG + "* Checked out '" 
                + System.getenv("JMA_BUILD_TYPE") 
                + "' backup repository!"
            );
        } catch (Exception exc) {
            throw new Exception(
                "Could not check out backup repository: " + exc.getMessage()
            );
        }
    }

    private static void cleanBackUpDirectory() throws Exception {
        File backUpDirectory = new File(BACKUP_PATH);
        System.out.println(
                LOG_TAG + "* Cleaning backup directory..."
        );
        cleanBackUpDirectory(backUpDirectory, true);
        System.out.println(
                LOG_TAG + "* Cleaned backup directory..."
        );
    }

    private static void cleanBackUpDirectory(File backUpDirectory, boolean isRoot) 
            throws Exception {
        if (backUpDirectory == null || !backUpDirectory.exists()) {
            return;
        }

        File[] files = backUpDirectory.listFiles();

        if (files != null) {
            for (File f : files) {
                if (f.getName().startsWith(".")) {
                    continue;
                }

                if (f.isDirectory()) {
                    cleanBackUpDirectory(f, false);
                } else {
                    f.delete();
                }
            }
        }

        if (!isRoot && (backUpDirectory.listFiles() == null
                || backUpDirectory.listFiles().length == 0)) {
            backUpDirectory.delete();
        }
    }

    private static void backUpDatabase() throws Exception {
        System.out.println(
                LOG_TAG + "* Backing up database..."
        );
        DatabaseAccess dao = new DatabaseAccess();
        dao.backUpDatabase(new File(BACKUP_PATH));
        System.out.println(
                LOG_TAG + "* Backed up database."
        );
    }

    private static void backUpImages() throws Exception {
        System.out.println(
                LOG_TAG + "* Backing up images..."
        );
        FileUtils.copyDirectory(
            new File(IMAGE_DIRECTORY), 
            new File(BACKUP_PATH + File.separator + IMAGE_DIRECTORY)
        );
        System.out.println(
                LOG_TAG + "* Backed up images."
        );
    }

    private static void commitBackUpDirectory() throws Exception {
        System.out.println(
                LOG_TAG + "* Committing files..."
        );
        ShellUtils.executeShell(
            new String[] {
                "git",
                "add",
                "-A",
            },
            BACKUP_PATH
        );
        ShellUtils.executeShell(
            new String[] {
                "git",
                "commit",
                "-m",
                "Automatic Backup",
                "--author",
                "Lucas Kinne <lucas@luckev.info>"
            },
            BACKUP_PATH
        );
        System.out.println(
                LOG_TAG + "* Comitted files."
        );
    }

    private static void pushBackUpDirectory() throws Exception {
        System.out.println(
                LOG_TAG + "* Pushing backup..."
        );
        ShellUtils.executeShell(
            new String[] {
                "git",
                "push",
                "origin",
                System.getenv("JMA_BUILD_TYPE")
            },
            BACKUP_PATH
        );
        System.out.println(
                LOG_TAG + "* Pushed '" + System.getenv("JMA_BUILD_TYPE") + "' backup."
        );
    }

}
