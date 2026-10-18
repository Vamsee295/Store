"use client";
import { Canvas } from "@react-three/fiber";
import { Float, Environment, RoundedBox, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

function ObjectSet() {
  return <>
    <Float speed={1.2} rotationIntensity={.12} floatIntensity={.24}>
      <group rotation={[0.2,-0.25,0.04]}>
        <RoundedBox args={[1.65,.22,1.1]} radius={.12} smoothness={5} position={[0,-.35,0]} castShadow>
          <meshStandardMaterial color="#d4c7b5" roughness={.3} metalness={.12}/>
        </RoundedBox>
        <RoundedBox args={[.6,.72,.48]} radius={.1} smoothness={5} position={[-.35,.12,.02]} castShadow>
          <meshStandardMaterial color="#2b2b28" roughness={.26} metalness={.35}/>
        </RoundedBox>
        <RoundedBox args={[.35,.48,.32]} radius={.08} smoothness={5} position={[.45,.02,-.12]} castShadow>
          <meshStandardMaterial color="#b7a48a" roughness={.28} metalness={.25}/>
        </RoundedBox>
      </group>
    </Float>
    <ContactShadows position={[0,-.72,0]} opacity={.22} scale={4} blur={2.4} far={2}/>
    <Environment preset="studio"/>
  </>;
}
export function HeroScene() {
  return <div aria-label="Abstract 3D still life of considered everyday objects" role="img" style={{width:"100%",height:"100%",minHeight:340}}>
    <Canvas camera={{position:[0,1.5,4.6],fov:38}} dpr={[1,1.5]} shadows gl={{alpha:true,antialias:true}}>
      <ambientLight intensity={1.1}/><directionalLight position={[3,5,4]} intensity={2.3} castShadow/>
      <Suspense fallback={null}><ObjectSet/></Suspense>
    </Canvas>
  </div>;
}
