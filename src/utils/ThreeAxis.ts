import * as THREE from 'three'
import * as utils from '../utils/utilities3D'

interface AxisProps {
    length: number;
    radius: number;
    axisColor: string;
    pointerWidth: number;
    pointerLength: number;
    xTickSpacing: number;
    axisInterval: number;
    ratio: number;
}

class ThreeAxis {
    private props: AxisProps;
    constructor (props: AxisProps) {
        this.props = props;
    }

    generateAxis = (): THREE.Group => {
        const group = new THREE.Group();
        const posLength = this.props.length / (1 + this.props.ratio);
        const negLength = posLength * this.props.ratio;
        // Cylinder (positive direction)
        const cylinderRadius = this.props.radius;
        const cylinderGeometry = new THREE.CylinderGeometry(
            cylinderRadius, cylinderRadius, posLength - this.props.pointerLength, 8
        );
        const material = new THREE.MeshStandardMaterial({ color: this.props.axisColor });
        const cylinder = new THREE.Mesh(cylinderGeometry, material);

        cylinder.position.y = (posLength - this.props.pointerLength) / 2;
        group.add(cylinder);

        // Cylinder (negative direction)
        const negCylinderGeometry = new THREE.CylinderGeometry(
            cylinderRadius, cylinderRadius, negLength, 8
        );

        const negCylinder = new THREE.Mesh(negCylinderGeometry, material);
        negCylinder.position.y = -negLength / 2;
        group.add(negCylinder);

        // Cone (arrowhead)
        const coneHeight = this.props.pointerLength;
        const coneGeometry = new THREE.ConeGeometry(this.props.pointerWidth, coneHeight, 8);
        const cone = new THREE.Mesh(coneGeometry, material);

        cone.position.y = posLength - coneHeight / 2;
        group.add(cone);
        const [x0, y0, z0] = [0, 0, 0];

        if (this.props.axisColor === '#ff0000') {
            for (let i = -Math.round(negLength); i < posLength; i++) {
                const x = x0 + i;
                const sphereGeometry = new THREE.SphereGeometry(
                    this.props.radius * 3
                );

                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.position.set(0, i, 0);
                const label = utils.createLabel(
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
                sphere.position.set(0, i, 0);
                const label = utils.createLabel(
                    z.toFixed(0).toString(),
                    new THREE.Vector3(-0.2, 0, 0.2),
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
                sphere.position.set(0, i, 0);
                const label = utils.createLabel(
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
        return group;
    }
}

export default ThreeAxis;