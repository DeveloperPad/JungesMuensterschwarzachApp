import * as React from 'react';
import { useNavigate } from 'react-router';

import { IconButton, Tooltip } from '@material-ui/core';
import { Person } from '@material-ui/icons';

import { Dict } from '../../../constants/dict';
import { AppUrls } from '../../../constants/specific-urls';
import { IUserKeys, IUserValues } from '../../../networking/account_data/IUser';
import { CookieService } from '../../../services/CookieService';

type IProfileIconButtonProps = {
    isLoggedIn: boolean
}

const ProfileIconButton = (props: IProfileIconButtonProps) => {
    const navigate = useNavigate();
    const { isLoggedIn } = props;
    const [display, setDisplay] = React.useState(isLoggedIn);

    React.useEffect(() => {
        CookieService.get<string>(IUserKeys.accessLevel)
            .then((accessLevel) => {
                setDisplay(
                    accessLevel !== null &&
                        parseInt(accessLevel) !== IUserValues[IUserKeys.accessLevel].guest
                );
            })
            .catch((error) => {
                setDisplay(false);
            });
    }, [isLoggedIn]);

    if (!display) {
        return null;
    }

    return (
        <Tooltip title={Dict.navigation_profile}>
            <IconButton onClick={navigate.bind(this, AppUrls.PROFILE)}>
                <Person />
            </IconButton>
        </Tooltip>
    );
};

export default ProfileIconButton;
