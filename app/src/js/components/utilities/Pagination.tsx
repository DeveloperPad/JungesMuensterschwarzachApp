import * as React from 'react';

import { Button, withTheme, WithTheme } from '@material-ui/core';

import { CustomTheme } from '../../constants/theme';

type IPaginationProps = WithTheme & {
    currentPage: number;
    onChangePage: (newPage: number) => void;
    style?: React.CSSProperties;
    totalPages: number;
}

class Pagination extends React.Component<IPaginationProps> {

    private paginationStyle: React.CSSProperties = {
        ...this.props.style,
        textAlign: "center",
        width: "100%"
    };

    public render(): React.ReactNode {

        return (
            <div
                style={this.paginationStyle}
            >
                {this.getPageNavigationButtons()}
            </div>
        );
    }

    private getPageNavigationButtons = (): React.ReactNode[] => {
        const navigationButtons: React.ReactNode[] = [];

        navigationButtons.push(this.getJumpToFirstPageButton());
        navigationButtons.push(this.getJumpBackThreePagesButton());
        navigationButtons.push.apply(navigationButtons, this.getJumpToSpecificPageButtons());
        navigationButtons.push(this.getJumpForwardThreePagesButton());
        navigationButtons.push(this.getJumpToLastPageButton());

        return navigationButtons;
    }

    private getMaxPage = (): number => {
        return Math.max(0, this.props.totalPages - 1);
    }

    /* Page Button Types */

    private getJumpToFirstPageButton = (): React.ReactNode => {
        return (
            <Button
                key={-4}
                onClick={
                    this.props.onChangePage.bind(
                        this,
                        0
                    )
                }
                style={this.getFirstButtonStyle()}
            >
                &laquo;
            </Button>
        );
    }

    private getJumpBackThreePagesButton = (): React.ReactNode => {
        return (
            <Button
                key={-3}
                onClick={
                    this.props.onChangePage.bind(
                        this,
                        Math.max(0, this.props.currentPage - 3)
                    )
                }
                style={this.getMiddleButtonStyle()}
            >
                &lt;
            </Button>
        );
    }

    /* Algorithm explanation:
        - usually, show only previous, current and next page
        - except when on first page: show current and two next pages
        - except when on last page: show two previous and current page
    */
    private getJumpToSpecificPageButtons = (): React.ReactNode[] => {
        const navigationButtons: React.ReactNode[] = [];
        const isCurrentPageFirstPage: boolean = this.props.currentPage === 0;
        const isCurrentPageLastPage: boolean = this.props.currentPage === this.getMaxPage();

        for (
            let i = this.props.currentPage - (isCurrentPageLastPage ? 2 : 1);
            i <= this.props.currentPage + (isCurrentPageFirstPage ? 2 : 1);
            i++
        ) {
            if (i < 0 || i > this.getMaxPage()) {
                continue;
            }

            navigationButtons.push(
                <Button
                    key={i}
                    onClick={
                        this.props.onChangePage.bind(
                            this,
                            i
                        )
                    }
                    style={
                        i === this.props.currentPage ? this.getCurrentButtonStyle() : this.getMiddleButtonStyle()
                    }
                >
                    {i + 1}
                </Button>
            );
        }

        return navigationButtons;
    }

    private getJumpForwardThreePagesButton = (): React.ReactNode => {
        return (
            <Button
                key={-2}
                onClick={
                    this.props.onChangePage.bind(
                        this,
                        Math.min(this.getMaxPage(), this.props.currentPage + 3)
                    )
                }
                style={this.getMiddleButtonStyle()}
            >
                &gt;
            </Button>
        );
    }

    private getJumpToLastPageButton = (): React.ReactNode => {
        return (
            <Button
                key={-1}
                onClick={
                    this.props.onChangePage.bind(
                        this,
                        this.getMaxPage()
                    )
                }
                style={this.getLastButtonStyle()}
            >
                &raquo;
            </Button>
        );
    }

    /* CSS */

    private getBaseButtonStyle = (): React.CSSProperties => {
        return {
            backgroundColor: CustomTheme.COLOR_PAGINATION_BUTTONS_BACKGROUND,
            boxShadow:
                `1px 0 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER},
                 0 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER},
                 1px 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER}, 
                 1px 0 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER} inset,
                 0 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER} inset`,
            minWidth: "10%",
            width: "10%"
        };
    }

    private getFirstButtonStyle = (): React.CSSProperties => {
        return {
            ...this.getBaseButtonStyle(),
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0
        };
    }

    private getMiddleButtonStyle = (): React.CSSProperties => {
        return {
            ...this.getBaseButtonStyle(),
            borderRadius: "0px",
        };
    }

    private getCurrentButtonStyle = (): React.CSSProperties => {
        return {
            ...this.getMiddleButtonStyle(),
            borderRadius: "0px",
            boxShadow:
                `1px 0 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER},
                 0 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER_ACTIVE},
                 1px 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER_ACTIVE}, 
                 1px 0 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER} inset,
                 0 1px 0 0 ${CustomTheme.COLOR_PAGINATION_BUTTONS_BORDER_ACTIVE} inset`
        };
    }

    private getLastButtonStyle = (): React.CSSProperties => {
        return {
            ...this.getBaseButtonStyle(),
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0
        };
    }

}

export default withTheme(Pagination);