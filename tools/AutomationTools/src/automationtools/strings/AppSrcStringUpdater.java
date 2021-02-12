package automationtools.strings;

import java.io.File;

/**
 * @author Pad (02.04.2018)
 */
public class AppSrcStringUpdater {

    public static void main(String[] args) {
        new StringUpdater(
                ".." + File.separator 
                        + ".." + File.separator 
                        + "app" + File.separator 
                        + "src" + File.separator 
                        + "js" + File.separator 
                        + "constants" + File.separator 
                        + "dict.ts",
                "app_src",
                "de"
        ).run();
    }
    
}
