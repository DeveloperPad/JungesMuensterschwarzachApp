import * as React from "react";

import { WithTheme, withTheme } from "@material-ui/core";

import { grid5Style, grid7Style } from "../../constants/theme";
import TokenRedemptionPasswordResetForm from "../forms/TokenRedemptionPasswordResetForm";
import WhiteLogoIcon from "../navigation/icons/WhiteLogoIcon";
import Background from "../utilities/Background";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";

type IRequestAccountTransferMailPageProps = WithTheme;

const TokenRedemptionPasswordResetPage = (
    props: IRequestAccountTransferMailPageProps
) => {
    const { theme } = props;

    const gridStyle: React.CSSProperties = React.useMemo(
        () => ({
            width: "70%",
        }),
        []
    );

    return (
        <Background theme={theme}>
            <Grid style={gridStyle}>
                <GridItem style={grid5Style}>
                    <Grid>
                        <WhiteLogoIcon />
                    </Grid>
                </GridItem>

                <GridItem style={grid7Style}>
                    <TokenRedemptionPasswordResetForm />
                </GridItem>
            </Grid>
        </Background>
    );
};

export default withTheme(TokenRedemptionPasswordResetPage);
