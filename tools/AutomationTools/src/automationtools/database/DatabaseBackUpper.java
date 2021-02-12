package automationtools.database;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 * @author Pad (16.10.2019)
 */
public class DatabaseBackUpper {

    public static final String LOG_TAG = "[DB-Backup] ";
    public static final String BACKUP_REPOSITORY
            = ".." + File.separator
            + ".." + File.separator
            + ".." + File.separator
            + "backup" + File.separator;
    public static final String IMAGE_DIRECTORY
            = ".." + File.separator
            + ".." + File.separator
            + "webservice" + File.separator
            + "backup" + File.separator;

    public static void main(String[] args) throws Exception {
        System.out.println(
                LOG_TAG + "Starting database backup!"
        );

        File backUpDirectory = new File(BACKUP_REPOSITORY);
        if (backUpDirectory.exists()) {
            System.out.print(
                    LOG_TAG + "* Cleaning backup directory... "
            );
            cleanBackUpDirectory(backUpDirectory, true);
        } else {
            System.out.print(
                    LOG_TAG + "* Creating backup directory... "
            );
            backUpDirectory.mkdirs();
        }
        System.out.println(
                "Done!"
        );

        System.out.print(
                LOG_TAG + "* Backing up database... "
        );
        DatabaseAccess dao = new DatabaseAccess();
        dao.backUpDatabase(backUpDirectory);
        System.out.println(
                "Done!"
        );

        System.out.print(
                LOG_TAG + "* Backing up images... "
        );
        if (args.length < 2) {
            throw new Exception("Image directory not specified!");
        }
        File imageDirectory = new File(args[1]);
        backUpImages(
                new File(
                        backUpDirectory.getAbsolutePath()
                        + File.separator
                        + "storedImages"
                ),
                imageDirectory
        );
        System.out.println(
                "Done!"
        );
    }

    private static void cleanBackUpDirectory(File backUpDirectory, boolean isRoot) {
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

    private static void backUpImages(File backUpDirectory, File imageDirectory)
            throws Exception {
        if (!imageDirectory.exists()) {
            return;
        }

        List<Path> sources = Files
                .walk(imageDirectory.toPath())
                .collect(Collectors.toList());

        for (Path source : sources) {
            Files.copy(
                    source,
                    backUpDirectory.toPath().resolve(
                            imageDirectory.toPath().relativize(source)
                    ),
                    StandardCopyOption.REPLACE_EXISTING
            );
        }
    }

}
