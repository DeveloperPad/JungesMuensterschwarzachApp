import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { WithTheme, withTheme } from '@material-ui/core';

import { grid5Style, grid7Style } from '../../constants/theme';
import RequestAccountTransferMailForm from '../forms/RequestAccountTransferMailForm';
import WhiteLogoIcon from '../navigation/icons/WhiteLogoIcon';
import Background from '../utilities/Background';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';

type IRequestAccountTransferMailPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

class RequestAccountTransferMailPage extends React.Component<IRequestAccountTransferMailPageProps> {

    public render(): React.ReactNode {
        return (
            <Background theme={this.props.theme}>
                <Grid
                    style={gridStyle}>

                    <GridItem
                        style={grid5Style}>
                        <Grid>
                            <WhiteLogoIcon />
                        </Grid>
                    </GridItem>

                    <GridItem
                        style={grid7Style}>
                        <RequestAccountTransferMailForm />
                    </GridItem>
                </Grid>
            </Background>
        );
    }

}

export default withTheme(withRouter(RequestAccountTransferMailPage));

const gridStyle: React.CSSProperties = {
    width: "70%"
};