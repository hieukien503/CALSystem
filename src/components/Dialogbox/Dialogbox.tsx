import React, { createRef, RefObject } from 'react';

interface DialogboxProps {
    title: string;
    input_label: string;
    rotationMode: boolean;
    angleMode: boolean;
    position: { x: number; y: number };
    inputError: {
        label: string;
        message: string;
    };
    onCancelClick: () => void;
    onSubmitClick: (value: string, CCW?: boolean) => void;
};

interface DialogboxState {
    isHovered: boolean;
    isFocused: boolean;
    isCCW: boolean;
    value_from_input: string;
}

class Dialogbox extends React.Component<DialogboxProps, DialogboxState> {
    private dialogRef: RefObject<HTMLDivElement | null> = createRef();
    private inputRef: RefObject<HTMLInputElement | null> = createRef();
    constructor(props: DialogboxProps) {
        super(props);
        this.state = {
            isFocused: false,
            isHovered: false,
            isCCW: true,
            value_from_input: ''
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

    render(): React.ReactNode {
        const { x, y } = this.props.position;
        return (
            <div 
                className={`dialogComponent inputDialogComponent${this.props.rotationMode ? " rotateInputDialog" : (this.props.angleMode ? " angleInputDialog" : "")}`}
                style={{left: x, top: y, position: 'absolute'}}
                ref={this.dialogRef}
            >
                <div className='popupContent'>
                    <div className='dialogMainPanel'>
                        <div className='dialogTitle text-neutral-900'>{this.props.title}</div>
                        <div className='dialogContent'>
                            {
                                !this.props.angleMode ? (
                                    <>
                                        <div>
                                            <div className={`inputTextField${this.props.inputError.label.length > 0 ? " error" : (this.state.isHovered ? (this.state.isFocused ? " hoverState focusState" : " hoverState") : "")}`}
                                                onMouseEnter={this.activeInputHover}
                                                onMouseLeave={this.deactiveInputHover}
                                            >
                                                <div className='inputLabel text-neutral-700'>{this.props.input_label}</div>
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
                                                {this.props.inputError.label.length > 0 && <div className='errorLabel'>{this.props.inputError.label}</div>}
                                            </div>
                                        </div>
                                        {this.props.rotationMode && 
                                            <div className='radioButtonPanel'>
                                                <div className={`radioButton${this.state.isCCW ? " selected" : ""}`}
                                                    onClick={() => this.setState({isCCW: true})}
                                                >
                                                    <div className='radioBg ripple'>
                                                        <div className='outerCircle'></div>
                                                        <div className='innerCircle'></div>
                                                    </div>
                                                    <div className='label'>counterclockwise</div>
                                                </div>
                                                <div className={`radioButton${!this.state.isCCW ? " selected" : ""}`}
                                                    onClick={() => this.setState({isCCW: false})}
                                                >
                                                    <div className='radioBg ripple'>
                                                        <div className='outerCircle'></div>
                                                        <div className='innerCircle'></div>
                                                    </div>
                                                    <div className='label'>clockwise</div>
                                                </div>
                                            </div>
                                        }
                                    </>
                                ) : (
                                    <div className={`inputTextField${this.props.inputError.label.length > 0 ? " error" : ""}`}>
                                        <div className='inputLabel text-neutral-700'>{this.props.input_label}</div>
                                        <select className='angleDropDown' value={this.state.value_from_input} onChange={(e) => {
                                            this.setState({ value_from_input: e.target.value })
                                        }}>
                                            <option value="0to360">0&deg; - 360&deg;</option>
                                            <option value="0to180">0&deg; - 180&deg;</option>
                                        </select>
                                    </div>
                                )
                            }
                        </div>
                        <div className='dialogButtonPanel'>
                            <button type='button' className='cancelButton' onClick={this.props.onCancelClick}>
                                <div className='label'>Cancel</div>
                            </button>
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
                </div>
            </div>
        )
    }
};

export default Dialogbox;