package automationtools.strings;

import java.io.File;

/**
 * @author Pad (02.04.2018)
 */
public class CommonsDictionaryKeysUpdater {

    public static void main(String[] args) {
        new StringUpdater(
                ".." + File.separator 
                        + ".." + File.separator 
                        + "commons" + File.separator 
                        + "src" + File.separator 
                        + "models" + File.separator 
                        + "DictionaryKeys.ts",
                "commons_dictionary_keys",
                "de"
        ).run();
    }
    
}
