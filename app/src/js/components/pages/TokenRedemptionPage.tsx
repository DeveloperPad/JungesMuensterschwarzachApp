import * as React from 'react';

import { withTheme, WithTheme } from '@material-ui/core';

import { grid5Style, grid7Style } from '../../constants/theme';
import TokenRedemptionForm from '../forms/TokenRedemptionForm';
import WhiteLogoIcon from '../navigation/icons/WhiteLogoIcon';
import Background from '../utilities/Background';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';

type ITokenRedemptionPageProps = WithTheme;

const TokenRedemptionPage = (props: ITokenRedemptionPageProps) => {
    const { theme } = props;

    const gridStyle: React.CSSProperties = {
        width: "70%"
    };

    return (
        <Background theme={theme}>
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
                    <TokenRedemptionForm />
                </GridItem>
            </Grid>
        </Background>
    );
}

export default withTheme(TokenRedemptionPage);