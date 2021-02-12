package automationtools.strings;

import java.io.File;

/**
 * @author Pad (02.04.2018)
 */
public class WebDeStringUpdater {

    public static void main(String[] args) {
        new StringUpdater(
                ".." + File.separator 
                        + ".." + File.separator 
                        + "webservice" + File.separator 
                        + "assets" + File.separator 
                        + "dict.php",
                "php",
                "de"
        ).run();
        new StringUpdater(
                ".." + File.separator 
                        + ".." + File.separator 
                        + "webservice" + File.separator 
                        + "js" + File.separator 
                        + "dict.js",
                "js",
                "de"
        ).run();
    }
    
}
