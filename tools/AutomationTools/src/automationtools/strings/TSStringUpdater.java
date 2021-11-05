package automationtools.strings;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 * @author Pad (03.11.2021)
 */
public class TSStringUpdater extends StringUpdater {

    public TSStringUpdater() throws Exception {
        super(
            "TS",
            new String[]{
                "/workspace/project/api/src/models/dict.ts",
                "/workspace/project/app/src/js/constants/dict.ts"
            }
        );
    }

    @Override
    protected String transformDictionary(JSONArray jsonDict) {
        StringBuilder sbDict = new StringBuilder();
        StringBuilder sbKeys = new StringBuilder();

        sbDict.append("/* eslint-disable */\r\n");
        sbDict.append("export class Dict {");

        sbKeys.append("\r\n\r\n");
        sbKeys.append("/* eslint-disable */\r\n");
        sbKeys.append("export class DictKeys {");

        for (int i = 0; i < jsonDict.size(); i++) {
            String identifier = ((JSONObject)jsonDict.get(i)).get("identifier").toString();
            String trans = ((JSONObject)jsonDict.get(i)).get(Main.LANG).toString();
            trans = trans.replaceAll("\r\n", "\\r\\n");

            sbDict.append("\r\n");
            sbDict.append("public static ");
            sbDict.append("\"").append(addSlashes(identifier)).append("\"");
            sbDict.append(" = ");
            sbDict.append("\"").append(addSlashes(trans)).append("\"");
            sbDict.append(";");

            sbKeys.append("\r\n");
            sbKeys.append("public static ");
            sbKeys.append("\"").append(addSlashes(identifier)).append("\"");
            sbKeys.append(" = ");
            sbKeys.append("\"").append(addSlashes(identifier)).append("\"");
            sbKeys.append(";");
        }

        sbDict.append("\r\n}");
        sbKeys.append("\r\n}");

        return sbDict.toString() + sbKeys.toString();
    }
    
}
