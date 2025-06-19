import React from "react";
import KonvaCanvas from "./KonvaRender";
import { GeometryTool } from "./GeometryTool";
import Dialogbox from "./Dialogbox";
import { Point, GeometryState, Shape, ShapeNode, DrawingMode, HistoryEntry } from '../types/geometry'
import * as constants from '../types/constants'
import * as utils from '../utils/utilities'

type SharingMode = 'public' | 'private' | 'organization-wide';

interface ProjectProps {
    width: number;
    height: number;
    id: string;
    title: string;
    description: string;
    sharing: SharingMode;
    projectVersion: {
        versionName: string;
        versionNumber: string;
        createdAt: string;
        updatedAt: string;
        updatedBy: string;
    };
    collaborators: {id: string, role: string}[];
    ownedBy: string;
}

interface Project2DState {
    geometryState: GeometryState;
    dag: Map<string, ShapeNode>;
    selectedPoints: Point[];
    selectedShapes: Shape[];
    mode: DrawingMode;
    isSnapToGrid: boolean;
    /** Tool resizes or not */
    isResize: boolean;
    /** Tool width */
    toolWidth: number;
}

class Project2D extends React.Component<ProjectProps, Project2DState> {
    private labelUsed: string[];
    private historyStack: HistoryEntry[];
    private futureStack: HistoryEntry[];
    private lastFailedState: {
        selectedPoints: Point[];
        selectedShapes: Shape[];
    } | null;
    constructor(props: ProjectProps) {
        super(props);
        this.labelUsed = [];
        this.state = {
            geometryState: {
                numLoops: 0,
                axisTickInterval: 1,
                spacing: constants.BASE_SPACING,
                shapes: [],
                gridVisible: true,
                zoom_level: 1,
                axesVisible: true,
                panning: false,
                polygonIndex: 0,
            },
            mode: 'edit',
            dag: new Map<string, ShapeNode>(),
            selectedPoints: new Array<Point>(),
            selectedShapes: new Array<Shape>(),
            isSnapToGrid: false,
            isResize: false,
            toolWidth: 280,
        }

        this.lastFailedState = null;
        this.historyStack = new Array<HistoryEntry>(utils.clone(
            this.state.geometryState,
            this.state.dag,
            this.state.selectedPoints,
            this.state.selectedShapes,
            this.labelUsed
        )); // Initialize history stack
        
        this.futureStack = new Array<HistoryEntry>();
    }

    private handleUndoClick = () => {
        if (this.lastFailedState) {
            const dag = utils.cloneDAG(this.state.dag);
            this.state.dag.forEach((node, key) => {
                if (this.lastFailedState?.selectedPoints.find(point => point.props.id === key) ||
                    this.lastFailedState?.selectedShapes.find(shape => shape.props.id === key)
                ) {
                    this.labelUsed = this.labelUsed.filter(label => label !== dag.get(key)!.type.props.label);
                    dag.get(key)!.node.destroy();
                    dag.delete(key);
                }
            });

            this.setState({
                dag: dag,
                selectedPoints: [],
                selectedShapes: []
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

        const DAG = utils.cloneDAG(copyState.dag);
        this.labelUsed = copyState.label_used

        this.setState({
            geometryState: copyState.state,
            selectedPoints: copyState.selectedPoints,
            selectedShapes: copyState.selectedShapes,
            mode: 'edit',
            dag: DAG
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

            const DAG = utils.cloneDAG(copyState.dag);

            this.labelUsed = copyState.label_used

            this.setState({
                geometryState: copyState.state,
                selectedPoints: copyState.selectedPoints,
                selectedShapes: copyState.selectedShapes,
                mode: 'edit',
                dag: DAG
            });
        }
    }

    private handleMouseDownResize = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        document.addEventListener("mousemove", this.handleMouseMoveResize);
        document.addEventListener("mouseup", this.handleMouseUpResize);
        this.setState({ isResize: true });
    }

    private handleMouseMoveResize = (e: MouseEvent) => {
        if (!this.state.isResize) return;
        const newWidth = e.clientX + 4;
        if (newWidth > 150) {
            this.setState({ toolWidth: newWidth });
        }

        else {
            this.setState({ toolWidth: 0 });
        }
    }

    private handleMouseUpResize = () => {
        document.removeEventListener("mousemove", this.handleMouseMoveResize);
        document.removeEventListener("mouseup", this.handleMouseUpResize);
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

        this.setState({
            geometryState: {...this.state.geometryState, shapes: []},
            selectedPoints: new Array<Point>(),
            selectedShapes: new Array<Shape>(),
            dag: new Map<string, ShapeNode>()
        })
    }

    private updateAll = (state: {
        gs: GeometryState,
        dag: Map<string, ShapeNode>,
        selectedShapes: Shape[],
        selectedPoints: Point[]
    }) => {
        this.setState({
            geometryState: {...state.gs},
            dag: utils.cloneDAG(state.dag),
            selectedPoints: [...state.selectedPoints],
            selectedShapes: [...state.selectedShapes]
        }, () => {
            if (!this.lastFailedState) {
                this.pushHistory(utils.clone(
                    this.state.geometryState,
                    this.state.dag,
                    this.state.selectedPoints,
                    this.state.selectedShapes,
                    this.labelUsed
                ))
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

    render(): React.ReactNode {
        return (
            <div className="flex justify-start flex-row">
                <GeometryTool
                    width={this.state.toolWidth}
                    height={this.props.height}
                    onPointClick={() => this.setState({mode: 'point'})}
                    onLineClick={() => this.setState({mode: 'line'})}
                    onSegmentClick={() => this.setState({mode: 'segment'})}
                    onVectorClick={() => this.setState({mode: 'vector'})}
                    onPolygonClick={() => this.setState({mode: 'polygon'})}
                    onCircleRadiusClick={() => this.setState({mode: 'circle'})}
                    onRayClick={() => this.setState({mode: 'ray'})}
                    onEditClick={() => this.setState({mode: 'edit'})}
                    onDeleteClick={() => this.setState({mode: 'delete'})}
                    onClearClick={this.handleClearCanvas}
                    onUndoClick={this.handleUndoClick}
                    onRedoClick={this.handleRedoClick}
                    onAngleClick={() => this.setState({mode: 'angle'})}
                    onLengthClick={() => this.setState({mode: 'length'})}
                    onAreaClick={() => this.setState({mode: 'area'})}
                    onHideLabelClick={() => this.setState({mode: 'show_label'})}
                    onHideObjectClick={() => this.setState({mode: 'show_object'})}
                    onIntersectionClick={() => this.setState({mode: 'intersection'})}
                    onCircle2PointClick={() => this.setState({mode: 'circle_2_points'})}
                />
                <div 
                    className="resizer flex justify-center items-center"
                    id="resizer"
                    onMouseDown={this.handleMouseDownResize}
                    onMouseUp={this.handleMouseUpResize}
                >
                    <div className="resizerPanel w-1 h-6 bg-gray-400 rounded"></div>
                </div>
                {this.state.toolWidth < this.props.width && <KonvaCanvas 
                    width={this.props.width - this.state.toolWidth}
                    height={this.props.height}
                    background_color="#ffffff"
                    dag={this.state.dag}
                    onChangeMode={(mode: DrawingMode) => this.setState({mode: mode})}
                    onClearCanvas={this.handleClearCanvas}
                    onSelectedShapesChange={(s) => this.setState({selectedShapes: [...s]})}
                    onSelectedPointsChange={(s) => this.setState({selectedPoints: [...s]})}
                    onGeometryStateChange={(s) => this.setState({geometryState: s})}
                    onSelectedChange = {(s) => this.setState({selectedPoints: s.selectedPoints, selectedShapes: s.selectedShapes})}
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
                            this.state.dag,
                            this.state.selectedPoints,
                            this.state.selectedShapes,
                            this.labelUsed
                        )
                    }}
                />}
            </div>
        )
    }
}

export default Project2D