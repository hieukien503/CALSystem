import React from "react";
import AlgebraTool from "./Algebra/AlgebraTool";
import { GeometryTool } from "./Geometry/GeometryTool";
import { AnimationTool } from "./Animation/AnimationTool";
import { Point, Shape, ShapeNode, DrawingMode } from '../../types/geometry'
import * as constants from "../../types/constants"
import SettingTools from "./Setting/SettingTools";
import { t } from "../../translation/i18n";
import Geometry from '../../assets/images/Geometry.svg';
import Animation from '../../assets/images/Animation.svg';
import Setting from '../../assets/images/Setting.svg';
import Algebra from '../../assets/images/Algebra.svg';

interface TimelineItem {
    object: string;
    start: number;
    end: number;
    action: string;
    tweens?: string[];
}
interface ToolProps {
    width: number;
    height: number;
    dag: Map<string, ShapeNode>;
    onUpdateWidth: (width: number) => void;
    onSetMode: (mode: DrawingMode) => void;
    onSelect: (id: string, e: React.MouseEvent) => void;
    onUpdateDAG: (dag: Map<string, ShapeNode>) => void;
    selectedPoints: Point[];
    selectedShapes: Shape[];
    stageRef: React.RefObject<any>;
    timeline: TimelineItem[];
    setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
    onSaveProject: () => void;
    onLoadProject: () => void;
    onExport: () => void;
    onLoadDocumentation: () => void;    
}

interface ToolState {
    mode: 'algebra' | 'geometry' | 'animation' | 'setting';     // | 'project'
}

class Tool extends React.Component<ToolProps, ToolState> {
    constructor(props: ToolProps) {
        super(props);
        this.state = {
            mode: 'geometry',
        }
    }

    private changeMode = (mode: 'algebra' | 'geometry' | 'animation' | 'setting' = 'geometry', e: React.MouseEvent): void => {
        e.stopPropagation();
        this.setState({mode: mode}, () => {
            this.props.onUpdateWidth(Math.max(window.innerWidth * 0.22, constants.MIN_TOOL_WIDTH));
        })
    }

    render(): React.ReactNode {
        return (
            <div
                className="dockPanelParent min-w-[72px]"
                style={{position: 'relative', top: '0px', bottom: '0px', left: '0px', overflow: 'hidden', width: this.props.width + 72, height: this.props.height, display: 'flex'}}>
                <div style={{position: 'relative', overflow: 'hidden', display: "flex", flexDirection: "column", flex: 1, height: "100%"}}>
                    <div className={`toolbar${this.props.width === 0 ? " closeLandscape" : ""}`} style={{position: 'relative', display: 'flex', flexDirection: 'row', flex: 1}}>
                        <div className={`header header-${this.props.width === 0 ? "close" : "open"}-landscape`}>
                            <div className="contents">
                                <div className="center">
                                    <button 
                                        type="button"
                                        className={`button tabButton${this.props.width > 0 ? (this.state.mode === 'algebra' ? " selected" : "") : ""}`}
                                        onClick={(e) => this.changeMode('algebra', e)}
                                    >
                                        <img src={Algebra} className="image" draggable="false" tabIndex={-1} alt="" style={{marginLeft: 9, width: 24, height: 24}}></img>
                                        <div className="label">{t("algebra")}</div>
                                    </button>
                                    <button
                                        type="button"
                                        className={`button tabButton${this.props.width > 0 ? (this.state.mode === 'geometry' ? " selected" : "") : ""}`}
                                        onClick={(e) => this.changeMode('geometry', e)}
                                    >
                                        <img src={Geometry} className="image" draggable="false" tabIndex={-1} alt="" style={{marginLeft: 9, width: 24, height: 24}}></img>
                                        <div className="label">{t("geometry")}</div>
                                    </button>
                                    <button
                                        type="button"
                                        className={`button tabButton${this.props.width > 0 ? (this.state.mode === 'animation' ? " selected" : "") : ""}`}
                                        onClick={(e) => this.changeMode('animation', e)}
                                    >
                                        <img src={Animation} className="image" draggable="false" tabIndex={-1} alt="" style={{marginLeft: 9, width: 24, height: 24}}></img>
                                        <div className="label">{t("animation")}</div>
                                    </button>
                                    <button
                                        type="button"
                                        className={`button tabButton${this.props.width > 0 ? (this.state.mode === 'setting' ? " selected" : "") : ""}`}
                                        onClick={(e) => this.changeMode('setting', e)}
                                    >
                                        <img src={Setting} className="image" draggable="false" tabIndex={-1} alt="" style={{marginLeft: 9, width: 24, height: 24}}></img>
                                        <div className="label">{t("setting")}</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={`tool-wrapper${this.props.width === 0 ? " hidden" : ""}`} style={{left: "72px", height: "calc(100% + 0px)", width: "calc(100% - 72px)", position: 'absolute'}}>
                            {this.props.width > 0 && 
                                (this.state.mode === 'geometry' ? <GeometryTool
                                    width={this.props.width}
                                    height={this.props.height}
                                    onPointClick={() => this.props.onSetMode('point')}
                                    onLineClick={() => this.props.onSetMode('line')}
                                    onSegmentClick={() => this.props.onSetMode('segment')}
                                    onVectorClick={() => this.props.onSetMode('vector')}
                                    onPolygonClick={() => this.props.onSetMode('polygon')}
                                    onCircleRadiusClick={() => this.props.onSetMode('circle')}
                                    onRayClick={() => this.props.onSetMode('ray')}
                                    onEditClick={() => this.props.onSetMode('edit')}
                                    onDeleteClick={() => this.props.onSetMode('delete')}
                                    onClearClick={() => this.props.onSetMode('clear')}
                                    onUndoClick={() => this.props.onSetMode('undo')}
                                    onRedoClick={() => this.props.onSetMode('redo')}
                                    onAngleClick={() => this.props.onSetMode('angle')}
                                    onLengthClick={() => this.props.onSetMode('length')}
                                    onAreaClick={() => this.props.onSetMode('area')}
                                    onHideLabelClick={() => this.props.onSetMode('show_label')}
                                    onHideObjectClick={() => this.props.onSetMode('show_object')}
                                    onIntersectionClick={() => this.props.onSetMode('intersection')}
                                    onCircle2PointClick={() => this.props.onSetMode('circle_2_points')}
                                    onCentroidClick={() => this.props.onSetMode('centroid')}
                                    onCircumcenterClick={() => this.props.onSetMode('circumcenter')}
                                    onOrthocenterClick={() => this.props.onSetMode('orthocenter')}
                                    onIncenterClick={() => this.props.onSetMode('incenter')}
                                    onCircumcircleClick={() => this.props.onSetMode('circumcircle')}
                                    onIncircleClick={() => this.props.onSetMode('incircle')}
                                    onExcenterClick={() => this.props.onSetMode('excenter')}
                                    onExcircleClick={() => this.props.onSetMode('excircle')}
                                    onMidPointClick={() => this.props.onSetMode('midpoint')}
                                    onParaLineClick={() => this.props.onSetMode('parallel')}
                                    onPerpenLineClick={() => this.props.onSetMode('perpendicular')}
                                    onSegmentLengthClick={() => this.props.onSetMode('segment_length')}
                                    onPerpenBisecClick={() => this.props.onSetMode('perpendicular_bisector')}
                                    onSemiClick={() => this.props.onSetMode('semicircle')}
                                    onAngleBisecClick={() => this.props.onSetMode('angle_bisector')}
                                    onRegularPolygonClick={() => this.props.onSetMode('regular_polygon')}
                                    onTangentLineClick={() => this.props.onSetMode('tangent_line')}
                                    onReflectLineClick={() => this.props.onSetMode('reflect_line')}
                                    onReflectPointClick={() => this.props.onSetMode('reflect_point')}
                                    onRotationClick={() => this.props.onSetMode('rotation')}
                                    onScalingClick={() => this.props.onSetMode('enlarge')}
                                    onProjectionClick={() => this.props.onSetMode('projection')}
                                    onTranslationClick={() => this.props.onSetMode('translation')}
                            /> : this.state.mode === "algebra" ? <AlgebraTool 
                                width={this.props.width}
                                height={this.props.height}
                                dag={this.props.dag}
                                onSelect={this.props.onSelect}
                                onUpdateDAG={this.props.onUpdateDAG}
                                /> : this.state.mode === 'animation' ? <AnimationTool
                                        width={this.props.width}
                                        height={this.props.height}
                                        dag={this.props.dag}
                                        timeline={this.props.timeline}
                                        setTimeline={this.props.setTimeline}
                                        selectedPoints={this.props.selectedPoints}
                                        selectedShapes={this.props.selectedShapes}
                                        stageRef={this.props.stageRef }
                                /> : <SettingTools
                                        width={this.props.width}
                                        height={this.props.height}
                                        onSaveProject={this.props.onSaveProject}
                                        onLoadProject={this.props.onLoadProject}
                                        onExport={this.props.onExport}
                                        onLoadDocumentation={this.props.onLoadDocumentation}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Tool;