import * as React from 'react';


interface IGridItemProps {
    style?: object;
}

export default class GridItem extends React.Component<IGridItemProps> {

    private gridItemStyle: React.CSSProperties = {
        ...this.getClassStyle(),
        ...this.props.style
    }

    public render(): React.ReactNode {
        return (
            <div
                style={this.gridItemStyle}>
                {this.props.children}
            </div>
        );
    }

    private getClassStyle(): React.CSSProperties {
        // these default properties are specific to the flex direction of "column*"
        return {
            display: "flex",
            flex: 1,
            flexDirection: "column",
            width: "100%"
        };
    }

}