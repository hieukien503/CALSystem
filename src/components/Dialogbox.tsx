import React, { RefObject } from 'react';

interface DialogboxProps {
    title: string;
    input_label: string;
    onCancelClick: () => void;
    onSubmitClick: () => void;
};

interface DialogboxState {
    isHovered: boolean;
    isFocused: boolean;
}

class Dialogbox extends React.Component<DialogboxProps, DialogboxState> {
    private dialogRef: RefObject<HTMLDivElement | null>;
    constructor(props: DialogboxProps) {
        super(props);
        this.state = {
            isFocused: false,
            isHovered: false
        }

        this.dialogRef = React.createRef<HTMLDivElement | null>();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
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

    private handleClickOutside = () => {
        this.props.onCancelClick();
    }

    render(): React.ReactNode {
        return (
            <div className='dialogComponent inputDialogComponent' style={{left: 188, top: 173, position: 'absolute'}} ref={this.dialogRef}>
                <div className='popupContent'>
                    <div className='dialogMainPanel'>
                        <div className='dialogTitle text-neutral-900'>{this.props.title}</div>
                        <div className='dialogContent'>
                            <div>
                                <div className={`inputTextField${this.state.isHovered? " hoverState" : ""}${this.state.isFocused? " focusState": ""}`}>
                                    <label className='inputLabel text-neutral-700'>{this.props.input_label}</label>
                                    <div className='textField'>
                                        <div className='TextFieldW'>
                                            <div className='fieldContainer'>
                                                <input 
                                                    type='text'
                                                    className='TextField'
                                                    autoComplete='off'
                                                    autoCapitalize='off'
                                                    onMouseEnter={this.activeInputHover}
                                                    onMouseLeave={this.deactiveInputHover}
                                                    onFocus={this.handleInputFocus}
                                                    onBlur={this.handleInputBlur}
                                                >
                                                </input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='dialogButtonPanel'>
                            <button type='button' className='cancelButton' onClick={this.props.onCancelClick}>
                                <div className='buttonLabel'>Cancel</div>
                            </button>
                            <button type='button' className='okButton' onClick={this.props.onSubmitClick}>
                                <div className='buttonLabel'>OK</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default Dialogbox;