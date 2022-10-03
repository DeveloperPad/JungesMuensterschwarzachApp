import * as React from "react";

import { WithTheme, withTheme } from "@mui/material";

import { grid5Style, grid7Style } from "../../constants/theme";
import ProfilePasswordChangeForm from "../forms/ProfilePasswordChangeForm";
import WhiteLogoIcon from "../navigation/icons/WhiteLogoIcon";
import Background from "../utilities/Background";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";

type IProfilePasswordChangePageProps = WithTheme;

const ProfilePasswordChangePage = (props: IProfilePasswordChangePageProps) => {
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
                    <ProfilePasswordChangeForm />
                </GridItem>
            </Grid>
        </Background>
    );
};

export default withTheme(ProfilePasswordChangePage);
