import React, { createRef, RefObject } from "react";
import Dialogbox, { Dialogbox as DialogboxClass } from "../Dialogbox/Dialogbox";
import ErrorDialogbox, { ErrorDialogbox as ErrorDialogboxClass } from "../Dialogbox/ErrorDialogbox";
import * as constants3D from '../../types/constants3D';
import * as utils from '../../utils/utilities3D';
import MenuItem from "../MenuItem";
import { GeometryState, Point, Shape, DrawingMode, ShapeNode3D, HistoryEntry3D } from "../../types/geometry";
import { SharingMode } from "../../types/types";
import ThreeDCanvas from "../Canvas/ThreeRender";
import Tool3D from "../Tool/Tool3D";
import * as constants from "../../types/constants";
import { MathCommandLexer } from "../../antlr4/parser/MathCommandLexer";
import { CharStreams, CommonTokenStream } from "antlr4ts";
import { MathCommandParser } from "../../antlr4/parser/MathCommandParser";
import ASTGen from "../../antlr4/astgen/ASTGen";
import * as THREE from 'three';
import { NavigateFunction } from "react-router-dom";
import { ProjectQueriesProps, withProjectQueries } from "../projectQuery";
const math = require('mathjs');

interface TimelineItem {
    object: string;
    start: number;
    end: number;
    action: string;
    tweens?: string[];
}

interface Project3DProps extends ProjectQueriesProps {
    id: string;
    projectVersion: {
        versionName: string;
        versionNumber: string;
        createdAt: string;
        updatedAt: string;
        updatedBy: string;
    };
    navigate: NavigateFunction;
    //ownedBy: string;
}

interface Project3DState {
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
    data: number | {type: string, label: string, x: number, y: number, z: number} | { degree: number, CCW: boolean } | {id_to_change: string | undefined } | undefined;
    /** For error */
    error: {
        mode: string;
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

class Project3D extends React.Component<Project3DProps, Project3DState> {
    private labelUsed: string[];
    private historyStack: HistoryEntry3D[];
    private futureStack: HistoryEntry3D[];
    private lastFailedState: {
        selectedPoints: Point[];
        selectedShapes: Shape[];
    } | null;
    private dialogRef: RefObject<DialogboxClass | null>;
    private errorDialogRef: RefObject<ErrorDialogboxClass | null>;
    private dag: Map<string, ShapeNode3D> = new Map<string, ShapeNode3D>();
    private warning_save = false;
    private hasShownRenameDialog = false;
    private hasShownLoadProjectDialog = false;
    private parts = window.location.pathname.split('/');
    private projectId = this.parts[this.parts.length - 1]; // last segment
    private rendererRef: RefObject<THREE.WebGLRenderer | null>;
    private fileInputRef: RefObject<HTMLInputElement | null>;
    constructor(props: Project3DProps) {
        super(props);
        this.labelUsed = [];
        this.state = {
            geometryState: {
                numLoops: 0,
                axisTickInterval: 1,
                spacing: constants3D.BASE_SPACING,
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
            data: undefined,
            error: {
                mode: '',
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
        this.historyStack = new Array<HistoryEntry3D>(utils.clone(
            this.state.geometryState,
            this.dag,
            this.state.selectedPoints,
            this.state.selectedShapes,
            this.labelUsed
        )); // Initialize history stack
        
        this.futureStack = new Array<HistoryEntry3D>();
        this.dialogRef = createRef<DialogboxClass | null>();
        this.errorDialogRef = createRef<ErrorDialogboxClass | null>();
        this.rendererRef = createRef<THREE.WebGLRenderer | null>();
        this.fileInputRef = createRef<HTMLInputElement>();
    }

    setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>> = (value) => {
        this.setState(prevState => ({
            timeline: typeof value === "function" ? value(prevState.timeline) : value
        }));
    };

    componentDidMount(): void {
        window.addEventListener("resize", this.handleWindowResize);
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("beforeunload", this.handleBeforeUnload);

        this.loadProject();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("beforeunload", this.handleBeforeUnload);
    }

    componentDidUpdate(prevProps: Readonly<Project3DProps>, prevState: Readonly<Project3DState>): void {
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

    // Load Project
    public loadProject = async () => {
        try {
            const data = await this.props.projectQueries.loadProject.refetch(this.props.id);
            if (!data) console.error('No data returned!');
            // Restore DAG (no Konva nodes yet)
            this.dag = this.deserializeDAG(data.dag);

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

    private handleBeforeUnload = (e: BeforeUnloadEvent): void => {
        if (this.dag.size > 4) {
            e.preventDefault();
            navigator.sendBeacon(`${process.env.REACT_APP_API_URL}/api/projects/${this.props.id}/cleanup`)
        }
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
            });
        }

        else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
            this.handleUndoClick();
        }

        else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
            this.handleRedoClick();
        }

        else if (e.key === 'Delete') {
            this.setMode('delete');
        }

        else if (e.key === 'Escape') {
            this.dag.forEach((node, key) => {
                node.isSelected = false;
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

    private handleClearCanvas = () => {
        this.labelUsed.length = 0;
        this.dag.forEach((node, key) => {
            if (!['line-xAxis', 'line-yAxis', 'line-zAxis', 'plane-OxyPlane'].includes(node.type.props.id)) {
                this.dag.delete(key);
            }
        });

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

    private pushHistory = (history: HistoryEntry3D) => {
        this.historyStack.push(history);
        if (this.historyStack.length > 100) {
            this.historyStack.splice(0, 1);
        }

        this.futureStack = [];
    }

    private updateAll = (state: {
        gs: GeometryState,
        dag: Map<string, ShapeNode3D>,
        selectedShapes: Shape[],
        selectedPoints: Point[]
    }, storeHistory: boolean = true) => {
        state.dag.forEach((node, key) => {
            if (!state.selectedPoints.find(value => value.props.id === key) && !state.selectedShapes.find(value => value.props.id === key)) {
                node.isSelected = false;
            }
        });

        this.dag = state.dag;
        this.setState({
            geometryState: state.gs,
            selectedPoints: state.selectedPoints,
            selectedShapes: state.selectedShapes,
            isDialogBox: undefined,
            data: undefined,
            error: {
                mode: this.state.mode,
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
                ))
            }
        });
    }

    private onSelectedPointsChange = (selectedPoints: Point[]): void => {
        this.dag.forEach((node, key) => {
            if (!selectedPoints.find(value => value.props.id === key)) {
                node.isSelected = false;
            }

            else {
                node.isSelected = true;
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
            }

            else {
                node.isSelected = true;
            }
        });

        this.setState({
            selectedShapes: [...selectedShapes]
        })
    }

    private onSelectedChange = (state: {selectedShapes: Shape[], selectedPoints: Point[]}): void => {
        this.dag.forEach((node, key) => {
            if (!state.selectedPoints.find(value => value.props.id === key) && !state.selectedShapes.find(value => value.props.id === key)) {
                node.isSelected = false;
            }

            else {
                node.isSelected = true;
            }
        });

        this.setState({
            selectedShapes: [...state.selectedShapes],
            selectedPoints: [...state.selectedPoints]
        })
    }

    private removeNodeBatch = (id: string, visited: Set<string>, state: {
        labelUsed: string[],
        dag: Map<string, ShapeNode3D>
    }) => {
        if (visited.has(id)) return;
        const node = state.dag.get(id);
        if (!node) return;

        visited.add(id);
        // 1. Find all dependent nodes and recursively remove them
        state.dag.forEach((value, key) => {
            if (value.dependsOn.includes(id)) {
                this.removeNodeBatch(key, visited, state);
            }
        });

        // 2. Clean up
        state.labelUsed = state.labelUsed.filter(
            label => label !== node.type.props.label
        );

        state.dag.delete(id);
    };

    // Public method that does batch delete with single re-render
    private removeNode = (id: string): void => {
        const set = new Set<string>();

        this.removeNodeBatch(id, set, { labelUsed: this.labelUsed, dag: this.dag });
    };

    private setMode = (mode: DrawingMode) => {
        if (mode === 'delete') {
            let selected: string[] = [];
            this.dag.forEach((node, key) => {
                if (node.isSelected) {
                    selected.push(key);
                }
            });

            const visited = new Set<string>();
            selected.forEach(id => this.removeNodeBatch(id, visited, {labelUsed: this.labelUsed, dag: this.dag}));
            this.pushHistory(utils.clone(
                this.state.geometryState,
                this.dag,
                [],
                [],
                this.labelUsed
            ))
        }

        else {
            this.dag.forEach((node, key) => {
                node.isSelected = false;
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
            isMenuRightClick: undefined,
            data: undefined
        })
    }

    private handleUndoClick = () => {
        function disposeGroup(group: THREE.Group) {
            if (!group) return;

            // 1. Traverse all descendants
            group.traverse(object => {
                // 2. Only check Meshes and dispose their resources
                if (object instanceof THREE.Mesh) {
                    // Dispose Geometry
                    if (object.geometry) {
                        object.geometry.dispose();
                    }

                    // Dispose Material and Textures
                    if (object.material) {
                        // If the material is an array, iterate through it (e.g., MultiMaterial)
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } 
                        
                        else {
                            // Dispose textures associated with the material
                            for (const key in object.material) {
                                const value = object.material[key];
                                if (value && typeof value === 'object' && 'isTexture' in value) {
                                    value.dispose();
                                }
                            }
                            // Dispose the material itself
                            object.material.dispose();
                        }
                    }
                }
            });

            // 3. Remove all children from the group/scene hierarchy
            // Note: The loop runs backwards to safely remove items from the collection
            for (let i = group.children.length - 1; i >= 0; i--) {
                const child = group.children[i];
                
                // **Important:** If the child is a nested Group, call disposeGroup on it first.
                if (child instanceof THREE.Group) {
                    disposeGroup(child);
                } else {
                    // For other objects, just remove them from the group.
                    group.remove(child);
                }
            }

            // 4. Finally, remove the group itself from its parent (e.g., the scene)
            if (group.parent) {
                group.parent.remove(group);
            }
        }
        if (this.lastFailedState) {
            const dag = utils.cloneDAG(this.dag);
            this.dag.forEach((node, key) => {
                if (this.lastFailedState?.selectedPoints.find(point => point.props.id === key)
                ) {
                    this.labelUsed = this.labelUsed.filter(label => label !== dag.get(key)!.type.props.label);
                    const node = dag.get(key)
                    if (node !== undefined && node.node !== undefined) {
                        if (node.node instanceof THREE.Group) disposeGroup(node.node);
                        else if (node.node instanceof THREE.Mesh) {
                            if (node.node.geometry) {
                                node.node.geometry.dispose();
                            }

                            // Dispose Material and Textures
                            if (node.node.material) {
                                // If the material is an array, iterate through it (e.g., MultiMaterial)
                                if (Array.isArray(node.node.material)) {
                                    node.node.material.forEach(material => material.dispose());
                                } 
                                
                                else {
                                    // Dispose textures associated with the material
                                    for (const key in node.node.material) {
                                        const value = node.node.material[key];
                                        if (value && typeof value === 'object' && 'isTexture' in value) {
                                            value.dispose();
                                        }
                                    }
                                    // Dispose the material itself
                                    node.node.material.dispose();
                                }
                            }
                        }
                    }
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

        let copyState: HistoryEntry3D | undefined = undefined;
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

    private setDialogbox = (mode: string, id_to_change?: string): void => {
        if (mode === 'point') {
            this.setState({
                isDialogBox: {
                    title: 'Point',
                    input_label: 'Enter point in form (x, y, z)',
                    angleMode: false,
                    rotationMode: false
                },
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
                isMenuRightClick: undefined
            });
        }
        
        else if (mode === 'circle_center_direction') {
            this.setState({
                isDialogBox: {
                    title: 'Circle: Center, Radius and Direction',
                    input_label: 'Radius',
                    angleMode: false,
                    rotationMode: false
                },
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'sphere') {
            this.setState({
                isDialogBox: {
                    title: 'Sphere: Center & Radius',
                    input_label: 'Radius',
                    angleMode: false,
                    rotationMode: false
                },
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
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
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
                data: {id_to_change: id_to_change},
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'cone') {
            this.setState({
                isDialogBox: {
                    title: 'Cone',
                    input_label: 'Radius',
                    angleMode: false,
                    rotationMode: false
                },
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'cylinder') {
            this.setState({
                isDialogBox: {
                    title: 'Cylinder',
                    input_label: 'Radius',
                    angleMode: false,
                    rotationMode: false
                },
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
                isMenuRightClick: undefined
            });
        }

        else if (mode === 'prism') {
            this.setState({
                isDialogBox: {
                    title: 'Prism',
                    input_label: 'Height',
                    angleMode: false,
                    rotationMode: false
                },
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
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
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
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
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
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
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
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
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
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
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
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
                mode: 'rename-project',
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
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
                isMenuRightClick: undefined,
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
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
                isMenuRightClick: undefined,
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
            });
        }

        else if (mode === 'warning-save') {
            this.setState({
                isDialogBox: {
                    title: 'Unsaved Changes',
                    input_label: 'You have unsaved changes in this project. If you continue, your changes will be permanently lost.',
                    angleMode: false,
                    rotationMode: false
                },
                mode: mode,
                isMenuRightClick: undefined,
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
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
                mode: mode,
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
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
                mode: mode,
                error: this.state.error.mode === mode ? this.state.error : {
                    mode: mode,
                    label: '',
                    message: ''
                },
            });
        }

        else {
            throw new Error('Invalid mode');
        }
    }

    private handleMouseDownResize = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
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
        document.removeEventListener("pointermove", this.handleMouseMoveResize);
        document.removeEventListener("pointerup", this.handleMouseUpResize);
        this.setState({ isResize: false });
    };

    private handleSelectObject = (id: string, e: React.MouseEvent): void => {
        const isCtrl = e.ctrlKey || e.metaKey;
        if (isCtrl) {
            const node = this.dag.get(id);
            if (!node) return;
            const wasSelected = node.isSelected;
            node.isSelected = !wasSelected;
        }
        
        else {
            // Clear previous selection
            this.dag.forEach(node => {
                node.isSelected = false;
            });

            const node = this.dag.get(id);
            if (node) {
                node.isSelected = true;
            }
        }

        this.setState({selectedPoints: [...this.state.selectedPoints]});
    }

    private receiveData = (value: string, CCW: boolean = true) => {
        if (this.state.mode === 'point') {
            try {
                const inputStream = CharStreams.fromString(value);
                const lexer = new MathCommandLexer(inputStream);
                const tokens = new CommonTokenStream(lexer);
                const parser = new MathCommandParser(tokens);
                const tree = parser.pointDef();
                const ast = new ASTGen(this.dag, this.labelUsed);
                const data = ast.visit(tree);
                if (
                    data !== undefined &&
                    (typeof data === 'object' && data !== null) &&
                    ('shape' in data && typeof data.shape === 'object' && data.shape !== null) &&
                    ('x' in data.shape && 'y' in data.shape)
                ) {
                    const pointData = {
                        type: 'Point',
                        label: (data.shape as Point).props.label,
                        x: (data.shape as Point).x,
                        y: (data.shape as Point).y,
                        z: (data.shape as Point).z ?? 0
                    }

                    this.setState({ data: pointData });
                    return;
                }

                this.setState({
                    error: {
                        mode: this.state.mode,
                        label: 'Invalid expression',
                        message: `Invalid expression for point`
                    }
                });
            }

            catch (error) {
                this.setState({
                    error: { mode: this.state.mode,
                        label: 'Invalid expression',
                        message: `Invalid expression for point`
                    }
                });

                return;
            }
        }

        if (['segment_length', 'sphere', 'circle_center_direction', 'cone', 'cylinder', 'prism'].includes(this.state.mode)) {
            try {
                const radius = math.evaluate(value);
                if (typeof radius !== 'number' || radius <= 0) {
                    this.setState({
                        error: { mode: this.state.mode,
                            label: 'Number expected',
                            message: ''
                        }
                    });

                    return;
                }

                this.setState({
                    data: radius,
                    error: { mode: this.state.mode,
                        label: '',
                        message: '',
                    },
                    isDialogBox: undefined
                });
            }

            catch(error) {
                this.setState({
                    error: { mode: this.state.mode,
                        label: 'Number expected',
                        message: `Invalid expression for ${this.state.mode === 'sphere' ? 'radius' : 'length'}`
                    }
                })
            }
        }

        else if (this.state.mode === 'regular_polygon') {
            try {
                const vertices = math.evaluate(value);
                if (typeof vertices !== 'number' || (Number.isInteger(vertices) && vertices <= 2)) {
                    this.setState({
                        error: { mode: this.state.mode,
                            label: 'Expected: number of vertices > 2',
                            message: ''
                        }
                    });

                    return;
                }

                this.setState({
                    data: vertices,
                    error: { mode: this.state.mode,
                        label: '',
                        message: '',
                    },
                    isDialogBox: undefined
                });
            }

            catch(error) {
                this.setState({
                    error: { mode: this.state.mode,
                        label: 'Number expected',
                        message: `Invalid expression for number of vertices`
                    }
                })
            }
        }

        else if (this.state.mode === 'rotation') {
            try {
                const degree = math.evaluate(value);
                if (typeof degree !== 'number') {
                    this.setState({
                        error: { mode: this.state.mode,
                            label: 'Number expected',
                            message: ''
                        }
                    });

                    return;
                }

                this.setState({
                    data: {
                        degree: degree,
                        CCW: CCW
                    },
                    error: { mode: this.state.mode,
                        label: '',
                        message: '',
                    },
                    isDialogBox: undefined
                });
            }

            catch(error) {
                this.setState({
                    error: { mode: this.state.mode,
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
                        error: { mode: this.state.mode,
                            label: 'Number expected',
                            message: ''
                        }
                    })
                }

                this.setState({
                    data: scaleFactor,
                    error: { mode: this.state.mode,
                        label: '',
                        message: '',
                    },
                    isDialogBox: undefined
                });
            }

            catch(error) {
                this.setState({
                    error: { mode: this.state.mode,
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
                    error: { mode: this.state.mode,
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
                    error: { mode: this.state.mode,
                        label: 'Name already used',
                        message: 'Name already used. Please choose a different name.'
                    }
                });
                return;
            }

            // Update labelUsed and node properties
            if (this.state.data && typeof this.state.data === 'object' &&'id_to_change' in this.state.data && this.state.data.id_to_change) {
                const node = this.dag.get(this.state.data.id_to_change);
                if (node) {
                    const oldLabel = node.type.props.label;
                    this.labelUsed = this.labelUsed.filter(label => label !== oldLabel);
                    this.labelUsed.push(formatName);
                    node.type.props.label = formatName;
                }
            }

            this.setState({
                data: undefined,
                error: { mode: this.state.mode,
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
                    error: { mode: this.state.mode,
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
                    error: { mode: this.state.mode,
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
                            error: { mode: this.state.mode,
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
                        error: { mode: this.state.mode,
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
                        mode: "3D"
                    },

                    data: {
                        geometryState: this.state.geometryState,
                        dag: this.serializeDAG(this.dag),
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
                error: { mode: this.state.mode,
                    label: '',
                    message: '',
                },
                isDialogBox: undefined
            });
        }

        else if (this.state.mode === 'save-success') {
            this.setState({
                error: { mode: this.state.mode,
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
                error: { mode: this.state.mode,
                    label: '',
                    message: '',
                },
                isDialogBox: undefined
            });
        }

        else if (this.state.mode === 'warning-save') {
            this.saveProject();
            this.warning_save = false;
            this.setState({
                error: { mode: this.state.mode,
                    label: '',
                    message: '',
                },
                isDialogBox: undefined
            });
        }
    }

    private checkTitleExists = async (title: string): Promise<boolean> => {
        return await this.props.projectQueries.checkTitleExists.mutateAsync(title, this.props.id);
    }

    private exportProject = (mode: string) => {
        if (!this.rendererRef.current) {
            this.setState({
                error: { mode: this.state.mode,
                    label: 'File export error',
                    message: 'An error occurred while exporting the file.'
                }
            })
        }

        const stageToDataURL = async (mode: "png" | "jpg" | 'jpeg') => {
            const canvas = this.rendererRef.current!.domElement;
            const mimeType = mode === "png" ? "image/png" : "image/jpeg";
            const dataURL = canvas.toDataURL(mimeType, 1.0);
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = `${this.state.title !== '' ? this.state.title : 'Untitle Project'}.${mode === 'jpeg' ? 'jpg' : mode}`;
            link.click();
        } 
        
        if (['jpg', 'jpeg', 'png'].includes(mode)) {
            stageToDataURL(mode as "png" | "jpg" | 'jpeg');
        }
    }

    // Save Project
    private saveProject = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                this.setState({
                    error: { mode: this.state.mode,
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
                dag: this.serializeDAG(this.dag),
                labelUsed: this.labelUsed,
                animation: this.state.timeline
            };

            await this.props.projectQueries.saveProject.mutateAsync(payload);
            this.setDialogbox('save-success');
        } 
        
        catch (err) {
            console.error("Error saving project:", err);
        }
    };

    private openProject = async () => {
        if (this.warning_save) {
            this.setDialogbox('warning-save');
        }
        
        else {
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
    }

    private loadDocumentation = () => {

    }

    private serializeDAG = (dag: Map<string, ShapeNode3D>) => {
        const obj: Record<string, any> = {};
        dag.forEach((node, key) => {
            obj[key] = {
                id: node.id,
                defined: node.defined,
                dependsOn: node.dependsOn,
                isSelected: node.isSelected,
                scaleFactor: node.scaleFactor,
                rotationFactor: node.rotationFactor,
                side: node.side,
                // store type string instead of the object
                type: node.type,   // store full shape for reconstruction
                isDraggable: node.isDraggable
            };
        });

        return obj;
    }

    private deserializeDAG = (data: Record<string, any>): Map<string, ShapeNode3D> => {
        const dag = new Map<string, ShapeNode3D>();
        //  handle wrapped array
        const obj = Array.isArray(data) ? data[0] : data;
        if (obj === undefined) return dag;
        Object.entries(obj).forEach(([key, value]) => {
            const v = value as any;
            const node: ShapeNode3D = {
                id: v.id,
                defined: v.defined,
                dependsOn: v.dependsOn,
                isSelected: v.isSelected,
                scaleFactor: v.scaleFactor,
                rotationFactor: v.rotationFactor,
                side: v.side,
                type: v.type,
                isDraggable: v.isDraggable
            };
    
            dag.set(key, node);
        });
    
        return dag;
    }

    private handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.name.endsWith('.json') && !file.name.endsWith('.bkgeo')) {
                this.setState({
                    error: { mode: this.state.mode,
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
                        if (data.metadata?.mode !== '3D') {
                            this.setState({
                                error: { mode: this.state.mode,
                                    label: 'Invalid file type',
                                    message: 'Please select a valid 3D file'
                                }
                            })

                            return;
                        }

                        this.dag = this.deserializeDAG(data.data.dag);

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
                    error: { mode: this.state.mode,
                        label: 'File read error',
                        message: 'An error occurred while reading the file.'
                    }
                })
            }
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
                <Tool3D 
                    width={this.state.toolWidth}
                    height={window.innerHeight * 0.745}
                    dag={this.dag}
                    labelUsed={this.labelUsed}
                    onUpdateWidth={(width: number) =>this.setState({toolWidth: width, geometryState: {...this.state.geometryState}})}
                    onSelect={this.handleSelectObject}
                    onUpdateDAG={(dag: Map<string, ShapeNode3D>) => this.updateAll(
                        {
                            gs: this.state.geometryState,
                            dag: dag,
                            selectedPoints: this.state.selectedPoints,
                            selectedShapes: this.state.selectedShapes
                        }
                    )}
                    onSetMode={(mode: DrawingMode) => this.setMode(mode)}
                    selectedPoints={this.state.selectedPoints}
                    selectedShapes={this.state.selectedShapes}
                    timeline={this.state.timeline}
                    setTimeline={this.setTimeline}
                    onUpdateLabelUsed={this.updateLabelUsed}
                    onRenderErrorDialogbox={(msg: string) => {
                        this.setState({
                            error: { mode: this.state.mode,
                                label: 'Invalid command',
                                message: `The command is invalid. Please try again`
                            }
                        })}
                    }
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
                {this.state.toolWidth < window.innerWidth && <ThreeDCanvas 
                    width={window.innerWidth - this.state.toolWidth - 102}
                    height={window.innerHeight * 0.745}
                    rendererRef={this.rendererRef}
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
                />}
                {this.state.isDialogBox && (<Dialogbox 
                    title={this.state.isDialogBox.title}
                    input_label={this.state.isDialogBox.input_label}
                    angleMode={this.state.isDialogBox.angleMode}
                    onSubmitClick={this.receiveData}
                    inputError={this.state.error}
                    onCancelClick={() => this.setState({isDialogBox: undefined, selectedPoints: [], selectedShapes: []})}
                    position={this.state.position.dialogPos ?? {x: -9999, y: -9999}}
                    ref={this.dialogRef}
                    rotationMode={this.state.isDialogBox.rotationMode}
                />)}
                {this.state.error.message.length > 0 && <ErrorDialogbox 
                    position={this.state.position.errorDialogPos ?? {x: -9999, y: -9999}}
                    error={{message: this.state.error.message}}
                    onCancelClick={() => this.setState({error: { mode: this.state.mode,label: this.state.error.label, message: ''}})}
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

export default withProjectQueries(Project3D);