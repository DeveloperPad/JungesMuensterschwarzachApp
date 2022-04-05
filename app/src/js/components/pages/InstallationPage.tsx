import * as React from 'react';

import {
    Accordion, AccordionDetails, AccordionSummary, Card, CardContent, CardHeader, Typography,
    withTheme, WithTheme
} from '@material-ui/core';

import { Dict } from '../../constants/dict';
import { OperatingSystems } from '../../constants/operating-systems';
import OperatingSystemBrowserList from '../lists/OperatingSystemBrowserList';
import Background from '../utilities/Background';

type IInstallationPageProps = WithTheme;

const InstallationPage = (props: IInstallationPageProps) => {
    const { theme } = props;
    const paragraphStyle: React.CSSProperties = {
        marginBottom: theme.spacing(2)
    }

    return (
        <Background theme={theme}>
            <Card>
                <CardHeader title={Dict.installation_heading} />
                <CardContent>
                    <Typography style={paragraphStyle}>{Dict.installation_paragraph}</Typography>

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

export default withTheme(InstallationPage);