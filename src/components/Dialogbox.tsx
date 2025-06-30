import React, { createRef, RefObject } from 'react';

interface DialogboxProps {
    title: string;
    input_label: string;
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

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.inputRef.current?.focus();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
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

    render(): React.ReactNode {
        const { x, y } = this.props.position;
        return (
            <div 
                className={`dialogComponent inputDialogComponent${this.props.angleMode !== undefined ? " angleInputDialog" : ""}`}
                style={{left: x, top: y, position: 'absolute'}}
                ref={this.dialogRef}
            >
                <div className='popupContent'>
                    <div className='dialogMainPanel'>
                        <div className='dialogTitle text-neutral-900'>{this.props.title}</div>
                        <div className='dialogContent'>
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
                                                    autoCapitalize='off'
                                                    onFocus={this.handleInputFocus}
                                                    onBlur={this.handleInputBlur}
                                                    placeholder={this.props.angleMode ? "30" : ""}
                                                >
                                                </input>
                                            </div>
                                        </div>
                                    </div>
                                    {this.props.inputError.label.length > 0 && <div className='errorLabel'>{this.props.inputError.label}</div>}
                                </div>
                            </div>
                            {this.props.angleMode && 
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
                        </div>
                        <div className='dialogButtonPanel'>
                            <button type='button' className='cancelButton' onClick={this.props.onCancelClick}>
                                <div className='label'>Cancel</div>
                            </button>
                            <button type='button' className='okButton'
                                onClick={() => {
                                    const value = this.state.value_from_input || (this.props.angleMode ? "30" : "");
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