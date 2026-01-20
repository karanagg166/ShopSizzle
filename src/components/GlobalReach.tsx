"use client";

import { useEffect, useRef, useState } from "react";
import ThreeGlobe from "three-globe";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Extend three-globe as a JSX element
extend({ ThreeGlobe });

const GlobeContent = () => {
    const globeRef = useRef<ThreeGlobe>(null);

    useEffect(() => {
        if (globeRef.current) {
            const globe = globeRef.current;

            // Initialize globe data
            const N = 20;
            const arcsData = [...Array(N).keys()].map(() => ({
                startLat: (Math.random() - 0.5) * 180,
                startLng: (Math.random() - 0.5) * 360,
                endLat: (Math.random() - 0.5) * 180,
                endLng: (Math.random() - 0.5) * 360,
                color: ["#d4af37", "#ffffff"][Math.round(Math.random())] // Gold and White
            }));

            globe
                .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
                .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
                .arcsData(arcsData)
                .arcColor('color')
                .arcDashLength(0.4)
                .arcDashGap(4)
                .arcDashInitialGap(() => Math.random() * 5)
                .arcDashAnimateTime(1000)
                .atmosphereColor('#d4af37')
                .atmosphereAltitude(0.25);
        }
    }, []);

    return (
        <>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} />
            {/* @ts-ignore - three-globe typing issue in JSX */}
            <threeGlobe ref={globeRef} />
        </>
    );
};

export default function GlobalReach() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full h-[500px] relative flex items-center justify-center bg-black/20 my-20 overflow-hidden">
            <div className="absolute top-10 text-center z-10 pointer-events-none">
                <h2 className="text-3xl font-heading font-bold text-primary mb-2">Worldwide Shipping</h2>
                <p className="text-muted-foreground text-sm uppercase tracking-widest">Global Reach, Local Touch</p>
            </div>
            <Canvas camera={{ position: [0, 0, 250] }}>
                <fog attach="fog" args={['#050505', 200, 500]} />
                <GlobeContent />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}
