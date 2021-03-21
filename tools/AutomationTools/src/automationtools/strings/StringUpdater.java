package automationtools.strings;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.apache.commons.text.StringEscapeUtils;

/**
 * @author Pad (02.04.2018)
 */
public class StringUpdater {

    private static final String ENDPOINT_STRINGS
            = "http://172.16.1.241/endpoints/strings.php";
    private static final String ENCODING = StandardCharsets.UTF_8.displayName();

    private final String destination;
    private final String mode;
    private final String language;

    public StringUpdater(String destination, String mode, String language) {
        this.destination = destination;
        this.mode = mode;
        this.language = language;
    }

    public void run() {
        System.out.println("-- Starting string update for:");
        System.out.println("---- Destination: " + destination);
        System.out.println("---- Mode: " + mode);
        System.out.println("---- Language: " + language);
        downloadDictionary();
        System.out.println("-- Finished string update!\n");
    }

    private void downloadDictionary() {
        InputStream in = null;
        OutputStream out = null;

        try {
            URL source = new URL(ENDPOINT_STRINGS
                    + "?mode=" + URLEncoder.encode(mode, ENCODING)
                    + "&language=" + URLEncoder.encode(language, ENCODING));
            in = source.openStream();
            out = new FileOutputStream(destination);
            BufferedReader inR = new BufferedReader(new InputStreamReader(in));
            BufferedWriter outW = new BufferedWriter(new OutputStreamWriter(out));
            String line;

            while ((line = inR.readLine()) != null) {
                outW.write(StringEscapeUtils.unescapeXml(line));
                outW.newLine();
            }
            outW.flush();
        } catch (IOException ioExc) {
            ioExc.printStackTrace();
            System.exit(1);
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (IOException ioExc) {
                ioExc.printStackTrace();
            }

            try {
                if (out != null) {
                    out.close();
                }
            } catch (IOException ioExc) {
                ioExc.printStackTrace();
            }
        }
    }

}
