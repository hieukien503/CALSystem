import React from 'react';

interface ButtonProps {
    label: string;
    title: string;
    imgSrc: string;
    onClick: () => void;
    selected: boolean;
};

class Button extends React.Component<ButtonProps> {
    render(): React.ReactNode {
        return (
            <button 
                type="button"
                className={`toolButton${this.props.selected ? " selected" : ""}`}
                onClick={this.props.onClick}
                title={this.props.title}
            >
                <img src={this.props.imgSrc} className="image" draggable="false" tabIndex={-1} alt=""></img>
                <div className="label">{this.props.label}</div>
            </button>                 
        );
    }
}


interface SettingToolsProps {
    width: number;
    height: number;
    onSaveProject: () => void;
    onLoadProject: () => void;
    onExport: () => void;
    onLoadDocumentation: () => void;
}

interface SettingToolsState {
    selectedTool: string | null;
}

class SettingTools extends React.Component<SettingToolsProps, SettingToolsState> {
    constructor(props: SettingToolsProps) {
        super(props);
        this.state = {
            selectedTool: null,
        }
    }

    setSelectedTool = (tool: string) => {
        this.setState({ selectedTool: tool });
        if (tool === "documentation") {
            this.props.onLoadDocumentation();
        }

        else if (tool === "save") {
            this.props.onSaveProject();
        }

        else if (tool === "load") {
            this.props.onLoadProject();
        }

        else if (tool === "export") {
            this.props.onExport();
        }
    }

    render(): React.ReactNode {
        return (
            <div 
                className="customScrollBar"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: this.props.height,
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#f9f9f9',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                }}
            >
                <div
                    className="tool-panel"
                    style={{
                        width: this.props.width,
                        height: this.props.height,
                        padding: "8px 0px 14px 16px"
                    }}
                >
                    <Button
                        label="Save"
                        title="Save Project"
                        imgSrc="assets/icons/save_icon.svg"
                        onClick={() => this.setSelectedTool("save")}
                        selected={this.state.selectedTool === "save"}
                    />
                    <Button
                        label="Load"
                        title="Load Project"
                        imgSrc="assets/icons/load_icon.svg"
                        onClick={() => this.setSelectedTool("load")}
                        selected={this.state.selectedTool === "load"}
                    />
                    <Button
                        label="Documentation"
                        title="User Guide"
                        imgSrc="assets/icons/pdf.svg"
                        onClick={() => this.setSelectedTool("documentation")}
                        selected={this.state.selectedTool === "documentation"}
                    />
                    <Button
                        label="Export"
                        title="Export Project"
                        imgSrc="assets/icons/export_icon.svg"
                        onClick={() => this.setSelectedTool("export")}
                        selected={this.state.selectedTool === "export"}
                    />
                </div>
            </div>
        )
    }
}

export default SettingTools;