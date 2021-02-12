package automationtools.strings;

import java.io.File;

/**
 * @author Pad (02.04.2018)
 */
public class AppPublicStringUpdater {

    public static void main(String[] args) {
        new StringUpdater(
                ".." + File.separator 
                        + ".." + File.separator 
                        + "app" + File.separator 
                        + "public" + File.separator 
                        + "js" + File.separator
                        + "dict.js",
                "app_public",
                "de"
        ).run();
    }
    
}
