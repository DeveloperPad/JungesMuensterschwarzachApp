package automationtools.strings;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 * @author Pad (03.11.2021)
 */
public class JSStringUpdater extends StringUpdater {

    public JSStringUpdater() throws Exception {
        super(
            "JS",
            new String[]{
                "dict.js"
                // "/workspace/project/app/public/js/dict.js"
            }
        );
    }

    @Override
    protected String transformDictionary(JSONArray jsonDict) {
        StringBuilder sb = new StringBuilder();

        sb.append("const dict = {");
        for (int i = 0; i < jsonDict.size(); i++) {
            String identifier = ((JSONObject)jsonDict.get(i)).get("identifier").toString();
            String trans = ((JSONObject)jsonDict.get(i)).get(LANG).toString();

            trans = trans.replaceAll("\r\n", "\\\\\r\n");
            sb.append("\r\n");
            sb.append("\"").append(addSlashes(identifier)).append("\"");
            sb.append(": ");
            sb.append("\"").append(addSlashes(trans)).append("\"");
            
            if (i < jsonDict.size()-1) {
                sb.append(",");
            }
        }
        sb.append("\r\n};\r\n");
        sb.append("self.Dict = dict;");

        return sb.toString();
    }
    
}
