import * as React from 'react';
import { useNavigate } from 'react-router';

import { Card, CardContent, CardMedia, Typography, withTheme, WithTheme } from '@mui/material';

import { Browsers } from '../../constants/browsers';
import { Dict } from '../../constants/dict';
import { OperatingSystems } from '../../constants/operating-systems';
import { AppUrls } from '../../constants/specific-urls';
import { CustomTheme, grid5Style } from '../../constants/theme';

type IBrowserListItemProps = WithTheme & {
    browser: Browsers;
    operatingSystem: OperatingSystems;
};

const BrowserListItem = (props: IBrowserListItemProps) => {
    const navigate = useNavigate();
    const { browser, operatingSystem, theme } = props;

    const browserIconPath = React.useMemo(() => process.env.PUBLIC_URL + "/browsers/" + browser + ".png", [browser]);
    const browserInstallationDetailsPagePath = React.useMemo(() => AppUrls.INSTALLATION + "/" + operatingSystem + "/" + browser, [browser, operatingSystem]);

    return (
        <Card
            onClick={navigate.bind(this, browserInstallationDetailsPagePath)}
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
