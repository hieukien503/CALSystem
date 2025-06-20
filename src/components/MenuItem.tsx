import React from "react";
import CheckIcon from '@mui/icons-material/Check';

interface ItemProps {
    label: string;
    isChecked: boolean;
    onClick: () => void;
}

interface ItemState {
    isHovered: boolean;
}

class Item extends React.Component<ItemProps, ItemState> {
    constructor(props: ItemProps) {
        super(props);
        this.state = {
            isHovered: false
        }
    }

    private handleMouseEnter = () => {
        this.setState({isHovered: true});
    }

    private handleMouseLeave = () => {
        this.setState({isHovered: false});
    }

    render(): React.ReactNode {
        return (
            <div 
                className={`MenuItem listMenuItem keyboardFocus${this.state.isHovered? " selectedItem" : ""}`}
                role="checkbox"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onClick={this.props.onClick}
            >
                <div className="checkMarkMenuItem">
                    <div className="ItemText">
                        {this.props.label}
                    </div>
                    {this.props.isChecked && <div className="checkIcon"><CheckIcon /></div>}
                </div>
            </div>
        )
    }
}

interface MenuItemProps {
    isSnapToGrid: boolean;
    axisVisible: boolean;
    gridVisible: boolean;
    left: number;
    top: number;
    onSetAxisVisible: () => void;
    onSetGridVisible: () => void;
    onIsSnapToGrid: () => void;
}

class MenuItem extends React.Component<MenuItemProps, {}> {
    constructor(props: MenuItemProps) {
        super(props);
    }

    private setToolKey = (key: string): void => {
        if (key === "show_axes") {
            this.props.onSetAxisVisible();
        }

        else if (key === "show_grid") {
            this.props.onSetGridVisible();
        }

        else {
            this.props.onIsSnapToGrid();
        }
    }

    render(): React.ReactNode {
        const tools = [
            { key: "show_axes", label: "Show Axes", checked: this.props.axisVisible },
            { key: "show_grid", label: "Show Grid", checked: this.props.gridVisible },
            { key: "snap_to_grid", label: "Snap to Grid", checked: this.props.isSnapToGrid }
        ]
        return (
            <div className="PopupPanel" style={{top: this.props.top, left: this.props.left, position: 'absolute'}}>
                <div className="popupContent">
                    <div tabIndex={0} className="MenuBar MenuBar-vertical">
                        {tools.map(item => <Item key={item.key} label={item.label} isChecked={item.checked} onClick={() => this.setToolKey(item.key)}></Item>)}
                    </div>
                </div>
            </div>
        );
    } 
}

export default MenuItem