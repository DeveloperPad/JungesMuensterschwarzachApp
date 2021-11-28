import * as React from "react";

import { Button } from "@material-ui/core";

import { CustomTheme } from "../../constants/theme";

type IPaginationProps = {
    currentPage: number;
    onChangePage: (newPage: number) => void;
    style?: React.CSSProperties;
    totalPages: number;
};

const Pagination = (props: IPaginationProps) => {
    const { currentPage, onChangePage, style, totalPages } = props;

    const getMaxPage = (): number => {
        return Math.max(0, totalPages - 1);
    };
    const getPageNavigationButtons = (): React.ReactNode[] => {
        const navigationButtons: React.ReactNode[] = [];

        navigationButtons.push(
            getJumpToEdgePageButton(
                -4,
                0,
                {
                    ...getBaseButtonStyle(),
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0,
                },
                "&laquo;"
            )
        );
        navigationButtons.push(
            getJumpToEdgePageButton(
                -3,
                Math.max(0, currentPage - 3),
                getMiddleButtonStyle(),
                "&lt;"
            )
        );
        navigationButtons.push.apply(
            navigationButtons,
            getJumpToMiddlePageButtons()
        );
        navigationButtons.push(
            getJumpToEdgePageButton(
                -2,
                Math.min(getMaxPage(), currentPage + 3),
                getMiddleButtonStyle(),
                "&gt;"
            )
        );
        navigationButtons.push(
            getJumpToEdgePageButton(
                -1,
                getMaxPage(),
                {
                    ...getBaseButtonStyle(),
                    borderBottomLeftRadius: 0,
                    borderTopLeftRadius: 0,
                },
                "&raquo;"
            )
        );

        return navigationButtons;
    };
    const getJumpToEdgePageButton = (
        key: number,
        page: number,
        style: React.CSSProperties,
        icon: string
    ): React.ReactNode => {
        return (
            <Button
                key={key}
                onClick={onChangePage.bind(this, page)}
                style={style}
            >
                {icon}
            </Button>
        );
    };
    /* Algorithm explanation:
        - usually, show only previous, current and next page
        - except when on first page: show current and two next pages
        - except when on last page: show two previous and current page
    */
    const getJumpToMiddlePageButtons = (): React.ReactNode[] => {
        const navigationButtons: React.ReactNode[] = [];
        const isCurrentPageFirstPage: boolean = currentPage === 0;
        const isCurrentPageLastPage: boolean = currentPage === getMaxPage();

        for (
            let i = currentPage - (isCurrentPageLastPage ? 2 : 1);
            i <= currentPage + (isCurrentPageFirstPage ? 2 : 1);
            i++
        ) {
            if (i < 0 || i > getMaxPage()) {
                continue;
            }

            navigationButtons.push(
                <Button
                    key={i}
                    onClick={onChangePage.bind(this, i)}
                    style={
                        i === currentPage
                            ? {
                                  ...getMiddleButtonStyle(),
                                  borderRadius: "0px",
                                  boxShadow: `1px 0 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER},
                                 0 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER_ACTIVE},
                                 1px 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER_ACTIVE}, 
                                 1px 0 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER} inset,
                                 0 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER_ACTIVE} inset`,
                              }
                            : getMiddleButtonStyle()
                    }
                >
                    {i + 1}
                </Button>
            );
        }

        return navigationButtons;
    };
    const getBaseButtonStyle = (): React.CSSProperties => {
        return {
            backgroundColor: CustomTheme.COLOR_PAGINATION_BUTTONS_BACKGROUND,
            boxShadow: `1px 0 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER},
                 0 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER},
                 1px 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER}, 
                 1px 0 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER} inset,
                 0 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER} inset`,
            minWidth: "10%",
            width: "10%",
        };
    };
    const getMiddleButtonStyle = (): React.CSSProperties => {
        return {
            ...getBaseButtonStyle(),
            borderRadius: "0px",
        };
    };

    return (
        <div
            style={{
                ...style,
                textAlign: "center",
                width: "100%",
            }}
        >
            {getPageNavigationButtons()}
        </div>
    );
};

export default Pagination;
