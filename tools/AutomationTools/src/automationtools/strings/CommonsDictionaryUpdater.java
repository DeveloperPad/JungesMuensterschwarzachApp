package automationtools.strings;

import java.io.File;

/**
 * @author Pad (02.04.2018)
 */
public class CommonsDictionaryUpdater {

    public static void main(String[] args) {
        new StringUpdater(
                "/workspace/project/commons/src/models/Dictionary.ts",
                "commons_dictionary",
                "de"
        ).run();
    }
    
}
