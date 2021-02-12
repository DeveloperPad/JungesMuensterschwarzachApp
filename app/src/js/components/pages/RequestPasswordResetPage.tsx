import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { WithTheme, withTheme } from '@material-ui/core';

import { grid5Style, grid7Style } from '../../constants/theme';
import RequestPasswordResetForm from '../forms/RequestPasswordResetForm';
import WhiteLogoIcon from '../navigation/icons/WhiteLogoIcon';
import Background from '../utilities/Background';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';

type IRequestPasswordResetPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

class RequestPasswordResetPage extends React.Component<IRequestPasswordResetPageProps> {

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
                        <RequestPasswordResetForm />
                    </GridItem>
                </Grid>
            </Background>
        );
    }

}

export default withTheme(withRouter(RequestPasswordResetPage));

const gridStyle: React.CSSProperties = {
    width: "70%"
};