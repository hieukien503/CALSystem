import * as THREE from 'three'
import * as utils from '../utils/utilities3D'

interface AxisProps {
    length: number;
    radius: number;
    axisColor: string;
    pointerWidth: number;
    pointerLength: number;
    xTickSpacing: number;
    originX: number;
    originY: number;
    originZ: number;
    axisInterval: number;
}

class ThreeAxis {
    private props: AxisProps;
    constructor (props: AxisProps) {
        this.props = props;
    }

    generateAxis = (): THREE.Group => {
        const group = new THREE.Group();
        // Cylinder (line)
        const cylinderRadius = this.props.radius;
        const cylinderGeometry = new THREE.CylinderGeometry(
            cylinderRadius, cylinderRadius, this.props.length - this.props.pointerLength, 8
        );
        const material = new THREE.MeshStandardMaterial({ color: this.props.axisColor });
        const cylinder = new THREE.Mesh(cylinderGeometry, material);

        cylinder.position.y = (this.props.length - this.props.pointerLength) / 2;
        group.add(cylinder);

        // Cone (arrowhead)
        const coneHeight = this.props.pointerLength;
        const coneGeometry = new THREE.ConeGeometry(this.props.pointerWidth, coneHeight, 8);
        const cone = new THREE.Mesh(coneGeometry, material);

        cone.position.y = this.props.length - coneHeight / 2;
        group.add(cone);
        const [x0, y0, z0] = [this.props.originX, this.props.originY, this.props.originZ];

        if (this.props.axisColor === '#ff0000') {
            for (let i = -1; i < this.props.length - 1; i++) {
                const x = x0 + i;
                const sphereGeometry = new THREE.SphereGeometry(
                    this.props.radius * 3
                );

                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.position.set(0, i + 1, 0);
                const label = utils.createLabel(
                    (x).toString(),
                    new THREE.Vector3(0.2, 0.2, 0),
                    0, 0, 0,  // small Y offset
                    this.props.axisColor
                );
                sphere.add(label);
                group.add(sphere);
            }
        }

        else if (this.props.axisColor === '#00ff00') {
            for (let i = 1; i < this.props.length + 1; i++) {
                const z = i - z0;
                const sphereGeometry = new THREE.SphereGeometry(
                    this.props.radius * 3
                );

                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.position.set(0, i - 1, 0);
                const label = utils.createLabel(
                    (z).toString(),
                    new THREE.Vector3(-0.2, 0, 0.2),
                    0, 0, 0,  // offset slightly in X and Y
                    this.props.axisColor
                );
                sphere.add(label);
                group.add(sphere);
            }
        }

        else if (this.props.axisColor === '#0000ff') {
            for (let i = 0; i < this.props.length; i++) {
                const y = y0 + i;
                const sphereGeometry = new THREE.SphereGeometry(
                    this.props.radius * 3
                );

                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.position.set(0, i, 0);
                const label = utils.createLabel(
                    (y).toString(),
                    new THREE.Vector3(-0.2, 0, 0.2),
                    0, 0, 0, // offset in X and Z
                    this.props.axisColor
                );

                sphere.add(label);
                group.add(sphere);
            }
        }

        group.position.set(this.props.originX, this.props.originY, this.props.originZ);
        return group;
    }
}

export default ThreeAxis;