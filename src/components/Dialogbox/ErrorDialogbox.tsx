import React, { createRef, RefObject } from 'react';

interface ErrorDialogboxProps {
    position: { x: number; y: number };
    error: {
        message: string;
    };
    onCancelClick: () => void;
};

class ErrorDialogbox extends React.Component<ErrorDialogboxProps, {}> {
    private dialogRef: RefObject<HTMLDivElement | null> = createRef();
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    private handleClickOutside = (event: MouseEvent) => {
        if (this.dialogRef.current && !this.dialogRef.current.contains(event.target as Node)) {
            this.props.onCancelClick();
        }
    }

    public getBoundingClientRect = (): DOMRect | undefined => {
        return this.dialogRef.current?.getBoundingClientRect();
    };

    render(): React.ReactNode {
        const { x, y } = this.props.position;
        return (
            <div 
                className={`dialogComponent`}
                style={{ left: x, top: y, position: 'absolute' }}
                ref={this.dialogRef}
                onMouseDown={(e) => e.stopPropagation()} // ⛔ prevent bubbling to Dialogbox
                role="dialog"
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-message"
            >
                <div className='popupContent'>
                    <div className='dialogMainPanel'>
                        <div id="error-dialog-title" className='dialogTitle text-neutral-900'>
                            Error
                        </div>
                        <div className='dialogContent'>
                            <div>
                                <div id="error-dialog-message" className="label">
                                    {this.props.error.message}
                                </div>
                            </div>
                        </div>
                        <div className='dialogButtonPanel'>
                            <button
                                type='button'
                                className='okButton'
                                onClick={this.props.onCancelClick}
                                aria-label="Close error dialog"
                            >
                                <div className='buttonLabel'>Close</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorDialogbox;