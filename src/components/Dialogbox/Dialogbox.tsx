import React, { createRef, RefObject } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface DialogboxProps extends WithTranslation {
    title: string;
    input_label: string;
    rotationMode: boolean;
    angleMode: boolean;
    position: { x: number; y: number };
    inputError: {
        label: string;
        message: string;
    };
    loadProjectMode?: string;
    onCancelClick: () => void;
    onSubmitClick: (value: string, CCW?: boolean) => void;
    onDiscardClick?: () => void;
};

interface DialogboxState {
    isHovered: boolean;
    isFocused: boolean;
    isCCW: boolean;
    value_from_input: string;
    projectList: Array<{ _id: string; title: string }>,
    loadingProjects: boolean;
}

export class Dialogbox extends React.Component<DialogboxProps, DialogboxState> {
    private dialogRef: RefObject<HTMLDivElement | null> = createRef();
    private inputRef: RefObject<HTMLInputElement | null> = createRef();
    constructor(props: DialogboxProps) {
        super(props);
        this.state = {
            isFocused: false,
            isHovered: false,
            isCCW: true,
            value_from_input: this.props.title === "Rename Project" ? "Untitled Project" : "",
            projectList: [],
            loadingProjects: false
        }
    }

    componentDidUpdate(prevProps: Readonly<DialogboxProps>, prevState: Readonly<DialogboxState>, snapshot?: any): void {
        if (!prevProps.angleMode && this.props.angleMode) {
            this.setState({ value_from_input: "0to360" });
        }
    }

    componentDidMount() {
        document.addEventListener('pointerdown', this.handleClickOutside);
        document.addEventListener('keydown', this.handleSubmit);
        this.inputRef.current?.focus();
    }

    componentWillUnmount() {
        document.removeEventListener('pointerdown', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleSubmit);
    }

    public getBoundingClientRect = (): DOMRect | undefined => {
        return this.dialogRef.current?.getBoundingClientRect();
    }

    private handleInputFocus = () => {
        this.setState({ isFocused: true });
    }

    private activeInputHover = () => {
        this.setState({ isHovered: true });
    }

    private deactiveInputHover = () => {
        this.setState({ isHovered: false });
    }

    private handleInputBlur = () => {
        this.setState({ isFocused: false });
    }

    private handleClickOutside = (event: MouseEvent) => {
        if (this.dialogRef.current && !this.dialogRef.current.contains(event.target as Node)) {
            this.props.onCancelClick();
        }
    }

    private handleSubmit = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            this.props.onSubmitClick(this.state.value_from_input, this.state.isCCW);
        }
    }

    private fetchProjects = async () => {
        const token = sessionStorage.getItem("token");
        const user = sessionStorage.getItem("user");
        try {
            this.setState({ loadingProjects: true });

            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/projectList/${user}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();

            this.setState({
                projectList: data.projects,
                loadingProjects: false
            });

        } catch {
            this.setState({ loadingProjects: false });
        }
    };

    render(): React.ReactNode {
        const { x, y } = this.props.position;
        let reactNode: React.ReactNode | null = null;
        const { t } = this.props;
        if (this.props.title === 'Save successfully') {
            reactNode = (
                <div className='dialogMainPanel'>
                    <div className='dialogTitle text-neutral-900'>{t(this.props.title)}</div>
                    <div className='dialogContent'>
                        <div className='inputLabel text-neutral-700'>{t(this.props.input_label)}</div>
                    </div>
                    <div className='dialogButtonPanel'>
                        <button type='button' className='okButton'
                            onClick={() => {
                                const value = this.state.value_from_input;
                                this.props.onSubmitClick(value, this.state.isCCW);
                            }}
                        >
                            <div className='label'>OK</div>
                        </button>
                    </div>
                </div>
            )
        }

        else {
            const buttonNode: React.ReactNode = (
                <div className='dialogButtonPanel'>
                    <button type='button' className='okButton'
                        onClick={() => {
                            const value = this.state.value_from_input;
                            this.props.onSubmitClick(value.length === 0 ? (this.props.angleMode ? "0to360" : (this.props.loadProjectMode ? "loadFromFile" : "toPNG")) : value, this.state.isCCW);
                        }}
                    >
                        <div className='label'>{this.props.title === 'Unsaved Changes' ? t('Save Changes') : 'OK'}</div>
                    </button>
                    {(this.props.title === 'Unsaved Changes' || this.props.title === 'Rename Project') && <button type='button' className='cancelButton' onClick={this.props.onDiscardClick}>
                        <div className='label'>{t('Discard')}</div>
                    </button>}
                    <button type='button' className='cancelButton' onClick={this.props.onCancelClick}>
                        <div className='label'>{t('Cancel')}</div>
                    </button>
                </div>
            );

            if (!this.props.angleMode) {
                if (this.props.loadProjectMode !== undefined) {
                    reactNode = (
                        <div className='dialogMainPanel'>
                            <div className='dialogTitle text-neutral-900'>{this.props.title}</div>
                            <div className='dialogContent'>
                                <div className={`inputTextField${this.props.inputError.label.length > 0 ? " error" : ""}`}>
                                    <div className='inputLabel text-neutral-700'>{t(this.props.input_label)}</div>
                                    <select className='angleDropDown' value={this.state.value_from_input} onChange={(e) => {
                                        const value = e.target.value;
                                        this.setState({ value_from_input: value }, () => {
                                            if (value === "loadExisted") {
                                                this.fetchProjects();
                                            }
                                        });
                                    }}>
                                        <option value="loadFromFile">{t('Load Project from File')}</option>
                                        {this.props.loadProjectMode === 'user' && <option value="loadExisted">{t('Load Existed Project')}</option>}
                                    </select>
                                    {this.state.loadingProjects && <option>{t('Loading...')}</option>}
                                    {this.state.projectList.map(project => (
                                        <option key={project._id} value={project._id}>
                                            {project.title}
                                        </option>
                                    ))}
                                </div>
                            </div>
                            {buttonNode}
                        </div>
                    )
                }

                else {
                    if (this.props.title === 'Export Project') {
                        reactNode = (
                            <div className='dialogMainPanel'>
                                <div className='dialogTitle text-neutral-900'>{this.props.title}</div>
                                <div className='dialogContent'>
                                    <div className={`inputTextField${this.props.inputError.label.length > 0 ? " error" : ""}`}>
                                        <div className='inputLabel text-neutral-700'>{t(this.props.input_label)}</div>
                                        <select className='angleDropDown' value={this.state.value_from_input || "toPNG"} onChange={(e) => {
                                            this.setState({ value_from_input: e.target.value })
                                        }}>
                                            <option value="toPNG">{t('PNG Image')}</option>
                                            <option value="toJPEG">{t('JPG Image')}</option>
                                            <option value="toManim">{t('Manim video')}</option>
                                        </select>
                                        {this.state.value_from_input === 'toManim' && 
                                            <a
                                                href="https://www.manim.community/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {t('What is Manim?')}
                                            </a>
                                        }
                                    </div>
                                </div>
                                {buttonNode}
                            </div>
                        )
                    }

                    else {
                        reactNode = (
                            <div className='dialogMainPanel'>
                                <div className='dialogTitle text-neutral-900'>{t(this.props.title)}</div>
                                <div className='dialogContent'>
                                    <>
                                        <div>
                                            <div className={`inputTextField${this.props.inputError.label.length > 0 ? " error" : (this.state.isHovered ? (this.state.isFocused ? " hoverState focusState" : " hoverState") : "")}`}
                                                onMouseEnter={this.activeInputHover}
                                                onMouseLeave={this.deactiveInputHover}
                                            >
                                                <div className='inputLabel text-neutral-700'>{t(this.props.input_label)}</div>
                                                <div className='textField'>
                                                    <div className='TextFieldW'>
                                                        <div className='fieldContainer'>
                                                            <input
                                                                ref={this.inputRef} 
                                                                type='text'
                                                                value={this.state.value_from_input}
                                                                onChange={(e) => this.setState({ value_from_input: e.target.value })}
                                                                className='TextField'
                                                                autoComplete='off'
                                                                onFocus={this.handleInputFocus}
                                                                onBlur={this.handleInputBlur}
                                                                placeholder={this.props.rotationMode ? "30" : ""}
                                                            >
                                                            </input>
                                                        </div>
                                                    </div>
                                                </div>
                                                {this.props.inputError.label.length > 0 && <div className='errorLabel'>{t(this.props.inputError.label)}</div>}
                                            </div>
                                        </div>
                                        {this.props.title === 'Rename Project' &&
                                            <div className='rename-panel'>
                                                <div className='inputLabel text-neutral-700'>{t('Save this project to')}</div>
                                                    <div className='radioButtonPanel' style={{display: 'flex', gap: 120}}>
                                                    <div className={`radioButton${this.state.isCCW ? " selected" : ""}`}
                                                        onClick={() => this.setState({isCCW: true})}
                                                    >
                                                        <div className='radioBg ripple'>
                                                            <div className='outerCircle'></div>
                                                            <div className='innerCircle'></div>
                                                        </div>
                                                        <div className='label'>{t('Local device')}</div>
                                                    </div>
                                                    <div className={`radioButton${!this.state.isCCW ? " selected" : ""}`}
                                                        onClick={() => this.setState({isCCW: false})}
                                                    >
                                                        <div className='radioBg ripple'>
                                                            <div className='outerCircle'></div>
                                                            <div className='innerCircle'></div>
                                                        </div>
                                                        <div className='label'>{t('Your account')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {this.props.rotationMode && 
                                            <div className='radioButtonPanel'>
                                                <div className={`radioButton${this.state.isCCW ? " selected" : ""}`}
                                                    onClick={() => this.setState({isCCW: true})}
                                                >
                                                    <div className='radioBg ripple'>
                                                        <div className='outerCircle'></div>
                                                        <div className='innerCircle'></div>
                                                    </div>
                                                    <div className='label'>{t('counterclockwise')}</div>
                                                </div>
                                                <div className={`radioButton${!this.state.isCCW ? " selected" : ""}`}
                                                    onClick={() => this.setState({isCCW: false})}
                                                >
                                                    <div className='radioBg ripple'>
                                                        <div className='outerCircle'></div>
                                                        <div className='innerCircle'></div>
                                                    </div>
                                                    <div className='label'>{t('clockwise')}</div>
                                                </div>
                                            </div>
                                        }
                                    </>
                                </div>
                                {buttonNode}
                            </div>
                        )
                    }
                    
                }
            }

            else {
                reactNode = (
                    <div className='dialogMainPanel'>
                        <div className='dialogTitle text-neutral-900'>{this.props.title}</div>
                        <div className='dialogContent'>
                            <div className={`inputTextField${this.props.inputError.label.length > 0 ? " error" : ""}`}>
                                <div className='inputLabel text-neutral-700'>{this.props.input_label}</div>
                                <select className='angleDropDown' value={this.state.value_from_input} onChange={(e) => {
                                    this.setState({ value_from_input: e.target.value })
                                }}>
                                    <option value="0to360">0&deg; - 360&deg;</option>
                                    <option value="0to180">0&deg; - 180&deg;</option>
                                </select>
                            </div>
                        </div>
                        {buttonNode}
                    </div>
                    
                )
            }
        }

        
        
        return (
            <div 
                className={`dialogComponent inputDialogComponent${this.props.rotationMode ? " rotateInputDialog" : (this.props.angleMode ? " angleInputDialog" : "")}`}
                style={{left: x, top: y, position: 'absolute'}}
                ref={this.dialogRef}
            >
                <div className='popupContent'>
                    {reactNode}
                </div>
            </div>
        )
    }
};

export default withTranslation(undefined, { withRef: true })(Dialogbox);