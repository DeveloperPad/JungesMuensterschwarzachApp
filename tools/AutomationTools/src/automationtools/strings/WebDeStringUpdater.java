package automationtools.strings;

import java.io.File;

/**
 * @author Pad (02.04.2018)
 */
public class WebDeStringUpdater {

    public static void main(String[] args) {
        new StringUpdater(
                "/workspace/project/webservice/assets/dict.php",
                "php",
                "de"
        ).run();
        new StringUpdater(
                "/workspace/project/webservice/js/dict.js",
                "js",
                "de"
        ).run();
    }
    
}
