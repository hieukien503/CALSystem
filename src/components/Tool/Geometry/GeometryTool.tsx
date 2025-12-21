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
import reg_polygon from '../../../assets/images/regular_polygon.svg';
import translation from '../../../assets/images/translation.svg';
import rotation from '../../../assets/images/rotation.svg';
import dilate from '../../../assets/images/dilate.svg';
import reflect_point from '../../../assets/images/reflect_point.svg';
import reflect_line from '../../../assets/images/reflect_line.svg';
import reflect_plane from '../../../assets/images/reflect_plane.svg';
import circumcenter from '../../../assets/images/circumcenter.svg';
import orthocenter from '../../../assets/images/orthocenter.svg';
import centroid from '../../../assets/images/centroid.svg';
import projection from '../../../assets/images/projection.svg';
import perpen_line_3d from '../../../assets/images/3d_perpen_line.svg';
import pyramid from '../../../assets/images/pyramid.svg';
import sphere_2_points from '../../../assets/images/sphere_2_points.svg';
import plane_3_points from '../../../assets/images/plane_three_points.svg';
import perpen_bisector_plane from '../../../assets/images/perpen_bisec_plane.svg';
import plane from '../../../assets/images/plane.svg';
import parallel_plane from '../../../assets/images/parallel_plane.svg';
import perpendicular_plane from '../../../assets/images/perpen_plane.svg';
import tetrahedron from '../../../assets/images/tetrahedron.svg';
import sphere_radius from '../../../assets/images/sphere_radius.svg';
import cone from '../../../assets/images/cone.svg';
import prism from '../../../assets/images/prism.svg';
import cylinder from '../../../assets/images/cylinder.svg';
import circle_center_radius_direction from '../../../assets/images/circle_center_radius_direction.svg';
import circle_point_axis from '../../../assets/images/circle_point_axis.svg';
import plane_projection from '../../../assets/images/plane_projection.svg';
import { t } from "../../../translation/i18n";

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
    openCategory: string[];
}

export class GeometryTool extends React.Component<GeometryToolProps, GeometryToolState> {
    constructor(props: GeometryToolProps) {
        super(props);
        this.state = {
            activeButton: null,
            openCategory: []
        }
    }

    toolCategoryClicked(categoryName: string) {
        const openCategory = [...this.state.openCategory];
        if (openCategory.includes(categoryName)) {
            this.setState(
                { openCategory: openCategory.filter(name => name !== categoryName) }
            )
        }
        
        else {
            this.setState(
                { openCategory: [...openCategory, categoryName] }
            )
        }
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
                name: t("basicTools"),
                tools: [
                    { key: "point", label: t("point"), onClick: () => this.setActiveTool("point"), title: "Select position or object", imgSrc: newPoint },
                    { key: "line", label: t("line"), onClick: () => this.setActiveTool("line"), title: "Select 2 points", imgSrc: line },
                    { key: "segment", label: t("segment"), onClick: () => this.setActiveTool("segment"), title: "Select 2 points", imgSrc: segment },
                    { key: "polygon", label: t("polygon"), onClick: () => this.setActiveTool("polygon"), title: "Select all vertices, then click on the first point again",imgSrc: polygon },
                    { key: "circle", label: t("circle"), onClick: () => this.setActiveTool("circle"), title: "Select a center, then enter its radius", imgSrc: circle_center_radius },
                    { key: "edit", label: t("edit"), onClick: () => this.setActiveTool("edit"), title: "Move the objects or View", imgSrc: edit }
                ]
            },
            {
                name: t("edit"),
                tools: [
                    { key: "delete", label: t("delete"), onClick: () => this.setActiveTool("delete"), title: "Select the object to delete", imgSrc: deleteObject },
                    { key: "show_label", label: t("showLabel"), onClick: () => this.setActiveTool("show_label"), title: "Select object", imgSrc: showLabel },
                    { key: "show_object", label: t("showObject"), onClick: () => this.setActiveTool("show_object"), title: "Select object", imgSrc: showObject },
                    { key: "undo", label: t("undo"), onClick: () => this.setActiveTool("undo"), title: "Undo the process", imgSrc: iconundo },
                    { key: "redo", label: t("redo"), onClick: () => this.setActiveTool("redo"), title: "Redo the process", imgSrc: iconredo },
                    { key: "clear", label: t("clear"), onClick: () => this.setActiveTool("clear"), title: "Clear all objects", imgSrc: deleteAll }
                ]
            },
            {
                name: t("construct"),
                tools: [
                    { key: "midpoint", label: t("midpoint"), onClick: () => this.setActiveTool("midpoint"), title: "Select 2 points, a segment or a circle", imgSrc: midpoint_center },
                    { key: "perpendicular", label: t("perpendicular"), onClick: () => this.setActiveTool("perpendicular"), title: "Select perpendicular line and point", imgSrc: perpen_line },
                    { key: "perpendicular_bisector", label: t("perpendicularBisector"), onClick: () => this.setActiveTool("perpendicular_bisector"), title: "Select 2 points or a segment", imgSrc: perpen_bisector },
                    { key: "parallel", label: t("parallel"), onClick: () => this.setActiveTool("parallel"), title: "Select parallel line and point", imgSrc: parallel_line },
                    { key: "angle_bisector", label: t("angleBisector"), onClick: () => this.setActiveTool("angle_bisector"), title: "Select 2 lines, or 3 points", imgSrc: angle_bisector },
                    { key: "tangent", label: t("tangents"), onClick: () => this.setActiveTool("tangent"), title: "Select point, then circle", imgSrc: tangents },
                ]
            },
            {
                name: t("points"),
                tools: [
                    { key: "point", label: t("point"), onClick: () => this.setActiveTool("point"), title: "Select position or object", imgSrc: newPoint },
                    { key: "intersection", label: t("intersection"), onClick: () => this.setActiveTool("intersection"), title: "Select intersection or 2 objects", imgSrc: intersection },
                    { key: "circumcenter", label: t("circumcenter"), onClick: () => this.setActiveTool("circumcenter"), title: "Select 3 non-collinear points or polygon with 3 vertices", imgSrc: circumcenter },
                    { key: "incenter", label: t("excenter"), onClick: () => this.setActiveTool("incenter"), title: "Select 3 non-collinear points or polygon with 3 vertices", imgSrc: incenter },
                    { key: "excenter", label: t("incenter"), onClick: () => this.setActiveTool("excenter"), title: "Select 3 non-collinear points or polygon with 3 vertices", imgSrc: excenter },
                    { key: "orthocenter", label: t("orthocenter"), onClick: () => this.setActiveTool("orthocenter"), title: "Select 3 non-collinear points or polygon with 3 vertices", imgSrc: orthocenter },
                    { key: "centroid", label: t("centroid"), onClick: () => this.setActiveTool("centroid"), title: "Select 3 non-collinear points or polygon with 3 vertices", imgSrc: centroid }
                ]
            },
            {
                name: t("measure"),
                tools: [
                    { key: "angle", label: t("angle"), onClick: () => this.setActiveTool("angle"), title: "Select 2 lines or 3 points", imgSrc: angle },
                    { key: "length", label: t("length"), onClick: () => this.setActiveTool("length"), title: "Select 2 points or segment, polygon, circle", imgSrc: length },
                    { key: "area", label: t("area"), onClick: () => this.setActiveTool("area"), title: "Select polygon or circle", imgSrc: area }
                ]
            },
            {
                name: t("lines"),
                tools: [
                    { key: "vector", label: t("vector"), onClick: () => this.setActiveTool("vector"), title: "Select 2 points", imgSrc: vector },
                    { key: "line", label: t("line"), onClick: () => this.setActiveTool("line"), title: "Select 2 points", imgSrc: line },
                    { key: "ray", label: t("ray"), onClick: () => this.setActiveTool("ray"), title: "Select 2 points", imgSrc: ray },
                    { key: "segment", label: t("segment"), onClick: () => this.setActiveTool("segment"), title: "Select 2 points", imgSrc: segment },
                    { key: "segment_length", label: t("segmentLength"), onClick: () => this.setActiveTool("segment_length"), title: "Select point, then enter length", imgSrc: segment_length },
                ]
            },
            {
                name: t("circles"),
                tools: [
                    { key: "circle", label: t("circle"), onClick: () => this.setActiveTool("circle"), title: "Select a center, then enter its radius", imgSrc: circle_center_radius },
                    { key: "circle_2_points", label: t("circle2Points"), onClick: () => this.setActiveTool("circle_2_points"), title: "Select a center, then point on circle", imgSrc: circle_center_point },
                    { key: "circumcircle", label: t("circumcircle"), onClick: () => this.setActiveTool("circumcircle"), title: "Select 3 points on the circle", imgSrc: circle_3_points },
                    { key: "semicircle", label: t("semicircle"), onClick: () => this.setActiveTool("semicircle"), title: "Select 2 end points", imgSrc: semicircle },
                    { key: "incircle", label: t("incircle"), onClick: () => this.setActiveTool("incircle"), title: "Select 3 non-collinear points or polygon with 3 vertices", imgSrc: incircle },
                    { key: "excircle", label: t("excircle"), onClick: () => this.setActiveTool("excircle"), title: "Select 3 non-collinear points or polygon with 3 vertices", imgSrc: excircle },
                ]
            },
            {
                name: t("polygon"),
                tools: [
                    { key: "polygon", label: t("polygon"), onClick: () => this.setActiveTool("polygon"), title: "Select all vertices, then click on the first point again", imgSrc: polygon },
                    { key: "reg_polygon", label: t("regPolygon"), onClick: () => this.setActiveTool("reg_polygon"), title: "Select 2 points, then enter number of vertices", imgSrc: reg_polygon },
                ]
            },
            {
                name: t("transform"),
                tools: [
                    { key: "translation", label: t("translation"), onClick: () => this.setActiveTool("translation"), title: "Select object to translate, then vector", imgSrc: translation },
                    { key: "rotation", label: t("rotation"), onClick: () => this.setActiveTool("rotation"), title: "Select object to rotate and center point, then enter angle", imgSrc: rotation },
                    { key: "scaling", label: t("scaling"), onClick: () => this.setActiveTool("scaling"), title: "Select object, then center point, then enter factor", imgSrc: dilate },
                    { key: "reflect_point", label: t("reflectPoint"), onClick: () => this.setActiveTool("reflect_point"), title: "Select object to reflect, then center point", imgSrc: reflect_point },
                    { key: "reflect_line", label: t("reflectLine"), onClick: () => this.setActiveTool("reflect_line"), title: "Select object to reflect, then line of reflection", imgSrc: reflect_line },
                    { key: "projection", label: t("projection"), onClick: () => this.setActiveTool("projection"), title: "Select point or segment to project, then line to project onto", imgSrc: projection },
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
                        padding: "8px 0px 14px 16px",
                    }}
                >
                {toolCategories.map((category) => (
                    <div key={category.name}
                        className={`tool-category ${this.state.openCategory.includes(category.name) ? "open" : ""}`}
                        style={{cursor: 'pointer'}}
                    >
                        <div className="catLabel text-neutral-900" 
                            onClick={() => this.toolCategoryClicked(category.name)}
                        >
                            <span>{category.name}</span>
                            <div className={`arrowBox ${this.state.openCategory.includes(category.name) ? "open" : ""}`}>
                                <ArrowRightIcon sx={{ fontSize: 20 }} />
                            </div>
                        </div>
                        {this.state.openCategory.includes(category.name) && (
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
}

export class GeometryTool3D extends React.Component<GeometryTool3DProps, GeometryToolState> {
    constructor(props: GeometryTool3DProps) {
        super(props);
        this.state = {
            activeButton: null,
            openCategory: []
        }
    }

    toolCategoryClicked(categoryName: string) {
        const openCategory = [...this.state.openCategory];
        if (openCategory.includes(categoryName)) {
            this.setState(
                { openCategory: openCategory.filter(name => name !== categoryName) }
            )
        }
        
        else {
            this.setState(
                { openCategory: [...openCategory, categoryName] }
            )
        }
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
                name: t("basicTools"),
                tools: [
                    { key: "point", label: t("point"), onClick: () => this.setActiveTool("point"), title: "Select position or object", imgSrc: newPoint },
                    { key: "pyramid", label: t("pyramid"), onClick: () => this.setActiveTool("pyramid"), title: "Select a polygon for bottom, then select apex", imgSrc: pyramid },
                    { key: "sphere_2_points", label: t("sphere2Points"), onClick: () => this.setActiveTool("sphere_2_points"), title: "Select a center, then point on sphere", imgSrc: sphere_2_points },
                    { key: "plane_3_points", label: t("plane3Points"), onClick: () => this.setActiveTool("plane_3_points"), title: "Select 3 points", imgSrc: plane_3_points },
                    { key: "edit", label: t("edit"), onClick: () => this.setActiveTool("edit"), title: "Move the objects or View", imgSrc: edit }
                ]
            },
            {
                name: t("edit"),
                tools: [
                    { key: "delete", label: t("delete"), onClick: () => this.setActiveTool("delete"), title: "Select the object to delete", imgSrc: deleteObject },
                    { key: "show_label", label: t("showLabel"), onClick: () => this.setActiveTool("show_label"), title: "Select object", imgSrc: showLabel },
                    { key: "show_object", label: t("showObject"), onClick: () => this.setActiveTool("show_object"), title: "Select object", imgSrc: showObject },
                    { key: "undo", label: t("undo"), onClick: () => this.setActiveTool("undo"), title: "Undo the process", imgSrc: iconundo },
                    { key: "redo", label: t("redo"), onClick: () => this.setActiveTool("redo"), title: "Redo the process", imgSrc: iconredo },
                    { key: "clear", label: t("clear"), onClick: () => this.setActiveTool("clear"), title: "Clear all objects", imgSrc: deleteAll }
                ]
            },
            {
                name: t("construct"),
                tools: [
                    { key: "midpoint", label: t("midpoint"), onClick: () => this.setActiveTool("midpoint"), title: "Select 2 points, a segment or a circle", imgSrc: midpoint_center },
                    { key: "perpendicular", label: t("perpendicular"), onClick: () => this.setActiveTool("perpendicular"), title: "Select perpendicular line or plane, then a point", imgSrc: perpen_line_3d },
                    { key: "perpendicular_bisector", label: t("perpendicularBisector"), onClick: () => this.setActiveTool("perpendicular_bisector"), title: "Select 2 points or a segment", imgSrc: perpen_bisector_plane },
                    { key: "parallel", label: t("parallel"), onClick: () => this.setActiveTool("parallel"), title: "Select parallel line and point", imgSrc: parallel_line },
                    { key: "angle_bisector", label: t("angleBisector"), onClick: () => this.setActiveTool("angle_bisector"), title: "Select 2 lines, or 3 points", imgSrc: angle_bisector },
                    { key: "tangent", label: t("tangents"), onClick: () => this.setActiveTool("tangent"), title: "Select point, then circle", imgSrc: tangents },
                ]
            },
            {
                name: t("points"),
                tools: [
                    { key: "point", label: t("point"), onClick: () => this.setActiveTool("point"), title: "Select position or object", imgSrc: newPoint },
                    { key: "intersection", label: t("intersection"), onClick: () => this.setActiveTool("intersection"), title: "Select intersection or 2 objects", imgSrc: intersection },
                ]
            },
            {
                name: t("measure"),
                tools: [
                    { key: "angle", label: t("angle"), onClick: () => this.setActiveTool("angle"), title: "Select 2 lines or 3 points", imgSrc: angle },
                    { key: "length", label: t("length"), onClick: () => this.setActiveTool("length"), title: "Select 2 points or segment, polygon, circle", imgSrc: length },
                    { key: "area", label: t("area"), onClick: () => this.setActiveTool("area"), title: "Select polygon or circle for normal area calculation, solid for surface area", imgSrc: area },
                    { key: "volume", label: t("volume"), onClick: () => this.setActiveTool("volume"), title: "Select a solid (pyramid, sphere, prism, etc.)", imgSrc: volume }
                ]
            },
            {
                name: t("lines"),
                tools: [
                    { key: "vector", label: t("vector"), onClick: () => this.setActiveTool("vector"), title: "Select 2 points", imgSrc: vector },
                    { key: "line", label: t("line"), onClick: () => this.setActiveTool("line"), title: "Select 2 points", imgSrc: line },
                    { key: "ray", label: t("ray"), onClick: () => this.setActiveTool("ray"), title: "Select 2 points", imgSrc: ray },
                    { key: "segment", label: t("segment"), onClick: () => this.setActiveTool("segment"), title: "Select 2 points", imgSrc: segment },
                    { key: "segment_length", label: t("segmentLength"), onClick: () => this.setActiveTool("segment_length"), title: "Select point, then enter length", imgSrc: segment_length },
                ]
            },
            {
                name: t("planes"),
                tools: [
                    { key: "plane_3_points", label: t("plane3Points"), onClick: () => this.setActiveTool("plane_3_points"), title: "Select 3 points", imgSrc: plane_3_points },
                    { key: "plane", label: t("plane"), onClick: () => this.setActiveTool("plane"), title: "Select 3 points, or point and line, or 2 lines, or polygon", imgSrc: plane },
                    { key: "parallel_plane", label: t("parallelPlane"), onClick: () => this.setActiveTool("parallel_plane"), title: "Select point and parallel plane", imgSrc: parallel_plane },
                    { key: "perpendicular_plane", label: t("perpendicularPlane"), onClick: () => this.setActiveTool("perpendicular_plane"), title: "Select point and perpendicular line", imgSrc: perpendicular_plane },
                    { key: "perpendicular_bisector", label: t("perpendicularBisectorPlane"), onClick: () => this.setActiveTool("perpendicular_bisector"), title: "Select 2 points or a segment", imgSrc: perpen_bisector_plane }
                ]
            },
            {
                name: t("solids"),
                tools: [
                    { key: "pyramid", label: t("pyramid"), onClick: () => this.setActiveTool("pyramid"), title: "Select a polygon for bottom, then select apex", imgSrc: pyramid },
                    { key: "tetrahedron", label: t("tetrahedron"), onClick: () => this.setActiveTool("tetrahedron"), title: "Select 3 points on the same plane, then apex", imgSrc: tetrahedron },
                    { key: "sphere_2_points", label: t("sphere2Points"), onClick: () => this.setActiveTool("sphere_2_points"), title: "Select a center, then point on sphere", imgSrc: sphere_2_points },
                    { key: "sphere", label: t("sphere"), onClick: () => this.setActiveTool("sphere"), title: "Select a center, then enter radius", imgSrc: sphere_radius },
                    { key: "cone", label: t("cone"), onClick: () => this.setActiveTool("cone"), title: "Select a bottom point, then top point, then enter radius", imgSrc: cone },
                    { key: "cylinder", label: t("cylinder"), onClick: () => this.setActiveTool("cylinder"), title: "Select a bottom point, then top point, then enter radius", imgSrc: cylinder },
                    { key: "prism", label: t("prism"), onClick: () => this.setActiveTool("prism"), title: "Select a polygon for bottom, then enter its height", imgSrc: prism },
                ]
            },
            {
                name: t("circles"),
                tools: [
                    { key: "circle_axis_point", label: t("circleAxisPoint"), onClick: () => this.setActiveTool("circle_axis_point"), title: "Select an axis, then point on circle", imgSrc: circle_point_axis },
                    { key: "circle_center_direction", label: t("circleCenterDirection"), onClick: () => this.setActiveTool("circle_center_direction"), title: "Select center point, then direction, then enter radius", imgSrc: circle_center_radius_direction },
                    { key: "circumcircle", label: t("circumcircle"), onClick: () => this.setActiveTool("circumcircle"), title: "Select 3 points on the circle", imgSrc: circumcenter },
                ]
            },
            {
                name: t("polygon"),
                tools: [
                    { key: "polygon", label: t("polygon"), onClick: () => this.setActiveTool("polygon"), title: "Select all vertices on the same plane, then click on the first point again", imgSrc: polygon },
                    { key: "reg_polygon", label: t("regPolygon"), onClick: () => this.setActiveTool("reg_polygon"), title: "Select 2 points, then direction, then enter number of vertices", imgSrc: reg_polygon },
                ]
            },
            {
                name: t("transform"),
                tools: [
                    { key: "translation", label: t("translation"), onClick: () => this.setActiveTool("translation"), title: "Select object to translate, then vector", imgSrc: translation },
                    { key: "rotation", label: t("rotation"), onClick: () => this.setActiveTool("rotation"), title: "Select object to rotate and center point, then enter angle", imgSrc: rotation },
                    { key: "scaling", label: t("scaling"), onClick: () => this.setActiveTool("scaling"), title: "Select object, then center point, then enter factor", imgSrc: dilate },
                    { key: "reflect_point", label: t("reflectPoint"), onClick: () => this.setActiveTool("reflect_point"), title: "Select object to reflect, then center point", imgSrc: reflect_point },
                    { key: "reflect_line", label: t("reflectLine"), onClick: () => this.setActiveTool("reflect_line"), title: "Select object to reflect, then line of reflection", imgSrc: reflect_line },
                    { key: "reflect_plane", label: t("reflectPlane"), onClick: () => this.setActiveTool("reflect_plane"), title: "Select object to reflect, then plane of reflection", imgSrc: reflect_plane },
                    { key: "projection", label: t("projectPlane"), onClick: () => this.setActiveTool("projection"), title: "Select point or segment to project, then plane to project onto", imgSrc: plane_projection },
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
                        className={`tool-category ${this.state.openCategory.includes(category.name) ? "open" : ""}`}
                    >
                        <div className="catLabel text-neutral-900" 
                            onClick={() => this.toolCategoryClicked(category.name)}
                            style={{cursor: 'pointer'}}
                        >
                            <span>{category.name}</span>
                            <div className={`arrowBox ${this.state.openCategory.includes(category.name) ? "open" : ""}`}>
                                <ArrowRightIcon sx={{ fontSize: 20 }} />
                            </div>
                        </div>
                        {this.state.openCategory.includes(category.name) && (
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
