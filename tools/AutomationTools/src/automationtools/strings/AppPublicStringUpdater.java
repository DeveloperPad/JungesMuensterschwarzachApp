package automationtools.strings;

import java.io.File;

/**
 * @author Pad (02.04.2018)
 */
public class AppPublicStringUpdater {

    public static void main(String[] args) {
        new StringUpdater(
                "/workspace/project/app/public/js/dict.js",
                "app_public",
                "de"
        ).run();
    }
    
}
