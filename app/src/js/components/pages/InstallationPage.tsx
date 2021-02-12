import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import {
    Accordion, AccordionDetails, AccordionSummary, Card, CardContent, CardHeader, Typography,
    withTheme, WithTheme
} from '@material-ui/core';

import Dict from '../../constants/dict';
import { OperatingSystems } from '../../constants/operating-systems';
import OperatingSystemBrowserList from '../lists/OperatingSystemBrowserList';
import Background from '../utilities/Background';

type IInstallationPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

class InstallationPage extends React.Component<IInstallationPageProps> {

    private paragraphStyle: React.CSSProperties = {
        marginBottom: this.props.theme.spacing(2)
    }

    public render(): React.ReactNode {
        return (
            <Background theme={this.props.theme}>
                <Card>
                    <CardHeader title={Dict.installation_heading} />
                    <CardContent>
                        <Typography style={this.paragraphStyle}>{Dict.installation_paragraph}</Typography>

                        <Accordion
                            expanded={true}
                        >
                            <AccordionSummary>
                                <Typography variant="h5">{Dict.installation_desktop}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <OperatingSystemBrowserList operatingSystem={OperatingSystems.WINDOWS} />
                                    <OperatingSystemBrowserList operatingSystem={OperatingSystems.MACOS} />
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion
                            expanded={true}
                        >
                            <AccordionSummary>
                                <Typography variant="h5">{Dict.installation_mobile}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <OperatingSystemBrowserList operatingSystem={OperatingSystems.ANDROID} />
                                    <OperatingSystemBrowserList operatingSystem={OperatingSystems.IOS} />
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </CardContent>
                </Card>
            </Background>
        );
    }

}

export default withTheme(withRouter(InstallationPage));