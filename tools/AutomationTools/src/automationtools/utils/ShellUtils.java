package automationtools.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

/**
 *
 * @author Pad (16.02.2021)
 */
public class ShellUtils {

    public static void executeShell(String[] cmd) throws Exception {
        executeShell(cmd, null);
    }

    public static void executeShell(String[] cmd, String dir) throws Exception {
        Process proc = Runtime.getRuntime().exec(
            cmd,
            new String[0],
            new File(dir != null ? dir : ".")
        );
        int result = proc.waitFor();

        if (result != 0) {
            StringBuilder sB = new StringBuilder();
            BufferedReader stdError = new BufferedReader(
                new InputStreamReader(proc.getErrorStream())
            );
            String line = null;

            while ((line = stdError.readLine()) != null) {
                sB.append(line);
            }

            throw new Exception(sB.toString());
        }
    }

}