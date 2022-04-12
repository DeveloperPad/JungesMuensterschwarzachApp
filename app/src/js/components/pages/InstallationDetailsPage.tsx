import * as React from "react";
import { useLocation, useNavigate } from "react-router";

import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import { Browsers } from "../../constants/browsers";
import { Dict } from "../../constants/dict";
import { OperatingSystems } from "../../constants/operating-systems";
import { AppUrls } from "../../constants/specific-urls";
import {
    grid2Style,
    grid5Style,
    gridHorizontalStyle,
} from "../../constants/theme";
import Background from "../utilities/Background";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";

type IInstallationDetailsPageProps = WithTheme;

const InstallationDetailsPage = (props: IInstallationDetailsPageProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = props;

    const paragraphStyle: React.CSSProperties = React.useMemo(
        () => ({
            marginBottom: theme.spacing(2),
        }),
        [theme]
    );
    const imgGridStyle: React.CSSProperties = React.useMemo(
        () => ({
            ...grid2Style,
            marginLeft: theme.spacing(2),
        }),
        [theme]
    );
    const imgStyle: React.CSSProperties = React.useMemo(
        () => ({
            height: "100%",
            objectFit: "contain",
            width: "100%",
        }),
        []
    );

    const getOS = React.useCallback((os: string): string => {
        for (const operatingSystem in OperatingSystems) {
            if (
                OperatingSystems[operatingSystem].toLowerCase() ===
                os.toLowerCase()
            ) {
                return OperatingSystems[operatingSystem];
            }
        }

        navigate(AppUrls.INSTALLATION);
        return "";
    }, [navigate]);
    const getBrowser = React.useCallback((br: string): string => {
        for (const browser in Browsers) {
            if (Browsers[browser].toLowerCase() === br.toLowerCase()) {
                return Browsers[browser];
            }
        }

        navigate(AppUrls.INSTALLATION);
        return "";
    }, [navigate]);
    const getOSBrowser = React.useCallback(() => {
        const pathParts = location.pathname
            .slice((AppUrls.INSTALLATION + "/").length)
            .split("/");

        if (pathParts.length < 2) {
            navigate(AppUrls.INSTALLATION);
            return;
        }

        return {
            os: getOS(pathParts[0]),
            browser: getBrowser(pathParts[1]),
        };
    }, [getBrowser, getOS, location.pathname, navigate]);
    const { os, browser } = getOSBrowser();
    const dictionaryEntry: string = "installation_" + os + "_" + browser;
    const paragraph: string = Dict[dictionaryEntry] ?? Dict.installation_os_browser_incompatible;

    return (
        <Background theme={theme}>
            <Card>
                <CardHeader
                    title={Dict.installation_heading}
                    subheader={
                        Dict["installation_os_" + os] +
                        Dict.separator_hyphen +
                        Dict["installation_browser_" + browser]
                    }
                />
                <CardContent>
                    <Grid style={gridHorizontalStyle}>
                        <GridItem style={grid5Style}>
                            <Typography style={paragraphStyle}>
                                {paragraph}
                            </Typography>
                        </GridItem>
                        <GridItem style={imgGridStyle}>
                            <img
                                src={
                                    process.env.PUBLIC_URL +
                                    "/browsers/" +
                                    browser +
                                    ".png"
                                }
                                style={imgStyle}
                                alt=""
                            />
                        </GridItem>
                    </Grid>
                </CardContent>
            </Card>
        </Background>
    );
};

export default withTheme(InstallationDetailsPage);
