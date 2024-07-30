/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 glasses.gltf --types
*/

import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useMediaQuery } from 'react-responsive';
import { useThree } from '@react-three/fiber';


type AdditionalProps = { randomColor1?: string, randomColor2?: string, frontToBack?: boolean }
export function Icon(props: JSX.IntrinsicElements['group'] & AdditionalProps) {
  const { nodes } = useGLTF('/auxdibot.gltf', false);
  let mesh = (nodes.Text as THREE.Mesh);
  const { camera } = useThree();
  const ref = useRef<THREE.Mesh | null>(null);
  const material = new THREE.ShaderMaterial({ side: THREE.DoubleSide, uniforms: {
    color1: {
      value: new THREE.Color(props.randomColor1 || "#fd644f")
    },
    color2: {
      value: new THREE.Color(props.randomColor2 || "#ff9d00")
    },
    bboxMin: {
      value: mesh.geometry.boundingBox?.min
    },
    bboxMax: {
      value: mesh.geometry.boundingBox?.max
    }
  },
  vertexShader: `
    uniform vec3 bboxMin;
    uniform vec3 bboxMax;
  
    varying vec2 vUv;

    void main() {
      vUv.x = (position.x - bboxMin.x) / (bboxMax.x - bboxMin.x);
      vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    varying vec2 vUv;
    
    void main() {
      
      gl_FragColor = vec4(mix(color1, color2, ${props.frontToBack ? 'vUv.y' : `vUv.x`}), 1.0);
    }
  `});

  const groupRef = useRef<THREE.Group | null>(null);
  const mobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    if (mobile) return;
    const handleMouseMove = (event: MouseEvent) => {
      if (!groupRef.current) return;

      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth) * 5 - 2.5;
      const y = -(clientY / innerHeight) * 5 + 4.5;

      // Convert to 3D space coordinates
      const vector = new THREE.Vector3(x, y, 0.9);
      vector.unproject(camera);

      // Make the group look at the converted vector
      groupRef.current.lookAt(vector);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });
  return (
    <group rotation={[0,0,0]} ref={groupRef} {...props} dispose={null}>
      <mesh ref={ref} rotation={[Math.PI/2,0,0]} geometry={mesh.geometry} material={material}/>
      
    </group>
  )
}

useGLTF.preload('/auxdibot.gltf')
