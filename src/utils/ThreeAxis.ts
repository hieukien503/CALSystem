import * as THREE from 'three'
import * as utils3d from '../utils/utilities3D'
import * as utils from '../utils/utilities'

interface AxisProps {
    length: number;
    radius: number;
    axisColor: string;
    pointerWidth: number;
    pointerLength: number;
    xTickSpacing: number;
    axisInterval: number;
    ratio: number;
    rotation: number[]; // Rotation in radians around X, Y, Z axes, measured in radians
}

class ThreeAxis {
    private props: AxisProps;
    constructor (props: AxisProps) {
        this.props = props;
    }

    generateAxis = (): THREE.Group => {
        if (this.props.rotation.length !== 3) {
            throw new Error('Rotation array must have exactly three elements.');
        }

        const group = new THREE.Group();
        const posLength = this.props.length / (1 + this.props.ratio);
        const negLength = posLength * this.props.ratio;
        
        const positions: THREE.Vector3[] = [
            new THREE.Vector3(0, -negLength, 0),
            new THREE.Vector3(0, posLength - this.props.pointerLength, 0)
        ];

        // Apply rotation to the axis
        const euler = new THREE.Euler(this.props.rotation[0], this.props.rotation[1], this.props.rotation[2]);
        positions.forEach(pos => pos.applyEuler(euler));

        const props = utils.createLineDefaultShapeProps(
            '',
            this.props.radius
        );

        props.color = this.props.axisColor;
        props.line_size = 2;

        const line = utils3d.createDashLine(positions, props);
        line.renderOrder = 15;
        group.add(line);

        // Cone (arrowhead)
        const coneHeight = this.props.pointerLength;
        const material = new THREE.MeshStandardMaterial({ color: this.props.axisColor, depthTest: false });
        const coneGeometry = new THREE.ConeGeometry(this.props.pointerWidth, coneHeight, 8);
        const cone = new THREE.Mesh(coneGeometry, material);

        cone.position.y = posLength - coneHeight / 2;
        cone.position.applyEuler(euler);
        // Rotate cone such that its apex points along the axis direction
        cone.setRotationFromEuler(new THREE.Euler(
            euler.x,
            euler.y,
            euler.z
        ));

        cone.renderOrder = 10;
        
        // Add label to cone
        const label = utils3d.createLabel(
            this.props.axisColor === '#ff0000' ? 'x' : (this.props.axisColor === '#00ff00' ? 'y' : 'z'),
            new THREE.Vector3(0.2, 0.2, 0),
            0, 0, 0,  // small Y offset
            this.props.axisColor
        );

        cone.add(label);
        group.add(cone);
        const [x0, y0, z0] = [0, 0, 0];

        if (this.props.axisColor === '#ff0000') {
            for (let i = -Math.round(negLength); i < posLength; i++) {
                const x = x0 + i;
                const sphereGeometry = new THREE.SphereGeometry(
                    this.props.radius * 3
                );

                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.renderOrder = 11;
                sphere.position.set(0, i, 0).applyEuler(euler);
                const label = utils3d.createLabel(
                    x.toFixed(0).toString(),
                    new THREE.Vector3(0.2, 0.2, 0),
                    0, 0, 0,  // small Y offset
                    this.props.axisColor
                );
                sphere.add(label);
                group.add(sphere);
            }
        }

        else if (this.props.axisColor === '#00ff00') {
            for (let i = -Math.round(negLength); i < posLength; i++) {
                const z = i - z0;
                const sphereGeometry = new THREE.SphereGeometry(
                    this.props.radius * 3
                );

                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.renderOrder = 11;
                sphere.position.set(0, i, 0).applyEuler(euler);
                const label = utils3d.createLabel(
                    z.toFixed(0).toString(),
                    new THREE.Vector3(-0.2, 0, -0.2),
                    0, 0, 0,  // offset slightly in X and Y
                    this.props.axisColor
                );

                sphere.add(label);
                group.add(sphere);
            }
        }

        else if (this.props.axisColor === '#0000ff') {
            for (let i = -Math.round(negLength); i < posLength; i++) {
                const y = y0 + i;
                const sphereGeometry = new THREE.SphereGeometry(
                    this.props.radius * 3
                );

                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.renderOrder = 11;
                sphere.position.set(0, i, 0).applyEuler(euler);
                const label = utils3d.createLabel(
                    (y <= 0 ? Math.trunc(y) : Math.round(y)).toFixed(0).toString(),
                    new THREE.Vector3(-0.2, 0, 0.2),
                    0, 0, 0, // offset in X and Z
                    this.props.axisColor
                );

                sphere.add(label);
                group.add(sphere);
            }
        }

        group.position.set(x0, y0, z0);
        group.renderOrder = 19
        return group;
    }
}

export default ThreeAxis;