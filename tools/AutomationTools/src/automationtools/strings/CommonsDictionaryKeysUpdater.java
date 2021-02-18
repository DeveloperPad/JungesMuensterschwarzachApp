package automationtools.strings;

import java.io.File;

/**
 * @author Pad (02.04.2018)
 */
public class CommonsDictionaryKeysUpdater {

    public static void main(String[] args) {
        new StringUpdater(
                "/workspace/project/commons/src/models/DictionaryKeys.ts",
                "commons_dictionary_keys",
                "de"
        ).run();
    }
    
}
