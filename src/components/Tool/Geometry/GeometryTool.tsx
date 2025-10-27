import React from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import newPoint from '../../../assets/images/newPoint.svg';
import line from '../../../assets/images/line.svg';
import segment from '../../../assets/images/segment.svg';
import iconredo from '../../../assets/images/iconredo.svg';
import iconundo from '../../../assets/images/iconundo.svg';
import incircle from '../../../assets/images/incircle.svg';
import incenter from '../../../assets/images/incenter.svg';
import angle_bisector from '../../../assets/images/angle_bisector.svg';
import angle from '../../../assets/images/angle.svg';
import edit from '../../../assets/images/edit.svg';
import polygon from '../../../assets/images/polygon.svg';
import circle_center_radius from '../../../assets/images/circle_center_radius.svg';
import deleteObject from '../../../assets/images/delete.svg';
import deleteAll from '../../../assets/images/delete-all.svg';
import showObject from '../../../assets/images/show_hide_object.svg';
import showLabel from '../../../assets/images/show_hide_label.svg';
import midpoint_center from '../../../assets/images/midpoint_center.svg';
import tangents from '../../../assets/images/tangents.svg';
import perpen_bisector from '../../../assets/images/perpen_bisector.svg';
import perpen_line from '../../../assets/images/perpen_line.svg';
import parallel_line from '../../../assets/images/parallel_line.svg';
import length from '../../../assets/images/length.svg';
import area from '../../../assets/images/area.svg';
import volume from '../../../assets/images/volume.svg';
import vector from '../../../assets/images/vector.svg';
import ray from '../../../assets/images/ray.svg';
import segment_length from '../../../assets/images/segment_given_length.svg';
import circle_center_point from '../../../assets/images/circle_center_point.svg';
import circle_3_points from '../../../assets/images/circle_3_points.svg';
import semicircle from '../../../assets/images/semicircle.svg';
import intersection from '../../../assets/images/intersection.svg';
import excircle from '../../../assets/images/excircle.svg';
import excenter from '../../../assets/images/excenter.svg';

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
                <img src={this.props.imgSrc} className="image" draggable="false" tabIndex={-1} alt=""></img>
                <div className="label">{this.props.label}</div>
            </button>                 
        );
    }
}

interface GeometryToolProps {
    width: number;
    height: number;
    onPointClick: () => void;
    onLineClick: () => void;
    onSegmentClick: () => void;
    onVectorClick: () => void;
    onPolygonClick: () => void;
    onCircleRadiusClick: () => void;
    onRayClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onClearClick: () => void;
    onUndoClick: () => void;
    onRedoClick: () => void;
    onAngleClick: () => void;
    onHideLabelClick: () => void;
    onHideObjectClick: () => void;
    onMidPointClick: () => void;
    onCircumcenterClick: () => void;
    onIncenterClick: () => void;
    onExcenterClick: () => void;
    onOrthocenterClick: () => void;
    onCentroidClick: () => void;
    onLengthClick: () => void;
    onPerpenLineClick: () => void;
    onPerpenBisecClick: () => void;
    onParaLineClick: () => void;
    onAngleBisecClick: () => void;
    onTangentLineClick: () => void;
    onCircumcircleClick: () => void;
    onIncircleClick: () => void;
    onExcircleClick: () => void;
    onCircle2PointClick: () => void;
    onSegmentLengthClick: () => void;
    onSemiClick: () => void;
    onRegularPolygonClick: () => void;
    onTranslationClick: () => void;
    onRotationClick: () => void;
    onReflectLineClick: () => void;
    onReflectPointClick: () => void;
    onProjectionClick: () => void;
    onScalingClick: () => void;
    onIntersectionClick: () => void;
    onAreaClick: () => void;
}

interface GeometryToolState {
    activeButton: string | null;
    openCategory: string | null;
}

export class GeometryTool extends React.Component<GeometryToolProps, GeometryToolState> {
    constructor(props: GeometryToolProps) {
        super(props);
        this.state = {
            activeButton: null,
            openCategory: null
        }
    }

    toolCategoryClicked(categoryName: string) {
        this.setState((prevState) => ({
            openCategory: prevState.openCategory === categoryName ? null : categoryName
        }));
    }

    setActiveTool(toolKey: string) {
        this.setState({ activeButton: toolKey });
        if (toolKey === "point") {
            this.props.onPointClick();
        }

        else if (toolKey === "line") {
            this.props.onLineClick();
        }

        else if (toolKey === "segment") {
            this.props.onSegmentClick();
        }

        else if (toolKey === "vector") {
            this.props.onVectorClick();
        }

        else if (toolKey === "polygon") {
            this.props.onPolygonClick();
        }

        else if (toolKey === "circle") {
            this.props.onCircleRadiusClick();
        }

        else if (toolKey === "ray") {
            this.props.onRayClick();
        }

        else if (toolKey === "edit") {
            this.props.onEditClick();
        }

        else if (toolKey === "delete") {
            this.props.onDeleteClick();
        }

        else if (toolKey === "clear") {
            this.props.onClearClick();
        }

        else if (toolKey === "undo") {
            this.props.onUndoClick();
        }

        else if (toolKey === "redo") {
            this.props.onRedoClick();
        }

        else if (toolKey === "angle") {
            this.props.onAngleClick();
        }

        else if (toolKey === "show_label") {
            this.props.onHideLabelClick();
        }

        else if (toolKey === "show_object") {
            this.props.onHideObjectClick();
        }

        else if (toolKey === "midpoint") {
            this.props.onMidPointClick();
        }

        else if (toolKey === "perpendicular") {
            this.props.onPerpenLineClick();
        }

        else if (toolKey === "perpendicular_bisector") {
            this.props.onPerpenBisecClick();
        }

        else if (toolKey === "parallel") {
            this.props.onParaLineClick();
        }

        else if (toolKey === "angle_bisector") {
            this.props.onAngleBisecClick();
        }

        else if (toolKey === "tangent") {
            this.props.onTangentLineClick();
        }

        else if (toolKey === "intersection") {
            this.props.onIntersectionClick();
        }

        else if (toolKey === "circumcenter") {
            this.props.onCircumcenterClick();
        }

        else if (toolKey === "incenter") {
            this.props.onIncenterClick();
        }

        else if (toolKey === "excenter") {
            this.props.onExcenterClick();
        }

        else if (toolKey === "orthocenter") {
            this.props.onOrthocenterClick();
        }

        else if (toolKey === "centroid") {
            this.props.onCentroidClick();
        }

        else if (toolKey === "length") {
            this.props.onLengthClick();
        }

        else if (toolKey === "area") {
            this.props.onAreaClick();
        }

        else if (toolKey === "segment_length") {
            this.props.onSegmentLengthClick();
        }

        else if (toolKey === "circle_2_points") {
            this.props.onCircle2PointClick();
        }

        else if (toolKey === "circumcircle") {
            this.props.onCircumcircleClick();
        }

        else if (toolKey === "incircle") {
            this.props.onIncircleClick();
        }

        else if (toolKey === "excircle") {
            this.props.onExcircleClick();
        }

        else if (toolKey === "semicircle") {
            this.props.onSemiClick();
        }

        else if (toolKey === "reg_polygon") {
            this.props.onRegularPolygonClick();
        }

        else if (toolKey === "translation") {
            this.props.onTranslationClick();
        }

        else if (toolKey === "scaling") {
            this.props.onScalingClick();
        }

        else if (toolKey === "rotation") {
            this.props.onRotationClick();
        }

        else if (toolKey === "projection") {
            this.props.onProjectionClick();
        }

        else if (toolKey === "reflect_point") {
            this.props.onReflectPointClick();
        }

        else if (toolKey === "reflect_line") {
            this.props.onReflectLineClick();
        }
    }

    render(): React.ReactNode {
        const toolCategories = [
            {
                name: "Basic Tools",
                tools: [
                    { key: "point", label: "Point", onClick: () => this.setActiveTool("point"), title: "Select position or object", imgSrc: newPoint },
                    { key: "line", label: "Line", onClick: () => this.setActiveTool("line"), title: "Select 2 points", imgSrc: line },
                    { key: "segment", label: "Segment", onClick: () => this.setActiveTool("segment"), title: "Select 2 points", imgSrc: segment },
                    { key: "polygon", label: "Polygon", onClick: () => this.setActiveTool("polygon"), title: "Select all vertices, then click on the first point again",imgSrc: polygon },
                    { key: "circle", label: "Circle: Center & Radius", onClick: () => this.setActiveTool("circle"), title: "Select a center, then enter its radius", imgSrc: circle_center_radius },
                    { key: "edit", label: "Edit", onClick: () => this.setActiveTool("edit"), title: "Move the objects or View", imgSrc: edit }
                ]
            },
            {
                name: "Edit",
                tools: [
                    { key: "delete", label: "Delete", onClick: () => this.setActiveTool("delete"), title: "Select the object to delete", imgSrc: deleteObject },
                    { key: "show_label", label: "Show / Hide Label", onClick: () => this.setActiveTool("show_label"), title: "Select object", imgSrc: showLabel },
                    { key: "show_object", label: "Show / Hide Object", onClick: () => this.setActiveTool("show_object"), title: "Select object", imgSrc: showObject },
                    { key: "undo", label: "Undo", onClick: () => this.setActiveTool("undo"), title: "Undo the process", imgSrc: iconundo },
                    { key: "redo", label: "Redo", onClick: () => this.setActiveTool("redo"), title: "Redo the process", imgSrc: iconredo },
                    { key: "clear", label: "Clear", onClick: () => this.setActiveTool("clear"), title: "Clear all objects", imgSrc: deleteAll }
                ]
            },
            {
                name: "Construct",
                tools: [
                    { key: "midpoint", label: "Midpoint or Center", onClick: () => this.setActiveTool("midpoint"), title: "Select 2 points, a segment or a circle", imgSrc: midpoint_center },
                    { key: "perpendicular", label: "Perpendicular Line", onClick: () => this.setActiveTool("perpendicular"), title: "Select perpendicular line and point", imgSrc: perpen_line },
                    { key: "perpendicular_bisector", label: "Perpendicular Bisector", onClick: () => this.setActiveTool("perpendicular_bisector"), title: "Select 2 points or a segment", imgSrc: perpen_bisector },
                    { key: "parallel", label: "Parallel Line", onClick: () => this.setActiveTool("parallel"), title: "Select parallel line and point", imgSrc: parallel_line },
                    { key: "angle_bisector", label: "Angle Bisector", onClick: () => this.setActiveTool("angle_bisector"), title: "Select 2 lines, or 3 points", imgSrc: angle_bisector },
                    { key: "tangent", label: "Tangents", onClick: () => this.setActiveTool("tangent"), title: "Select point, then circle", imgSrc: tangents },
                ]
            },
            {
                name: "Points",
                tools: [
                    { key: "point", label: "Point", onClick: () => this.setActiveTool("point"), title: "Select position or object", imgSrc: newPoint },
                    { key: "intersection", label: "Intersect", onClick: () => this.setActiveTool("intersection"), title: "Select intersection or 2 objects", imgSrc: intersection },
                    { key: "circumcenter", label: "Circumcenter of Triangle", onClick: () => this.setActiveTool("circumcenter"), title: "Select 3 non-collinear points or polygon with 3 vertices" },
                    { key: "incenter", label: "Incenter of Triangle", onClick: () => this.setActiveTool("incenter"), title: "Select 3 non-collinear points or polygon with 3 vertices", imgSrc: incenter },
                    { key: "excenter", label: "Excenter of Triangle", onClick: () => this.setActiveTool("excenter"), title: "Select 3 non-collinear points or polygon with 3 vertices", imgSrc: excenter },
                    { key: "orthocenter", label: "Orthocenter of Triangle", onClick: () => this.setActiveTool("orthocenter"), title: "Select 3 non-collinear points or polygon with 3 vertices" },
                    { key: "centroid", label: "Centroid of Triangle", onClick: () => this.setActiveTool("centroid"), title: "Select 3 non-collinear points or polygon with 3 vertices" }
                ]
            },
            {
                name: "Measure",
                tools: [
                    { key: "angle", label: "Angle", onClick: () => this.setActiveTool("angle"), title: "Select 2 lines or 3 points", imgSrc: angle },
                    { key: "length", label: "Distance or Length", onClick: () => this.setActiveTool("length"), title: "Select 2 points or segment, polygon, circle", imgSrc: length },
                    { key: "area", label: "Area", onClick: () => this.setActiveTool("area"), title: "Select polygon or circle", imgSrc: area }
                ]
            },
            {
                name: "Lines",
                tools: [
                    { key: "vector", label: "Vector", onClick: () => this.setActiveTool("vector"), title: "Select 2 points", imgSrc: vector },
                    { key: "line", label: "Line", onClick: () => this.setActiveTool("line"), title: "Select 2 points", imgSrc: line },
                    { key: "ray", label: "Ray", onClick: () => this.setActiveTool("ray"), title: "Select 2 points", imgSrc: ray },
                    { key: "segment", label: "Segment", onClick: () => this.setActiveTool("segment"), title: "Select 2 points", imgSrc: segment },
                    { key: "segment_length", label: "Segment with Given Length", onClick: () => this.setActiveTool("segment_length"), title: "Select point, then enter length", imgSrc: segment_length },
                ]
            },
            {
                name: "Circles",
                tools: [
                    { key: "circle", label: "Circle: Center & Radius", onClick: () => this.setActiveTool("circle"), title: "Select a center, then enter its radius", imgSrc: circle_center_radius },
                    { key: "circle_2_points", label: "Circle: Center & Point", onClick: () => this.setActiveTool("circle_2_points"), title: "Select a center, then point on circle", imgSrc: circle_center_point },
                    { key: "circumcircle", label: "Circle through 3 points", onClick: () => this.setActiveTool("circumcircle"), title: "Select 3 points on the circle", imgSrc: circle_3_points },
                    { key: "semicircle", label: "Semicircle", onClick: () => this.setActiveTool("semicircle"), title: "Select 2 end points", imgSrc: semicircle },
                    { key: "incircle", label: "Incircle of Triangle", onClick: () => this.setActiveTool("incircle"), title: "Select 3 non-collinear points or polygon with 3 vertices", imgSrc: incircle },
                    { key: "excircle", label: "Excircle of Triangle", onClick: () => this.setActiveTool("excircle"), title: "Select 3 non-collinear points or polygon with 3 vertices", imgSrc: excircle },
                ]
            },
            {
                name: "Polygon",
                tools: [
                    { key: "polygon", label: "Polygon", onClick: () => this.setActiveTool("polygon"), title: "Select all vertices, then click on the first point again" },
                    { key: "reg_polygon", label: "Regular Polygon", onClick: () => this.setActiveTool("reg_polygon"), title: "Select 2 points, then enter number of vertices" },
                ]
            },
            {
                name: "Transform",
                tools: [
                    { key: "translation", label: "Translate by Vector", onClick: () => this.setActiveTool("translation"), title: "Select object to translate, then vector" },
                    { key: "rotation", label: "Rotate around Point", onClick: () => this.setActiveTool("rotation"), title: "Select object to rotate and center point, then enter angle" },
                    { key: "scaling", label: "Dilate from Point", onClick: () => this.setActiveTool("scaling"), title: "Select object, then center point, then enter factor" },
                    { key: "reflect_point", label: "Reflect about Point", onClick: () => this.setActiveTool("reflect_point"), title: "Select object to reflect, then center point" },
                    { key: "reflect_line", label: "Reflect about Line", onClick: () => this.setActiveTool("reflect_line"), title: "Select object to reflect, then line of reflection" },
                    { key: "projection", label: "Project to Line", onClick: () => this.setActiveTool("projection"), title: "Select point or segment to project, then line to project onto" },
                ]
            }
        ];

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
                {toolCategories.map((category) => (
                    <div key={category.name}
                        className={`tool-category ${this.state.openCategory === category.name ? "open" : ""}`}
                    >
                        <div className="catLabel text-neutral-900" 
                            onClick={() => this.toolCategoryClicked(category.name)}
                            style={{cursor: 'pointer'}}
                        >
                            <span>{category.name}</span>
                            <div className={`arrowBox ${this.state.openCategory === category.name ? "open" : ""}`}>
                                <ArrowRightIcon sx={{ fontSize: 20 }} />
                            </div>
                        </div>
                        {this.state.openCategory === category.name && (
                            <div
                                className="categoryPanel"
                            >
                                {category.tools.map((tool) => (
                                    <Button
                                        key={tool.key}
                                        label={tool.label}
                                        title={tool.title}
                                        imgSrc={'imgSrc' in tool ? tool.imgSrc as string : ""}
                                        onClick={tool.onClick}
                                        selected={this.state.activeButton === tool.key}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                </div>
            </div>
        )
    }
}

interface GeometryTool3DProps {
    width: number;
    height: number;
    onPointClick: () => void;
    onLineClick: () => void;
    onSegmentClick: () => void;
    onVectorClick: () => void;
    onLengthClick: () => void;
    onAreaClick: () => void;
    onVolumeClick: () => void;
    onUndoClick: () => void;
    onRegularPolygonClick: () => void;
    onTranslationClick: () => void;
    onRotationClick: () => void;
    onReflectPlaneClick: () => void;
    onReflectLineClick: () => void;
    onReflectPointClick: () => void;
    onProjectionClick: () => void;
    onScalingClick: () => void;
    onIntersectionClick: () => void;
    onRayClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onClearClick: () => void;
    onRedoClick: () => void;
    onAngleClick: () => void;
    onHideLabelClick: () => void;
    onHideObjectClick: () => void;
    onMidPointClick: () => void;
    onPerpenLineClick: () => void;
    onPerpenBisecClick: () => void;
    onParaLineClick: () => void;
    onAngleBisecClick: () => void;
    onTangentLineClick: () => void;
    onSegmentLengthClick: () => void;
    onPolygonClick: () => void;
    onSphere2PointClick: () => void;
    onPlane3PointClick: () => void;
    onPyramidClick: () => void;
    onPrismClick: () => void;
    onConeClick: () => void;
    onPlaneClick: () => void;
    onParaPlaneClick: () => void;
    onPerpenPlaneClick: () => void;
    onCircumcircleClick: () => void;
    onCircleAxisClick: () => void;
    onCircleDirectionClick: () => void;
    onCylinderClick: () => void;
    onSphereClick: () => void;
    onTetrahedronClick: () => void;
    onExtrudePyramidClick: () => void;
    onExtrudePrismClick: () => void;
}

export class GeometryTool3D extends React.Component<GeometryTool3DProps, GeometryToolState> {
    constructor(props: GeometryTool3DProps) {
        super(props);
        this.state = {
            activeButton: null,
            openCategory: null
        }
    }

    toolCategoryClicked(categoryName: string) {
        this.setState((prevState) => ({
            openCategory: prevState.openCategory === categoryName ? null : categoryName
        }))
    }

    setActiveTool(toolKey: string) {
        this.setState({ activeButton: toolKey });
        if (toolKey === "point") {
            this.props.onPointClick();
        }

        else if (toolKey === "line") {
            this.props.onLineClick();
        }

        else if (toolKey === "segment") {
            this.props.onSegmentClick();
        }

        else if (toolKey === "vector") {
            this.props.onVectorClick();
        }

        else if (toolKey === "segment_length") {
            this.props.onSegmentLengthClick();
        }

        else if (toolKey === "polygon") {
            this.props.onPolygonClick();
        }

        else if (toolKey === "ray") {
            this.props.onRayClick();
        }

        else if (toolKey === "edit") {
            this.props.onEditClick();
        }

        else if (toolKey === "delete") {
            this.props.onDeleteClick();
        }

        else if (toolKey === "clear") {
            this.props.onClearClick();
        }

        else if (toolKey === "undo") {
            this.props.onUndoClick();
        }

        else if (toolKey === "redo") {
            this.props.onRedoClick();
        }

        else if (toolKey === "angle") {
            this.props.onAngleClick();
        }

        else if (toolKey === "show_label") {
            this.props.onHideLabelClick();
        }

        else if (toolKey === "show_object") {
            this.props.onHideObjectClick();
        }

        else if (toolKey === "midpoint") {
            this.props.onMidPointClick();
        }

        else if (toolKey === "perpendicular") {
            this.props.onPerpenLineClick();
        }

        else if (toolKey === "perpendicular_bisector") {
            this.props.onPerpenBisecClick();
        }

        else if (toolKey === "parallel") {
            this.props.onParaLineClick();
        }

        else if (toolKey === "angle_bisector") {
            this.props.onAngleBisecClick();
        }

        else if (toolKey === "tangent") {
            this.props.onTangentLineClick();
        }

        else if (toolKey === "intersection") {
            this.props.onIntersectionClick();
        }

        else if (toolKey === "length") {
            this.props.onLengthClick();
        }

        else if (toolKey === "area") {
            this.props.onAreaClick();
        }

        else if (toolKey === "volume") {
            this.props.onVolumeClick();
        }

        else if (toolKey === "sphere_2_points") {
            this.props.onSphere2PointClick();
        }

        else if (toolKey === "plane_3_points") {
            this.props.onPlane3PointClick();
        }

        else if (toolKey === "reg_polygon") {
            this.props.onRegularPolygonClick();
        }

        else if (toolKey === "translation") {
            this.props.onTranslationClick();
        }

        else if (toolKey === "scaling") {
            this.props.onScalingClick();
        }

        else if (toolKey === "rotation") {
            this.props.onRotationClick();
        }

        else if (toolKey === "projection") {
            this.props.onProjectionClick();
        }

        else if (toolKey === "reflect_point") {
            this.props.onReflectPointClick();
        }

        else if (toolKey === "reflect_line") {
            this.props.onReflectLineClick();
        }

        else if (toolKey === "reflect_plane") {
            this.props.onReflectPlaneClick();
        }

        else if (toolKey === 'pyramid') {
            this.props.onPyramidClick();
        }

        else if (toolKey === 'cylinder') {
            this.props.onCylinderClick();
        }

        else if (toolKey === 'prism') {
            this.props.onPrismClick();
        }

        else if (toolKey === 'sphere') {
            this.props.onSphereClick();
        }

        else if (toolKey === 'cone') {
            this.props.onConeClick();
        }

        else if (toolKey === 'extrude_pyramid') {
            this.props.onExtrudePyramidClick();
        }

        else if (toolKey === 'extrude_prism') {
            this.props.onExtrudePrismClick();
        }

        else if (toolKey === 'plane') {
            this.props.onPlaneClick();
        }

        else if (toolKey === 'parallel_plane') {
            this.props.onParaPlaneClick();
        }

        else if (toolKey === 'perpendicular_plane') {
            this.props.onPerpenPlaneClick();
        }

        else if (toolKey === 'circumcircle') {
            this.props.onCircumcircleClick();
        }

        else if (toolKey === 'circle_axis_point') {
            this.props.onCircleAxisClick();
        }

        else if (toolKey === 'circle_center_direction') {
            this.props.onCircleDirectionClick();
        }

        else if (toolKey === 'tetrahedron') {
            this.props.onTetrahedronClick();
        }
    }

    render(): React.ReactNode {
        const toolCategories = [
            {
                name: "Basic Tools",
                tools: [
                    { key: "point", label: "Point", onClick: () => this.setActiveTool("point"), title: "Select position or object", imgSrc: newPoint },
                    { key: "pyramid", label: "Pyramid", onClick: () => this.setActiveTool("pyramid"), title: "Select a polygon for bottom, then select apex" },
                    { key: "sphere_2_points", label: "Sphere: Center & Point", onClick: () => this.setActiveTool("sphere_2_points"), title: "Select a center, then point on sphere" },
                    { key: "plane_3_points", label: "Plane through 3 Points", onClick: () => this.setActiveTool("plane_3_points"), title: "Select 3 points" },
                    { key: "edit", label: "Edit", onClick: () => this.setActiveTool("edit"), title: "Move the objects or View", imgSrc: edit }
                ]
            },
            {
                name: "Edit",
                tools: [
                    { key: "delete", label: "Delete", onClick: () => this.setActiveTool("delete"), title: "Select the object to delete", imgSrc: deleteObject },
                    { key: "show_label", label: "Show / Hide Label", onClick: () => this.setActiveTool("show_label"), title: "Select object", imgSrc: showLabel },
                    { key: "show_object", label: "Show / Hide Object", onClick: () => this.setActiveTool("show_object"), title: "Select object", imgSrc: showObject },
                    { key: "undo", label: "Undo", onClick: () => this.setActiveTool("undo"), title: "Undo the process", imgSrc: iconundo },
                    { key: "redo", label: "Redo", onClick: () => this.setActiveTool("redo"), title: "Redo the process", imgSrc: iconredo },
                    { key: "clear", label: "Clear", onClick: () => this.setActiveTool("clear"), title: "Clear all objects", imgSrc: deleteAll }
                ]
            },
            {
                name: "Construct",
                tools: [
                    { key: "midpoint", label: "Midpoint or Center", onClick: () => this.setActiveTool("midpoint"), title: "Select 2 points, a segment or a circle", imgSrc: midpoint_center },
                    { key: "perpendicular", label: "Perpendicular Line", onClick: () => this.setActiveTool("perpendicular"), title: "Select perpendicular line or plane, then a point" },
                    { key: "perpendicular_bisector", label: "Perpendicular Bisector", onClick: () => this.setActiveTool("perpendicular_bisector"), title: "Select 2 points or a segment" },
                    { key: "parallel", label: "Parallel Line", onClick: () => this.setActiveTool("parallel"), title: "Select parallel line and point", imgSrc: parallel_line },
                    { key: "angle_bisector", label: "Angle Bisector", onClick: () => this.setActiveTool("angle_bisector"), title: "Select 2 lines, or 3 points", imgSrc: angle_bisector },
                    { key: "tangent", label: "Tangents", onClick: () => this.setActiveTool("tangent"), title: "Select point, then circle", imgSrc: tangents },
                ]
            },
            {
                name: "Points",
                tools: [
                    { key: "point", label: "Point", onClick: () => this.setActiveTool("point"), title: "Select position or object", imgSrc: newPoint },
                    { key: "intersection", label: "Intersect", onClick: () => this.setActiveTool("intersection"), title: "Select intersection or 2 objects", imgSrc: intersection },
                ]
            },
            {
                name: "Measure",
                tools: [
                    { key: "angle", label: "Angle", onClick: () => this.setActiveTool("angle"), title: "Select 2 lines or 3 points", imgSrc: angle },
                    { key: "length", label: "Distance or Length", onClick: () => this.setActiveTool("length"), title: "Select 2 points or segment, polygon, circle", imgSrc: length },
                    { key: "area", label: "Area", onClick: () => this.setActiveTool("area"), title: "Select polygon or circle for normal area calculation, solid for surface area", imgSrc: area },
                    { key: "volume", label: "Volume", onClick: () => this.setActiveTool("volume"), title: "Select a solid (pyramid, sphere, prism, etc.)", imgSrc: volume }
                ]
            },
            {
                name: "Lines",
                tools: [
                    { key: "vector", label: "Vector", onClick: () => this.setActiveTool("vector"), title: "Select 2 points", imgSrc: vector },
                    { key: "line", label: "Line", onClick: () => this.setActiveTool("line"), title: "Select 2 points", imgSrc: line },
                    { key: "ray", label: "Ray", onClick: () => this.setActiveTool("ray"), title: "Select 2 points", imgSrc: ray },
                    { key: "segment", label: "Segment", onClick: () => this.setActiveTool("segment"), title: "Select 2 points", imgSrc: segment },
                    { key: "segment_length", label: "Segment with Given Length", onClick: () => this.setActiveTool("segment_length"), title: "Select point, then enter length", imgSrc: segment_length },
                ]
            },
            {
                name: "Planes",
                tools: [
                    { key: "plane_3_points", label: "Plane through 3 Points", onClick: () => this.setActiveTool("plane_3_points"), title: "Select 3 points" },
                    { key: "plane", label: "Plane", onClick: () => this.setActiveTool("plane"), title: "Select 3 points, or point and line, or 2 lines, or polygon" },
                    { key: "parallel_plane", label: "Parallel Plane", onClick: () => this.setActiveTool("parallel_plane"), title: "Select point and parallel plane" },
                    { key: "perpendicular_plane", label: "Perpendicular Plane", onClick: () => this.setActiveTool("perpendicular_plane"), title: "Select point and perpendicular line" },
                    { key: "perpendicular_bisector", label: "Perpendicular Bisector", onClick: () => this.setActiveTool("perpendicular_bisector"), title: "Select 2 points or a segment" }
                ]
            },
            {
                name: "Solids",
                tools: [
                    { key: "pyramid", label: "Pyramid", onClick: () => this.setActiveTool("pyramid"), title: "Select a polygon for bottom, then select apex" },
                    { key: "tetrahedron", label: "Tetrahedron", onClick: () => this.setActiveTool("tetrahedron"), title: "Select 3 points on the same plane, then apex" },
                    { key: "sphere_2_points", label: "Sphere: Center & Point", onClick: () => this.setActiveTool("sphere_2_points"), title: "Select a center, then point on sphere" },
                    { key: "sphere", label: "Sphere: Center & Radius", onClick: () => this.setActiveTool("sphere"), title: "Select a center, then enter radius" },
                    { key: "cone", label: "Cone", onClick: () => this.setActiveTool("cone"), title: "Select a bottom point, then top point, then enter radius" },
                    { key: "cylinder", label: "Cylinder", onClick: () => this.setActiveTool("cylinder"), title: "Select a bottom point, then top point, then enter radius" },
                    { key: "prism", label: "Prism", onClick: () => this.setActiveTool("prism"), title: "Select a polygon for bottom, then enter its height" },
                ]
            },
            {
                name: "Circles",
                tools: [
                    { key: "circle_axis_point", label: "Circle with Axis through Point", onClick: () => this.setActiveTool("circle_axis_point"), title: "Select an axis, then point on circle" },
                    { key: "circle_center_direction", label: "Circle: Center, Radius and Direction", onClick: () => this.setActiveTool("circle_center_direction"), title: "Select center point, then direction, then enter radius" },
                    { key: "circumcircle", label: "Circle through 3 points", onClick: () => this.setActiveTool("circumcircle"), title: "Select 3 points on the circle" },
                ]
            },
            {
                name: "Polygon",
                tools: [
                    { key: "polygon", label: "Polygon", onClick: () => this.setActiveTool("polygon"), title: "Select all vertices on the same plane, then click on the first point again" },
                    { key: "reg_polygon", label: "Regular Polygon", onClick: () => this.setActiveTool("reg_polygon"), title: "Select 2 points, then direction, then enter number of vertices" },
                ]
            },
            {
                name: "Transform",
                tools: [
                    { key: "translation", label: "Translate by Vector", onClick: () => this.setActiveTool("translation"), title: "Select object to translate, then vector" },
                    { key: "rotation", label: "Rotate around Point", onClick: () => this.setActiveTool("rotation"), title: "Select object to rotate and center point, then enter angle" },
                    { key: "scaling", label: "Dilate from Point", onClick: () => this.setActiveTool("scaling"), title: "Select object, then center point, then enter factor" },
                    { key: "reflect_point", label: "Reflect about Point", onClick: () => this.setActiveTool("reflect_point"), title: "Select object to reflect, then center point" },
                    { key: "reflect_line", label: "Reflect about Line", onClick: () => this.setActiveTool("reflect_line"), title: "Select object to reflect, then line of reflection" },
                    { key: "reflect_plane", label: "Reflect about Plane", onClick: () => this.setActiveTool("reflect_plane"), title: "Select object to reflect, then plane of reflection" },
                    { key: "projection", label: "Project to Plane", onClick: () => this.setActiveTool("projection"), title: "Select point or segment to project, then plane to project onto" },
                ]
            }
        ];

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
                        width: '100%',
                        height: this.props.height,
                        padding: "8px 0px 14px 16px"
                    }}
                >
                {toolCategories.map((category) => (
                    <div key={category.name}
                        className={`tool-category ${this.state.openCategory === category.name ? "open" : ""}`}
                    >
                        <div className="catLabel text-neutral-900" 
                            onClick={() => this.toolCategoryClicked(category.name)}
                            style={{cursor: 'pointer'}}
                        >
                            <span>{category.name}</span>
                            <div className={`arrowBox ${this.state.openCategory === category.name ? "open" : ""}`}>
                                <ArrowRightIcon sx={{ fontSize: 20 }} />
                            </div>
                        </div>
                        {this.state.openCategory === category.name && (
                            <div
                                className="categoryPanel"
                            >
                                {category.tools.map((tool) => (
                                    <Button
                                        key={tool.key}
                                        label={tool.label}
                                        title={tool.title}
                                        imgSrc={'imgSrc' in tool ? tool.imgSrc as string : ""}
                                        onClick={tool.onClick}
                                        selected={this.state.activeButton === tool.key}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                </div>
            </div>
        )
    }
}
