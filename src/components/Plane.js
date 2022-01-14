import React, { Component } from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Sky} from "three/examples/jsm/objects/Sky";

class Plane extends Component {

    initSky = ()=> {
        // Add Sky
        let sky = new Sky();
        sky.scale.setScalar( 450000 );
        // Add Sun
        let sun = new THREE.Vector3();

        const effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 2,
            azimuth: 180,
            exposure: this.renderer.toneMappingExposure
        };

        const uniforms = sky.material.uniforms;
        uniforms[ 'turbidity' ].value = effectController.turbidity;
        uniforms[ 'rayleigh' ].value = effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
        const theta = THREE.MathUtils.degToRad( effectController.azimuth );
        sun.setFromSphericalCoords( 1, phi, theta );
        uniforms[ 'sunPosition' ].value.copy( sun );
        this.renderer.toneMappingExposure = effectController.exposure;
        this.scene.add( sky );
    }

    initPlane = () => {
        // Plane
        let geometry = new THREE.PlaneBufferGeometry(15, 15, 50, 50)
        geometry.rotateX( - Math.PI / 2 );

        let vertices = geometry.attributes.position.array;

        for(let j = 1; j < vertices.length; j += 3){
            vertices[j] = Math.pow(Math.sin(0.31*vertices[j-1] - 0.32*vertices[j+1]), 2)+
                Math.pow(Math.cos(0.385*vertices[j-1] + 0.158*vertices[j+1]), 2);
        }
        // было бы круто сделать всё-таки облости с шумом, то есть чтоб были участи без шума и тп
        // for(let i = 1; i < vertices.length; i += 3){
        //     vertices[i] += Math.random()*0.2
        // }

        // Materials
        const material = new THREE.MeshStandardMaterial({
            color: 'gray',
            side: THREE.DoubleSide,
            roughness: 0.8,
            bumpScale: 0.02,
            metalness: 0.2
        })

        let plane = new THREE.Mesh(geometry, material)
        plane.castShadow = true;
        plane.receiveShadow = true;
        this.scene.add(plane)
        return vertices
    }

}

export default Plane
