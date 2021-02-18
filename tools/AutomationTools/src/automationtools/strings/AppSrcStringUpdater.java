package automationtools.strings;

import java.io.File;

/**
 * @author Pad (02.04.2018)
 */
public class AppSrcStringUpdater {

    public static void main(String[] args) {
        new StringUpdater(
                "/workspace/project/app/src/js/constants/dict.ts",
                "app_src",
                "de"
        ).run();
    }
    
}
