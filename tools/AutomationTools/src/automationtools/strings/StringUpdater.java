package automationtools.strings;

import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 * @author Pad (02.11.2021)
 */
public abstract class StringUpdater {

    protected static final String LANG = "de";
    private static final String ENDPOINT_STRINGS = "http://localhost:3000/strings/"+LANG;

    private final String language;
    private final String[] destinations;

    public StringUpdater(String language, String[] destinations) throws Exception {
        this.language = language.toUpperCase();
        this.destinations = destinations;
        this.run();
    }

    private void run() throws Exception {
        System.out.println("String update for language: " + this.language);
        System.out.println("-- Download (REST --> JSON)");
        JSONArray jsonDict = this.downloadDictionary();
        System.out.println("-- Transform (JSON --> "+this.language+")");
        String langDict = this.transformDictionary(jsonDict);
        System.out.println("-- Writing ("+this.language+" --> FILES)");
        for (String destination : destinations) {
            this.writeDictionary(destination, langDict);
            System.out.println("----> " + destination);
        }
    }

    private JSONArray downloadDictionary() throws Exception {
        try (BufferedReader inR = new BufferedReader(new InputStreamReader(
            new URL(ENDPOINT_STRINGS).openStream()
        ))) {
            StringBuilder builder = new StringBuilder();

            String line = null;
            while ((line = inR.readLine()) != null) {
                builder.append(line);
            }

            JSONParser parser = new JSONParser();
            try {
                return (JSONArray)parser.parse(builder.toString());
            } catch (Exception jsonExc) {
                JSONObject jsonObj = (JSONObject)((JSONObject)parser.parse(builder.toString())).get("error");

                throw new IOException(
                    jsonObj.get("name").toString() + " - " + jsonObj.get("message").toString()
                );
            }
        }
    }

    protected abstract String transformDictionary(JSONArray jsonDict);

    private void writeDictionary(String file, String langDict) {
        try (OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream(file))) {
            out.write(langDict);
            out.flush();
        } catch (IOException ioExc) {
            ioExc.printStackTrace();
            System.exit(1);
        }
    }

    protected static String addSlashes(String s) {
        return s.replaceAll("\"", "\\\\\"").replaceAll("\'", "\\\\\'");
    }

}
