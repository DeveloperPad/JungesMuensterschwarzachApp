import * as React from "react";

import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import { Browsers } from "../../constants/browsers";
import { Dict } from "../../constants/dict";
import { OperatingSystems } from "../../constants/operating-systems";
import { AppUrls } from "../../constants/specific-urls";
import { CustomTheme, grid5Style } from "../../constants/theme";
import { useNavigate } from "react-router";

type IBrowserListItemProps = WithTheme & {
    browser: Browsers;
    operatingSystem: OperatingSystems;
};

const BrowserListItem = (props: IBrowserListItemProps) => {
    const { browser, operatingSystem, theme } = props;
    const navigate = useNavigate();

    const browserIconPath =
        process.env.PUBLIC_URL + "/browsers/" + browser + ".png";
    const browserInstallationDetailsPagePath =
        AppUrls.INSTALLATION + "/" + operatingSystem + "/" + browser;

    const openInstallationDetailsPage = (): void => {
        navigate(browserInstallationDetailsPagePath);
    };

    return (
        <Card
            onClick={openInstallationDetailsPage}
            style={{
                backgroundColor: CustomTheme.COLOR_BODY_INNER,
                cursor: "pointer",
                display: "flex",
                marginBottom: theme.spacing(),
                width: "100%",
            }}
        >
            <div
                style={{
                    ...grid5Style,
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <CardMedia
                    component="img"
                    src={browserIconPath}
                    style={{
                        height: "90%",
                        objectFit: "contain",
                        width: "90%",
                    }}
                />
            </div>
            <CardContent
                style={{
                    flex: 12,
                    margin: "auto",
                    width: "90%",
                }}
            >
                <Typography color="primary" variant="h5">
                    {Dict["installation_browser_" + browser]}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default withTheme(BrowserListItem);
