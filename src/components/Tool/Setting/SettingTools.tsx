import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Load from '../../../assets/images/Load.svg';
import Save from '../../../assets/images/Save.svg';
import Documentation from '../../../assets/images/Documentation.svg';
import Export from '../../../assets/images/Export.svg';


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
                <img src={this.props.imgSrc} className="image" draggable="false" tabIndex={-1} alt="" style={{paddingBottom: 0}}></img>
                <div className="label">{this.props.label}</div>
            </button>                 
        );
    }
}

interface SettingToolsProps extends WithTranslation {
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
        };
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
    };

    render(): React.ReactNode {
        const { t } = this.props;
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
                        label={t("save")}
                        title={t("saveProject")}
                        imgSrc={Save}
                        onClick={() => this.setSelectedTool("save")}
                        selected={this.state.selectedTool === "save"}
                    />

                    <Button
                        label={t("load")}
                        title={t("loadProject")}
                        imgSrc={Load}
                        onClick={() => this.setSelectedTool("load")}
                        selected={this.state.selectedTool === "load"}
                    />

                    <Button
                        label={t("documentation")}
                        title={t("userGuide")}
                        imgSrc={Documentation}
                        onClick={() => this.setSelectedTool("documentation")}
                        selected={this.state.selectedTool === "documentation"}
                    />

                    <Button
                        label={t("export")}
                        title={t("exportProject")}
                        imgSrc={Export}
                        onClick={() => this.setSelectedTool("export")}
                        selected={this.state.selectedTool === "export"}
                    />
                </div>
            </div>
        );
    }
}

export default withTranslation()(SettingTools);
