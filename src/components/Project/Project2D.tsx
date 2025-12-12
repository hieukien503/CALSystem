import React, { createRef, RefObject } from "react";
import KonvaCanvas from "../Canvas/KonvaRender";
import Tool from "../Tool/Tool";
import Dialogbox from "../Dialogbox/Dialogbox";
import { Point, GeometryState, Shape, ShapeNode, DrawingMode, HistoryEntry } from '../../types/geometry'
import * as constants from '../../types/constants'
import * as utils from '../../utils/utilities'
import MenuItem from "../MenuItem";
import Konva from "konva";
import ErrorDialogbox from "../Dialogbox/ErrorDialogbox";
import { SharingMode } from "../../types/types";
import { serializeDAG, deserializeDAG } from "../../utils/serialize";
import { NavigateFunction } from "react-router-dom";

const math = require('mathjs');

interface TimelineItem {
    object: string;
    start: number;
    end: number;
    action: string;
    tweens?: string[];
}
interface Project2DProps {
    id: string;
    projectVersion: {
        versionName: string;
        versionNumber: string;
        createdAt: string;
        updatedAt: string;
        updatedBy: string;
    };
    navigate: NavigateFunction
    //ownedBy: string;
}

interface Project2DState {
    geometryState: GeometryState;
    selectedPoints: Point[];
    selectedShapes: Shape[];
    mode: DrawingMode;
    isSnapToGrid: boolean;
    /** Tool resizes or not */
    isResize: boolean;
    /** Tool width */
    toolWidth: number;
    isMenuRightClick: {
        x: number
        y: number
    } | undefined;
    /** For dialogBox */
    isDialogBox: {
        title: string,
        input_label: string;
        angleMode: boolean;
        rotationMode: boolean;
        loadProjectMode?: string
    } | undefined;
    /** For user input */
    data: {
        radius: number | undefined | string;
        id_to_change?: string;
        vertices: number | undefined;
        rotation: {
            degree: number;
            CCW: boolean;
        } | undefined;
    };
    /** For error */
    error: {
        label: string; // for dialogbox error
        message: string; // for error dialogbox
    }
    /** For position */
    position: {
        dialogPos: {
            x: number;
            y: number;
        } | undefined;
        errorDialogPos: {
            x: number;
            y: number;
        } | undefined
    }
    /** Checked for SnapToGrid */
    snapToGridEnabled: boolean;
    timeline: TimelineItem[];
    /** State for Project */
    title: string;
    sharing: SharingMode;
    collaborators: {id: string, role: string}[];
}

class Project2D extends React.Component<Project2DProps, Project2DState> {
    private labelUsed: string[];
    private historyStack: HistoryEntry[];
    private futureStack: HistoryEntry[];
    private lastFailedState: {
        selectedPoints: Point[];
        selectedShapes: Shape[];
    } | null;
    private dialogRef: RefObject<Dialogbox | null>;
    private errorDialogRef: RefObject<ErrorDialogbox | null>;
    private dag: Map<string, ShapeNode> = new Map<string, ShapeNode>();
    private parts = window.location.pathname.split('/');
    private projectId = this.parts[this.parts.length - 1]; // last segment
    private stageRef: RefObject<Konva.Stage | null>;
    private hasShownRenameDialog = false;
    private hasShownLoadProjectDialog = false;
    private fileInputRef: RefObject<HTMLInputElement | null> = React.createRef<HTMLInputElement>();
    private backgroundLayerRef: RefObject<Konva.Layer | null> = React.createRef<Konva.Layer>();
    constructor(props: Project2DProps) {
        super(props);
        this.labelUsed = [];
        this.stageRef = React.createRef<Konva.Stage>();
        this.state = {
            geometryState: {
                numLoops: 1,
                axisTickInterval: 1,
                spacing: constants.BASE_SPACING,
                gridVisible: true,
                zoom_level: 1,
                axesVisible: true,
                panning: false,
            },
            mode: 'edit',
            selectedPoints: new Array<Point>(),
            selectedShapes: new Array<Shape>(),
            snapToGridEnabled: false,
            isSnapToGrid: false,
            isResize: false,
            toolWidth: Math.max(window.innerWidth * 0.22, constants.MIN_TOOL_WIDTH),
            isMenuRightClick: undefined,
            isDialogBox: undefined,
            data: {
                radius: undefined,
                vertices: undefined,
                rotation: undefined
            },
            error: {
                label: '',
                message: ''
            },
            position: {
                dialogPos: undefined,
                errorDialogPos: undefined
            },
            timeline: [],
            title: '',
            sharing: 'edittable',
            collaborators: []
        }

        this.lastFailedState = null;
        this.historyStack = [
            utils.clone(
                {...this.state.geometryState},
                utils.cloneDAG(this.dag),
                [],
                [],
                []
            )
        ]; // Initialize history stack
        this.futureStack = new Array<HistoryEntry>();
        this.dialogRef = createRef<Dialogbox | null>();
        this.errorDialogRef = createRef<ErrorDialogbox | null>();
    }

    setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>> = (value) => {
        this.setState(prevState => ({
            timeline: typeof value === "function" ? value(prevState.timeline) : value
        }));
    };

    componentDidMount(): void {
        window.addEventListener("resize", this.handleWindowResize);
        window.addEventListener("keydown", this.handleKeyDown);

        this.loadProject();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    componentDidUpdate(prevProps: Readonly<Project2DProps>, prevState: Readonly<Project2DState>): void {
        if (
            !prevState.isDialogBox &&
            this.state.isDialogBox &&
            this.state.position.dialogPos === undefined &&
            this.state.position.errorDialogPos === undefined 
        ) {
            setTimeout(() => {
                const domRect = this.dialogRef.current?.getBoundingClientRect?.();
                if (domRect) {
                    const x = (window.innerWidth - domRect.width) / 2;
                    const y = (window.innerHeight - domRect.height) / 2;
                    this.setState({position: {dialogPos: {x: x, y: y}, errorDialogPos: this.state.position.errorDialogPos}});
                }
            }, 0);
        }

        if (!(prevState.error.message.length > 0)  && this.state.error.message.length > 0) {
            setTimeout(() => {
                const domRect = this.errorDialogRef.current?.getBoundingClientRect?.();
                if (domRect) {
                    const x = (window.innerWidth - domRect.width) / 2;
                    const y = (window.innerHeight - domRect.height) / 2;
                    this.setState({position: {errorDialogPos: {x: x, y: y}, dialogPos: this.state.position.dialogPos}});
                }
            }, 0);
        }

        if (this.hasShownRenameDialog && prevState.title === '' && this.state.title !== '') {
            this.saveProject();
            this.hasShownRenameDialog = false;
        }

        // ✅ Only trigger load if title changed AND flag is set  
        if (this.hasShownLoadProjectDialog && prevState.title !== this.state.title && this.state.title !== '') {
            this.loadProject();
            this.hasShownLoadProjectDialog = false;
        }
    }

    private loadDocumentation = (): void => {
        
    }

    private handleKeyDown = (e: KeyboardEvent): void => {
        const target = e.target as HTMLElement;
        const isTextInput =
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            (target as HTMLInputElement).isContentEditable;

        if (isTextInput) return; // ✅ Allow normal typing

        // ✅ Only handle global shortcuts here
        e.preventDefault();
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
            this.dag.forEach((node, key) => {
                node.isSelected = true;
                if (node.id.includes('point-')) {
                    (node.node! as Konva.Circle).shadowColor('gray');
                    (node.node! as Konva.Circle).shadowBlur((node.node! as Konva.Circle).radius() * 2.5);
                    (node.node! as Konva.Circle).shadowOpacity(1.5);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node!.strokeWidth(strokeWidth * 2);
                }
            });
        }

        else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
            this.handleUndoClick();
        }

        else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
            this.handleRedoClick();
        }

        else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            this.saveProject();
        }

        else if (e.key === 'Delete') {
            this.setMode('delete');
        }

        else if (e.key === 'Escape') {
            this.dag.forEach((node, key) => {
                node.isSelected = false;
                if (node.node === undefined) return;
                if (node.id.includes('point-')) {
                    (node.node! as Konva.Circle).shadowBlur(0);
                    (node.node! as Konva.Circle).shadowOpacity(0);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node!.strokeWidth(strokeWidth);
                }
            });
        }
    }

    private handleWindowResize = () => {
        const domRect = this.dialogRef.current?.getBoundingClientRect?.();
        this.setState({
            geometryState: {...this.state.geometryState},
            toolWidth: this.state.toolWidth,
            position: {
                dialogPos: (this.dialogRef.current ? {
                    x: (window.innerWidth - (domRect ? domRect.width : 0)) / 2,
                    y: (window.innerHeight - (domRect ? domRect.height : 0)) / 2
                } : undefined),
                errorDialogPos: (this.errorDialogRef.current ? {
                    x: (window.innerWidth - (domRect ? domRect.width : 0)) / 2,
                    y: (window.innerHeight - (domRect ? domRect.height : 0)) / 2
                } : undefined)
            }
        })
    }

    private setRightMenuClick = (pos?: {x: number, y: number}): void => {
        this.setState({isMenuRightClick: pos, isDialogBox: undefined});
    }

    private handleUndoClick = () => {
        if (this.lastFailedState) {
            const dag = utils.cloneDAG(this.dag);
            this.dag.forEach((node, key) => {
                if (this.lastFailedState?.selectedPoints.find(point => point.props.id === key)
                ) {
                    this.labelUsed = this.labelUsed.filter(label => label !== dag.get(key)!.type.props.label);
                    dag.get(key)!.node!.destroy();
                    dag.delete(key);
                }
            });

            this.dag = dag;
            this.setState({
                selectedPoints: [],
                selectedShapes: [],
                isMenuRightClick: undefined
            });

            return;
        }

        let copyState: HistoryEntry | undefined = undefined;
        if (this.historyStack.length > 1) {
            this.futureStack.push(this.historyStack.pop()!);
            const prevState = this.historyStack[this.historyStack.length - 1];
            copyState = utils.clone(prevState.state, prevState.dag, prevState.selectedPoints, prevState.selectedShapes, prevState.label_used);
        }

        else {
            const prevState = this.historyStack[0];
            copyState = utils.clone(prevState.state, prevState.dag, prevState.selectedPoints, prevState.selectedShapes, prevState.label_used);
        }

        this.dag = copyState.dag;
        this.labelUsed = copyState.label_used

        this.setState({
            mode: 'edit',
            selectedPoints: copyState.selectedPoints,
            selectedShapes: copyState.selectedShapes,
            isMenuRightClick: undefined
        });
    }

    private handleRedoClick = () => {
        if (this.futureStack.length > 0) {
            const nextState = this.futureStack.pop()!;
            this.historyStack.push(nextState);
            if (this.historyStack.length > 100) {
                this.historyStack.splice(0, 1);
            }

            const copyState = utils.clone(nextState.state, nextState.dag, nextState.selectedPoints, nextState.selectedShapes, nextState.label_used);
            this.dag = copyState.dag;

            this.labelUsed = copyState.label_used
            this.setState({
                mode: 'edit',
                selectedPoints: copyState.selectedPoints,
                selectedShapes: copyState.selectedShapes,
                isMenuRightClick: undefined
            });
        }
    }

    private handleMouseDownResize = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ew-resize';
        
        document.addEventListener("pointermove", this.handleMouseMoveResize);
        document.addEventListener("pointerup", this.handleMouseUpResize);
        this.setState({ isResize: true, isMenuRightClick: undefined });
    }

    private handleMouseMoveResize = (e: MouseEvent) => {
        if (!this.state.isResize) return;
        const newWidth = e.clientX - 72;
        if (newWidth > 150) {
            this.setState({ toolWidth: newWidth, geometryState: {...this.state.geometryState} });
        }

        else {
            this.setState({ toolWidth: 0, geometryState: {...this.state.geometryState} });
        }
    }

    private handleMouseUpResize = () => {
        // Re-enable text selection and reset cursor
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        
        document.removeEventListener("pointermove", this.handleMouseMoveResize);
        document.removeEventListener("pointerup", this.handleMouseUpResize);
        this.setState({ isResize: false });
    };

    private pushHistory = (history: HistoryEntry) => {
        this.historyStack.push(history);
        if (this.historyStack.length > 100) {
            this.historyStack.splice(0, 1);
        }

        this.futureStack = [];
    }

    private handleClearCanvas = () => {
        this.labelUsed.length = 0;
        this.dag = new Map<string, ShapeNode>();
        this.setState({
            geometryState: {...this.state.geometryState},
            selectedPoints: [],
            selectedShapes: [],
            isMenuRightClick: undefined
        }, () => {
            this.pushHistory(utils.clone(
                this.state.geometryState,
                this.dag,
                this.state.selectedPoints,
                this.state.selectedShapes,
                this.labelUsed
            ))
        })
    }

    private updateAll = (state: {
        gs: GeometryState,
        dag: Map<string, ShapeNode>,
        selectedShapes: Shape[],
        selectedPoints: Point[]
    }, storeHistory: boolean = true) => {
        state.dag.forEach((node, key) => {
            if (node.node === undefined) return;
            if (!state.selectedPoints.find(value => value.props.id === key) && !state.selectedShapes.find(value => value.props.id === key)) {
                node.isSelected = false;
                if (node.id.includes('point-')) {
                    (node.node! as Konva.Circle).shadowBlur(0);
                    (node.node! as Konva.Circle).shadowOpacity(0);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node!.strokeWidth(strokeWidth);
                }
            }
        });

        this.dag = state.dag;
        this.setState({
            geometryState: state.gs,
            selectedPoints: state.selectedPoints,
            selectedShapes: state.selectedShapes,
            isDialogBox: undefined,
            data: {
                radius: undefined,
                vertices: undefined,
                rotation: undefined
            },
            error: {
                label: '',
                message: ''
            }
        }, () => {
            if (!this.lastFailedState && storeHistory) {
                this.pushHistory(utils.clone(
                    this.state.geometryState,
                    this.dag,
                    this.state.selectedPoints,
                    this.state.selectedShapes,
                    this.labelUsed
                ));
            }
        });
    }

    private updateLastFailedState = (state?: {
        selectedPoints: Point[], selectedShapes: Shape[]
    }): void => {
        this.lastFailedState = state? {
            selectedPoints: [...state.selectedPoints],
            selectedShapes: [...state.selectedShapes]
        } : null;
    }

    private updateLabelUsed = (labelUsed: string[]): void => {
        this.labelUsed = [...labelUsed];
    }

    private onSelectedPointsChange = (selectedPoints: Point[]): void => {
        this.dag.forEach((node, key) => {
            if (node.node === undefined) return;
            if (!selectedPoints.find(value => value.props.id === key)) {
                node.isSelected = false;
                (node.node! as Konva.Circle).shadowBlur(0);
                (node.node! as Konva.Circle).shadowOpacity(0);
            }

            else {
                node.isSelected = true;
                (node.node! as Konva.Circle).shadowColor('gray');
                (node.node! as Konva.Circle).shadowBlur((node.node! as Konva.Circle).radius() * 2.5);
                (node.node! as Konva.Circle).shadowOpacity(1.5);
            }
        });

        this.setState({
            selectedPoints: [...selectedPoints]
        })
    }

    private onSelectedShapesChange = (selectedShapes: Shape[]): void => {
        this.dag.forEach((node, key) => {
            if (!selectedShapes.find(value => value.props.id === key)) {
                node.isSelected = false;
                const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                node.node!.strokeWidth(strokeWidth);
            }

            else {
                node.isSelected = true;
                const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                node.node!.strokeWidth(strokeWidth * 2);
            }
        });

        this.setState({
            selectedShapes: [...selectedShapes]
        })
    }

    private onSelectedChange = (state: {selectedShapes: Shape[], selectedPoints: Point[]}): void => {
        this.dag.forEach((node, key) => {
            if (node.node === undefined) return;
            if (!state.selectedPoints.find(value => value.props.id === key) && !state.selectedShapes.find(value => value.props.id === key)) {
                node.isSelected = false;
                if (node.id.includes('point-')) {
                    (node.node! as Konva.Circle).shadowBlur(0);
                    (node.node! as Konva.Circle).shadowOpacity(0);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node!.strokeWidth(strokeWidth);
                }
            }

            else {
                node.isSelected = true;
                if (node.id.includes('point-')) {
                    (node.node! as Konva.Circle).shadowColor('gray');
                    (node.node! as Konva.Circle).shadowBlur((node.node! as Konva.Circle).radius() * 2.5);
                    (node.node! as Konva.Circle).shadowOpacity(1.5);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node!.strokeWidth(strokeWidth * 2);
                }
            }
        });

        this.setState({
            selectedShapes: [...state.selectedShapes],
            selectedPoints: [...state.selectedPoints]
        })
    }

    private removeNodeBatch = (id: string, visited: Set<string>) => {
        if (visited.has(id)) return;
        const node = this.dag.get(id);
        if (!node) return;

        visited.add(id);
        // 1. Find all dependent nodes and recursively remove them
        this.dag.forEach((value, key) => {
            if (value.dependsOn.includes(id)) {
                this.removeNodeBatch(key, visited);
            }
        });

        // 2. Clean up
        this.labelUsed = this.labelUsed.filter(
            label => label !== node.type.props.label
        );

        node.node!.destroy();
        this.dag.delete(id);
    };

    // Public method that does batch delete with single re-render
    private removeNode = (id: string): void => {
        const set = new Set<string>();
        this.removeNodeBatch(id, set);
    };

    private setMode = (mode: DrawingMode) => {
        let data: number | undefined | string;
        if (mode === 'delete') {
            let selected: string[] = [];
            this.dag.forEach((node, key) => {
                if (node.isSelected) {
                    selected.push(key);
                }
            });

            const visited = new Set<string>();
            selected.forEach(id => this.removeNodeBatch(id, visited));
            this.pushHistory(utils.clone(
                this.state.geometryState,
                this.dag,
                [],
                [],
                this.labelUsed
            ))
        }

        else {
            if (mode === 'angle') {
                if (data === undefined || (data !== undefined && typeof data !== 'string')) {
                    this.setDialogbox(mode);
                }
            }

            this.dag.forEach((node, key) => {
                node.isSelected = false;
                if (node.node === undefined) return;
                if (node.id.includes('point-')) {
                    (node.node! as Konva.Circle).shadowBlur(0);
                    (node.node! as Konva.Circle).shadowOpacity(0);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node!.strokeWidth(strokeWidth);
                }
            });

            if (mode === 'undo') {
                this.handleUndoClick();
            }

            else if (mode === 'redo') {
                this.handleRedoClick();
            }

            else if (mode === 'clear') {
                this.handleClearCanvas();
            }
        }
        
        this.setState({
            selectedPoints: [],
            selectedShapes: [],
            mode: mode,
            isMenuRightClick: undefined
        })
    }

    private setDialogbox = (mode: string, id_to_change?: string): void => {
        if (mode === 'circle') {
            this.setState({
                isDialogBox: {
                    title: 'Circle: Center & Radius',
                    input_label: 'Radius',
                    angleMode: false,
                    rotationMode: false
                },
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'regular_polygon') {
            this.setState({
                isDialogBox: {
                    title: 'Regular Polygon',
                    input_label: 'Vertices',
                    angleMode: false,
                    rotationMode: false
                },
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'rotation') {
            this.setState({
                isDialogBox: {
                    title: 'Rotate around Point',
                    input_label: 'Angle (in degree)',
                    angleMode: false,
                    rotationMode: true
                },
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'segment_length') {
            this.setState({
                isDialogBox: {
                    title: 'Segment with Given Length',
                    input_label: 'Length',
                    angleMode: false,
                    rotationMode: false
                },
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'enlarge') {
            this.setState({
                isDialogBox: {
                    title: 'Dilate from Point',
                    input_label: 'Scale factor',
                    angleMode: false,
                    rotationMode: false
                },
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'changeName') {
            this.setState({
                isDialogBox: {
                    title: 'Rename',
                    input_label: 'New name',
                    angleMode: false,
                    rotationMode: false
                },
                data: {...this.state.data, id_to_change: id_to_change},
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'angle') {
            this.setState({
                isDialogBox: {
                    title: 'Angle',
                    input_label: 'Angle Range',
                    angleMode: true,
                    rotationMode: false
                },
                selectedPoints: [],
                selectedShapes: [],
                mode: mode,
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'rename-project') {
            this.setState({
                isDialogBox: {
                    title: 'Rename Project',
                    input_label: 'New Project Title',
                    angleMode: false,
                    rotationMode: false
                },
                isMenuRightClick: undefined,
                mode: 'rename-project'
            });
        }

        else if (mode === 'load-project-guest') {
            this.setState({
                isDialogBox: {
                    title: 'Load Project',
                    input_label: 'Choose how to load the project',
                    angleMode: false,
                    rotationMode: false,
                    loadProjectMode: 'guest'
                },
                mode: mode,
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'load-project-user') {
            this.setState({
                isDialogBox: {
                    title: 'Load Project',
                    input_label: 'Choose how to load the project',
                    angleMode: false,
                    rotationMode: false,
                    loadProjectMode: 'user'
                },
                mode: mode,
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'warning-save') {
            this.setState({
                isDialogBox: {
                    title: 'Unsaved Changes',
                    input_label: 'You have unsaved changes in this project. If you continue, your changes will be permanently lost.',
                    angleMode: false,
                    rotationMode: false,
                    loadProjectMode: 'user'
                },
                mode: mode,
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'save-success') {
            this.setState({
                isDialogBox: {
                    title: 'Save successfully',
                    input_label: 'File saved successfully',
                    angleMode: false,
                    rotationMode: false,
                },
                isMenuRightClick: undefined,
                mode: mode
            });
        }

        else if (mode === 'export-project') {
            this.setState({
                isDialogBox: {
                    title: 'Export Project',
                    input_label: 'Export Project to',
                    angleMode: false,
                    rotationMode: false,
                },
                isMenuRightClick: undefined,
                mode: mode
            });
        }

        else {
            throw new Error('Invalid mode');
        }
    }

    private handleSelectObject = (id: string, e: React.MouseEvent): void => {
        const isCtrl = e.ctrlKey || e.metaKey;
        if (isCtrl) {
            const node = this.dag.get(id);
            if (!node || (node && node.node === undefined)) return;
            const wasSelected = node.isSelected;
            node.isSelected = !wasSelected;
            if (node.isSelected) {
                if (node.id.includes('point-')) {
                    (node.node! as Konva.Circle).shadowColor('gray');
                    (node.node! as Konva.Circle).shadowBlur((node.node! as Konva.Circle).radius() * 2.5);
                    (node.node! as Konva.Circle).shadowOpacity(1.5);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node!.strokeWidth(strokeWidth * 2);
                }
            }

            else {
                if (node.id.includes('point-')) {
                    (node.node! as Konva.Circle).shadowBlur(0);
                    (node.node! as Konva.Circle).shadowOpacity(0);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node!.strokeWidth(strokeWidth);
                }
            }
        }
        
        else {
            // Clear previous selection
            this.dag.forEach(node => {
                node.isSelected = false;
                if (node.node === undefined) return;
                if (node.id.includes('point-')) {
                    (node.node! as Konva.Circle).shadowBlur(0);
                    (node.node! as Konva.Circle).shadowOpacity(0);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node!.strokeWidth(strokeWidth);
                }
            });

            const node = this.dag.get(id);
            if (node) {
                node.isSelected = true;
                if (node.node === undefined) return;
                if (node.id.includes('point-')) {
                    (node.node! as Konva.Circle).shadowColor('gray');
                    (node.node! as Konva.Circle).shadowBlur((node.node! as Konva.Circle).radius() * 2.5);
                    (node.node! as Konva.Circle).shadowOpacity(1.5);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node!.strokeWidth(strokeWidth * 2);
                }
            }
        }

        this.setState({selectedPoints: [...this.state.selectedPoints]});
    }

    private checkTitleExists = async (title: string): Promise<boolean> => {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
            `${process.env.REACT_APP_API_URL}/api/projects/exists?title=${encodeURIComponent(title)}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const data = await res.json();
        return data.exists;
    }

    private receiveData = (value: string, CCW: boolean = true): void => {
        if (['segment_length', 'circle'].includes(this.state.mode)) {
            try {
                const radius = math.evaluate(value);
                if (typeof radius !== 'number' || radius <= 0) {
                    this.setState({
                        error: {
                            label: 'Number expected',
                            message: ''
                        }
                    });

                    return;
                }

                this.setState({
                    data: {
                        radius: radius,
                        vertices: undefined,
                        rotation: undefined
                    },
                    error: {
                        label: '',
                        message: '',
                    },
                    isDialogBox: undefined
                });
            }

            catch(error) {
                this.setState({
                    error: {
                        label: 'Number expected',
                        message: `Invalid expression for ${this.state.mode === 'circle' ? 'radius' : 'length'}`
                    }
                })
            }
        }

        else if (this.state.mode === 'regular_polygon') {
            try {
                const vertices = math.evaluate(value);
                if (typeof vertices !== 'number' || (Number.isInteger(vertices) && vertices <= 2)) {
                    this.setState({
                        error: {
                            label: 'Expected: number of vertices > 2',
                            message: ''
                        }
                    });

                    return;
                }

                this.setState({
                    data: {
                        radius: undefined,
                        vertices: vertices,
                        rotation: undefined
                    },
                    error: {
                        label: '',
                        message: '',
                    },
                    isDialogBox: undefined
                });
            }

            catch(error) {
                this.setState({
                    error: {
                        label: 'Number expected',
                        message: `Invalid expression for number of vertices`
                    }
                })
            }
        }

        else if (this.state.mode === 'angle') {
            this.setState({
                data: {
                    radius: value,
                    vertices: undefined,
                    rotation: undefined
                },
                error: {
                    label: '',
                    message: '',
                },
                isDialogBox: undefined
            });
        }

        else if (this.state.mode === 'rotation') {
            try {
                const degree = math.evaluate(value);
                if (typeof degree !== 'number') {
                    this.setState({
                        error: {
                            label: 'Number expected',
                            message: ''
                        }
                    });

                    return;
                }

                this.setState({
                    data: {
                        radius: undefined,
                        vertices: undefined,
                        rotation: {
                            degree: degree,
                            CCW: CCW
                        }
                    },
                    error: {
                        label: '',
                        message: '',
                    },
                    isDialogBox: undefined
                });
            }

            catch(error) {
                this.setState({
                    error: {
                        label: 'Number expected',
                        message: `Invalid expression for angle`
                    }
                })
            }
        }

        else if (this.state.mode === 'enlarge') {
            try {
                const scaleFactor = math.evaluate(value);
                if (typeof scaleFactor !== 'number') {
                    this.setState({
                        error: {
                            label: 'Number expected',
                            message: ''
                        }
                    })
                }

                this.setState({
                    data: {
                        radius: scaleFactor,
                        vertices: undefined,
                        rotation: undefined
                    },
                    error: {
                        label: '',
                        message: '',
                    },
                    isDialogBox: undefined
                });
            }

            catch(error) {
                this.setState({
                    error: {
                        label: 'Number expected',
                        message: `Invalid expression for scale factor`
                    }
                })
            }
        }

        else if (this.state.mode === 'edit') {
            // Check name pattern
            const newName = value.trim();
            if (newName.length === 0 || !/^[A-Z][A-Za-z]*(?:'|_[0-9]+|[₀₁₂₃₄₅₆₇₈₉]+)?$/.test(newName)) {
                this.setState({
                    error: {
                        label: 'Invalid name',
                        message: 'Name must start with a letter and contain only letters, apostrophes, or underscores followed by subscripts.'
                    }
                });
                return;
            }

            const subscripts: Record<string, string> = {
                "0": "₀",
                "1": "₁",
                "2": "₂",
                "3": "₃",
                "4": "₄",
                "5": "₅",
                "6": "₆",
                "7": "₇",
                "8": "₈",
                "9": "₉"
            };

            // Replace _digit(s) with subscript digits
            const formatName: string = newName.replace(/_(\d+)/g, (_, digits) =>
                [...digits].map(d => subscripts[d]).join("")
            );

            // Check for duplicate names
            if (this.labelUsed.includes(formatName)) {
                this.setState({
                    error: {
                        label: 'Name already used',
                        message: 'Name already used. Please choose a different name.'
                    }
                });
                return;
            }

            // Update labelUsed and node properties
            if (this.state.data.id_to_change) {
                const node = this.dag.get(this.state.data.id_to_change);
                if (node) {
                    const oldLabel = node.type.props.label;
                    this.labelUsed = this.labelUsed.filter(label => label !== oldLabel);
                    this.labelUsed.push(formatName);
                    node.type.props.label = formatName;
                }
            }

            this.setState({
                data: {
                    radius: undefined,
                    vertices: undefined,
                    rotation: undefined,
                    id_to_change: undefined
                },
                error: {
                    label: '',
                    message: '',
                },
                isDialogBox: undefined,
                geometryState: {...this.state.geometryState}
            }, () => {
                this.pushHistory(utils.clone(
                    this.state.geometryState,
                    this.dag,
                    this.state.selectedPoints,
                    this.state.selectedShapes,
                    this.labelUsed
                ))
            });
        }

        else if (this.state.mode === 'rename-project') {
            if (!value.trim()) {
                this.setState({
                    error: {
                        label: 'Project title cannot be empty',
                        message: 'Project title cannot be empty'
                    }
                })

                return;
            }

            const newName = value.trim();
            const reservedNames = [
                "CON", "PRN", "AUX", "NUL",
                "COM1","COM2","COM3","COM4","COM5","COM6","COM7","COM8","COM9",
                "LPT1","LPT2","LPT3","LPT4","LPT5","LPT6","LPT7","LPT8","LPT9"
            ];

            const maxLength = 50;
            const check = (projectName: string): boolean => {
                if (projectName.length > maxLength) return false;
                const regex = /^(?![ .])[a-zA-Z0-9 _-]+(?<![ .])/;
                if (!regex.test(projectName)) return false;

                // Check reserved names (without extension)
                const baseName = projectName.toUpperCase();
                if (reservedNames.includes(baseName)) return false;
                return true;
            }

            if (newName.length === 0 || !check(newName)) {
                this.setState({
                    error: {
                        label: 'Invalid name',
                        message: 'Name must have the length between 1 to 50 characters, cannot start or end with space or dot, contains only alphanumeric characters, spaces, hyphens and dashes.'
                    }
                });

                return;
            }

            if (CCW === false) {
                this.checkTitleExists(value).then(exists => {
                    if (exists) {
                        this.setState({
                            error: {
                                label: 'Project title already exists',
                                message: 'Please choose a different project title.'
                            },
                            isDialogBox: undefined
                        });

                        this.hasShownRenameDialog = false;
                        return;
                    }

                    this.setState({
                        title: value,
                        error: {
                            label: '',
                            message: '',
                        },
                        isDialogBox: undefined
                    });
                })
            }

            else {
                const content = {
                    format: "BKGeoProject",
                    version: this.props.projectVersion,
                    metadata: {
                        title: this.state.title || "Untitled Project",
                        exportedAt: new Date().toISOString(),
                    },

                    data: {
                        geometryState: this.state.geometryState,
                        dag: serializeDAG(this.dag),
                        labelUsed: this.labelUsed,
                        animation: this.state.timeline
                    }
                };

                const blob = new Blob(
                    [JSON.stringify(content, null, 2)],
                    { type: "application/json" }
                );

                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = (content.metadata.title) + ".bkgeo";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // ✅ Cleanup memory
                URL.revokeObjectURL(url);
            }
        }

        else if (['load-project-guest', 'load-project-user'].includes(this.state.mode)) {
            if (value === 'loadFromFile') {
                this.fileInputRef.current?.click();
            }

            else {
                // Load from server, with value = project ID
                this.projectId = value;
                this.loadProject();
            }

            this.setState({
                error: {
                    label: '',
                    message: '',
                },
                isDialogBox: undefined
            });
        }

        else if (this.state.mode === 'save-success') {
            this.setState({
                error: {
                    label: '',
                    message: '',
                },
                isDialogBox: undefined
            });
        }

        else if (this.state.mode === 'export-project') {
            if (value === 'toPNG') {
                this.exportProject('png');
            }

            else if (value === 'toJPG' || value === 'toJPEG') {
                this.exportProject('jpeg');
            }
            
            this.setState({
                error: {
                    label: '',
                    message: '',
                },
                isDialogBox: undefined
            });
        }
    }

    // Save Project
    private saveProject = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                this.setState({
                    error: {
                        label: 'Requires Login',
                        message: 'Please log in to save your project.'
                    }
                });
                return;
            }

            // ✅ Only show rename dialog if title is empty
            if (!this.state.title && this.hasShownRenameDialog === false) {
                this.hasShownRenameDialog = true;
                this.setDialogbox("rename-project");
                return;
            }

            if (this.state.error.message) {  // ✅ Changed from this.state.error
                this.hasShownRenameDialog = false;
                return;
            }

            const payload = {
                title: this.state.title,
                sharing: this.state.sharing,
                projectVersion: this.props.projectVersion,
                // collaborators: this.props.collaborators,
                // ownedBy: this.props.ownedBy,
                geometryState: this.state.geometryState,
                dag: serializeDAG(this.dag),
                labelUsed: this.labelUsed,
                animation: this.state.timeline
            };

            await fetch(`${process.env.REACT_APP_API_URL}/api/projects/${this.projectId}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            this.setDialogbox('save-success');
        } 
        
        catch (err) {
            console.error("Error saving project:", err);
        }
    };

    private openProject = async () => {
        this.setDialogbox('warning-save');
        const token = sessionStorage.getItem("token");
        const user = JSON.parse(sessionStorage.getItem("user") || "null");
        if (user === null || !token) {
            this.hasShownLoadProjectDialog = true;
            this.setDialogbox('load-project-guest');
        }

        else {
            this.hasShownLoadProjectDialog = true;
            this.setDialogbox('load-project-user');
        }
    }

    // Load Project
    public loadProject = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const user = JSON.parse(sessionStorage.getItem("user") || "null");
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/projects/${this.projectId}/${user?._id || "null"}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (!res.ok) throw new Error("Failed to load project");
            if (this.projectId !== this.props.id) {
                this.props.navigate(`/view/project/${this.projectId}`);
                return;
            }

            const data = await res.json();
            // Restore DAG (no Konva nodes yet)
            this.dag = deserializeDAG(data.dag);

            // force React update
            this.setState((prev) => ({ ...prev }));
          
            //console.log("Updated DAG: ", this.dag);
            
            //// Restore state
            this.setState({
                geometryState: data.geometryState ?? {
                    numLoops: 0,
                    axisTickInterval: 1,
                    spacing: constants.BASE_SPACING,
                    gridVisible: true,
                    zoom_level: 1,
                    axesVisible: true,
                    panning: false,
                },
                selectedPoints: [],
                selectedShapes: [],
                timeline: data.animation,
                
            });

            this.labelUsed = data.labelUsed;

        } catch (err) {
            console.error("Error loading project:", err);
        }
    };

    private handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.name.endsWith('.json') && !file.name.endsWith('.bkgeo')) {
                this.setState({
                    error: {
                        label: 'Invalid file type',
                        message: 'Please select a valid .json or .bkgeo file.'
                    }
                });
                return;
            }

            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result;
                    if (typeof content === 'string') {
                        const data = JSON.parse(content);
                        this.dag = deserializeDAG(data.data.dag);

                        // force React update
                        this.setState((prev) => ({ ...prev }));
                    
                        //console.log("Updated DAG: ", this.dag);
                        
                        //// Restore state
                        this.setState({
                            geometryState: data.data.geometryState ?? {
                                numLoops: 0,
                                axisTickInterval: 1,
                                spacing: constants.BASE_SPACING,
                                gridVisible: true,
                                zoom_level: 1,
                                axesVisible: true,
                                panning: false,
                            },
                            selectedPoints: [],
                            selectedShapes: [],
                            timeline: data.data.animation,
                            
                        });

                        this.labelUsed = data.data.labelUsed;
                    }
                }
            }

            catch (error) {
                this.setState({
                    error: {
                        label: 'File read error',
                        message: 'An error occurred while reading the file.'
                    }
                })
            }
        }
    }

    private exportProject = (mode: string) => {
        if (!this.stageRef.current) {
            this.setState({
                error: {
                    label: 'File export error',
                    message: 'An error occurred while exporting the file to PNG.'
                }
            })
        }

        const stageToBlob = async (mode: "png" | "jpg" | 'jpeg') => {
            if (mode.toLowerCase() === "png") {
                const blob = await this.stageRef.current!.toBlob({ pixelRatio: 2 }) as Blob;
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");

                a.href = url;
                a.download = `${this.state.title !== '' ? this.state.title : 'Untitle Project'}.png`;
                a.click();

                URL.revokeObjectURL(url);
            }

            else {
                const blob = await this.stageRef.current!.toBlob({ pixelRatio: 2, mimeType: 'image/jpeg', quality: 0.95 }) as Blob;
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");

                a.href = url;
                a.download = `${this.state.title !== '' ? this.state.title : 'Untitle Project'}.png`;
                a.click();

                URL.revokeObjectURL(url);
            }
        } 
        
        if (['jpg', 'jpeg', 'png'].includes(mode)) {
            stageToBlob(mode as "png" | "jpg" | 'jpeg');
        }
    }

    render(): React.ReactNode {
        return (
            <div className="flex justify-start flex-row" style={{overflow: "hidden"}}>
                <input
                    type="file"
                    ref={this.fileInputRef}
                    style={{ display: "none" }}
                    accept=".json, .bkgeo"
                    onChange={this.handleFileSelected}
                />
                <Tool 
                    width={this.state.toolWidth}
                    height={window.innerHeight * 0.745}
                    dag={this.dag}
                    onUpdateWidth={(width: number) => this.setState({ toolWidth: width, geometryState: { ...this.state.geometryState } })}
                    onSelect={this.handleSelectObject}
                    onSetMode={(mode) => this.setMode(mode)}
                    selectedPoints={this.state.selectedPoints}
                    selectedShapes={this.state.selectedShapes}
                    stageRef={this.stageRef}
                    timeline={this.state.timeline}
                    setTimeline={this.setTimeline}
                    onUpdateDAG={(dag) => this.updateAll(
                        {
                            gs: this.state.geometryState,
                            dag: dag,
                            selectedPoints: this.state.selectedPoints,
                            selectedShapes: this.state.selectedShapes
                        }
                    )}
                    onSaveProject={this.saveProject}
                    onLoadProject={this.openProject}
                    onExport={() => this.setDialogbox('export-project')}
                    onLoadDocumentation={this.loadDocumentation}
                />
                {this.state.toolWidth > 0 && <div 
                    className="resizer flex justify-center items-center min-w-[20px] rounded-[8px] border-r"
                    id="resizer"
                    onPointerDown={this.handleMouseDownResize}
                    onPointerUp={this.handleMouseUpResize}
                >
                    <div className="resizerPanel w-1 h-6 bg-gray-400 rounded"></div>
                </div>}
                {this.state.toolWidth < window.innerWidth && <KonvaCanvas 
                    width={window.innerWidth - this.state.toolWidth - 102}
                    height={window.innerHeight * 0.745}
                    background_color="#ffffff"
                    dag={this.dag}
                    onChangeMode={(mode: DrawingMode) => this.setState({mode: mode})}
                    onSelectedShapesChange={this.onSelectedShapesChange}
                    onSelectedPointsChange={this.onSelectedPointsChange}
                    onGeometryStateChange={(s) => this.setState({geometryState: s})}
                    onSelectedChange = {this.onSelectedChange}
                    mode={this.state.mode}
                    isSnapToGrid={this.state.isSnapToGrid}
                    selectedPoints={this.state.selectedPoints}
                    selectedShapes={this.state.selectedShapes}
                    labelUsed={this.labelUsed}
                    onLabelUsed={this.updateLabelUsed}
                    geometryState={this.state.geometryState}
                    pushHistory={this.pushHistory}
                    onUpdateLastFailedState={this.updateLastFailedState}
                    isResize={this.state.isResize}
                    onUpdateAll={this.updateAll}
                    getSnapshot={() => {
                        return utils.clone(
                            this.state.geometryState,
                            this.dag,
                            this.state.selectedPoints,
                            this.state.selectedShapes,
                            this.labelUsed,
                            true
                        )
                    }}
                    onRenderMenuRightClick={this.setRightMenuClick}
                    onRemoveNode={this.removeNode}
                    onRenderDialogbox={this.setDialogbox}
                    data={this.state.data}
                    stageRef={this.stageRef}
                    backgroundLayerRef={this.backgroundLayerRef}
                />}
                {this.state.isDialogBox && (<Dialogbox 
                    title={this.state.isDialogBox.title}
                    input_label={this.state.isDialogBox.input_label}
                    angleMode={this.state.isDialogBox.angleMode}
                    onSubmitClick={this.receiveData}
                    inputError={this.state.error}
                    onCancelClick={() => {
                        this.setState({isDialogBox: undefined, selectedPoints: [], selectedShapes: []})
                        this.hasShownRenameDialog = false;
                    }}
                    position={this.state.position.dialogPos ?? {x: -9999, y: -9999}}
                    ref={this.dialogRef}
                    rotationMode={this.state.isDialogBox.rotationMode}
                    loadProjectMode={this.state.isDialogBox.loadProjectMode}
                />)}
                {this.state.error.message.length > 0 && <ErrorDialogbox 
                    position={this.state.position.errorDialogPos ?? {x: -9999, y: -9999}}
                    error={{message: this.state.error.message}}
                    onCancelClick={() => this.setState({error: {label: this.state.error.label, message: ''}})}
                    ref={this.errorDialogRef}
                />}
                {this.state.isMenuRightClick && !this.state.isDialogBox && (<MenuItem 
                    isSnapToGrid={this.state.snapToGridEnabled}
                    gridVisible={this.state.geometryState.gridVisible}
                    axisVisible={this.state.geometryState.axesVisible}
                    left={this.state.isMenuRightClick.x}
                    top={this.state.isMenuRightClick.y}
                    onSetAxisVisible={() => this.setState({geometryState: {...this.state.geometryState, axesVisible: !this.state.geometryState.axesVisible}, isMenuRightClick: undefined})}
                    onSetGridVisible={() => this.setState({geometryState: {...this.state.geometryState, gridVisible: !this.state.geometryState.gridVisible}, isMenuRightClick: undefined})}
                    onIsSnapToGrid={() => this.setState((prevState) => {
                        const newSnapToGridEnabled = !prevState.snapToGridEnabled;
                        const newIsSnapToGrid = prevState.geometryState.gridVisible && newSnapToGridEnabled;
                        return {
                            snapToGridEnabled: newSnapToGridEnabled,
                            isSnapToGrid: newIsSnapToGrid,
                            isMenuRightClick: undefined
                        }
                    })}
                />)}
            </div>
        )
    }
}

export default Project2D;