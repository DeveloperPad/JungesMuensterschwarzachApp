import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, CardHeader, Typography, withTheme, WithTheme } from '@material-ui/core';

import { Browsers } from '../../constants/browsers';
import Dict from '../../constants/dict';
import { OperatingSystems } from '../../constants/operating-systems';
import { AppUrls } from '../../constants/specific-urls';
import { grid2Style, grid5Style, gridHorizontalStyle } from '../../constants/theme';
import Background from '../utilities/Background';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';

type IInstallationDetailsPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

class InstallationDetailsPage extends React.Component<IInstallationDetailsPageProps> {

    private paragraphStyle: React.CSSProperties = {
        marginBottom: this.props.theme.spacing(2)
    }
    private imgGridStyle: React.CSSProperties = {
        ...grid2Style,
        marginLeft: this.props.theme.spacing(2)
    }

    private operatingSystem: string;
    private browser: string;

    public constructor(props: IInstallationDetailsPageProps) {
        super(props);

        this.initialize();
    }

    public render(): React.ReactNode {
        const dictionaryEntry: string = "installation_" + this.operatingSystem + "_" + this.browser;
        const paragraph: string = Dict.hasOwnProperty(dictionaryEntry) ? Dict[dictionaryEntry] : Dict.installation_os_browser_incompatible;

        return (
            <Background theme={this.props.theme}>
                <Card>
                    <CardHeader
                        title={Dict.installation_heading}
                        subheader={Dict["installation_os_" + this.operatingSystem]
                            + Dict.separator_hyphen + Dict["installation_browser_" + this.browser]} />
                    <CardContent>
                        <Grid style={gridHorizontalStyle}>
                            <GridItem style={grid5Style}>
                                <Typography style={this.paragraphStyle}>
                                    {paragraph}
                                </Typography>
                            </GridItem>
                            <GridItem style={this.imgGridStyle}>
                                <img src={process.env.PUBLIC_URL + "/browsers/" + this.browser + ".png"} style={imgStyle} alt="" />
                            </GridItem>
                        </Grid>
                    </CardContent>
                </Card>
            </Background>
        );
    }

    private initialize = (): void => {
        const pathParts = this.props.location.pathname.slice((AppUrls.INSTALLATION + "/").length).split("/");

        if (pathParts.length < 2) {
            this.props.history.push(
                AppUrls.INSTALLATION
            );
            return;
        }

        this.operatingSystem = this.getOperatingSystem(pathParts[0]);
        this.browser = this.getBrowser(pathParts[1]);
    }

    private getOperatingSystem = (os: string): string => {
        for (const operatingSystem in OperatingSystems) {
            if (OperatingSystems[operatingSystem].toLowerCase() === os.toLowerCase()) {
                return OperatingSystems[operatingSystem];
            }
        }

        this.props.history.push(
            AppUrls.INSTALLATION
        );
        return "";
    }

    private getBrowser = (br: string): string => {
        for (const browser in Browsers) {
            if (Browsers[browser].toLowerCase() === br.toLowerCase()) {
                return Browsers[browser];
            }
        }

        this.props.history.push(
            AppUrls.INSTALLATION
        );
        return "";
    }

}

export default withTheme(withRouter(InstallationDetailsPage));

const imgStyle: React.CSSProperties = {
    height: "100%",
    objectFit: "contain",
    width: "100%"
}