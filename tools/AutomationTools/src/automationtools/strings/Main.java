package automationtools.strings;

import java.io.File;
import java.io.FilenameFilter;

/**
 * @author Pad (03.11.2021)
 */
public class Main {

    private static final String DIR = "./tools/AutomationTools/src/automationtools/strings";
    
    public static void main(String[] args) {
        File[] updaters = new File(DIR).listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return name.matches(".{1,}StringUpdater.java");
            }
        });

        for (File updater : updaters) {
            String className = updater.getName().split("\\.")[0];
            try {
                Class<?> clazz = Class.forName("automationtools.strings."+className);
                clazz.getDeclaredConstructor().newInstance();
            } catch (Exception exc) {
                exc.printStackTrace();
            }
        }
    }
    
}
