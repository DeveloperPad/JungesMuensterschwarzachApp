package automationtools.strings;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 * @author Pad (03.11.2021)
 */
public class PHPStringUpdater extends StringUpdater {

    public PHPStringUpdater() throws Exception {
        super(
            "PHP", 
            new String[]{
                "dict.php"
            }
        );
        // super("/workspace/project/webservice/assets/dict.php");
    }

    @Override
    protected String transformDictionary(JSONArray jsonDict) {
        StringBuilder sb = new StringBuilder();

        sb.append("<?php $dict = array(");
        for (int i = 0; i < jsonDict.size(); i++) {
            String identifier = ((JSONObject)jsonDict.get(i)).get("identifier").toString();
            String trans = ((JSONObject)jsonDict.get(i)).get(LANG).toString();

            trans = trans.replaceAll("\r\n", "<br/>");
            sb.append("\r\n");
            sb.append("\"").append(addSlashes(identifier)).append("\"");
            sb.append(" => ");
            sb.append("\"").append(addSlashes(trans)).append("\"");
            
            if (i < jsonDict.size()-1) {
                sb.append(",");
            }
        }
        sb.append("\r\n); ?>");

        return sb.toString();
    }
    
}
