/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Physics settings
const GRAVITY = 0.01;
const BOUNCE = 0.7;
const DRAG = 0.99;
const FLOOR_Y = -2.5;
const WALL_LEFT = -4;
const WALL_RIGHT = 4;

// Interactive image component with physics
function PhysicsImage({
  url,
  initialPosition,
  initialVelocity = { x: 0, y: 0 },
  scale = 1,
}: {
  url: string;
  initialPosition: { x: number; y: number };
  initialVelocity?: { x: number; y: number };
  scale?: number;
}) {
  const texture = useTexture(url);
  const meshRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(initialVelocity);
  const [dimensions, setDimensions] = useState<[number, number]>([1, 1]);
  const [isDragging, setIsDragging] = useState(false);

  // Handle image loading and set dimensions
  useEffect(() => {
    if (texture?.image) {
      const aspectRatio = texture.image.width / texture.image.height;
      const maxSize = 1.5 * scale;

      if (aspectRatio > 1) {
        setDimensions([maxSize, maxSize / aspectRatio]);
      } else {
        setDimensions([maxSize * aspectRatio, maxSize]);
      }

      // Improve texture quality
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  }, [texture, scale]);

  // Physics update on each frame
  useFrame(() => {
    if (!meshRef.current || isDragging) return;

    const mesh = meshRef.current;
    const position = mesh.position;
    const width = dimensions[0] / 2;
    const height = dimensions[1] / 2;

    // Apply gravity if not on floor
    if (position.y - height > FLOOR_Y) {
      velocity.current.y -= GRAVITY;
    }

    // Apply velocity
    position.x += velocity.current.x;
    position.y += velocity.current.y;

    // Handle floor collision
    if (position.y - height < FLOOR_Y) {
      position.y = FLOOR_Y + height;
      velocity.current.y = -velocity.current.y * BOUNCE;
      // Add some random horizontal movement on bounce
      velocity.current.x += (Math.random() - 0.5) * 0.05;
    }

    // Handle wall collisions
    if (position.x - width < WALL_LEFT) {
      position.x = WALL_LEFT + width;
      velocity.current.x = -velocity.current.x * BOUNCE;
    } else if (position.x + width > WALL_RIGHT) {
      position.x = WALL_RIGHT - width;
      velocity.current.x = -velocity.current.x * BOUNCE;
    }

    // Apply drag
    velocity.current.x *= DRAG;
    velocity.current.y *= DRAG;

    // Add some rotation based on movement
    mesh.rotation.z += velocity.current.x * 0.1;
  });

  // Handle drag interactions
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    // Give a random velocity when released
    velocity.current = {
      x: (Math.random() - 0.5) * 0.1,
      y: (Math.random() - 0.5) * 0.1,
    };
  };

  const handlePointerMove = (e: any) => {
    if (isDragging && meshRef.current) {
      // Convert mouse position to world coordinates
      const x = e.point.x;
      const y = e.point.y;

      // Calculate velocity based on movement
      velocity.current = {
        x: (x - meshRef.current.position.x) * 0.5,
        y: (y - meshRef.current.position.y) * 0.5,
      };

      // Update position
      meshRef.current.position.x = x;
      meshRef.current.position.y = y;
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <mesh
      ref={meshRef}
      position={[initialPosition.x, initialPosition.y, 0]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp}
      onPointerMove={handlePointerMove}
      onClick={e => e.stopPropagation()}
      castShadow
    >
      <planeGeometry args={dimensions} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Floor component
function Floor() {
  return (
    <mesh position={[0, FLOOR_Y, -0.1]} receiveShadow>
      <planeGeometry args={[10, 0.2]} />
      <meshStandardMaterial color="#444" />
    </mesh>
  );
}

// Walls
function Walls() {
  return (
    <>
      <mesh position={[WALL_LEFT, 0, -0.1]} receiveShadow>
        <planeGeometry args={[0.2, 10]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[WALL_RIGHT, 0, -0.1]} receiveShadow>
        <planeGeometry args={[0.2, 10]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </>
  );
}

// Background
function Background() {
  const texture = useTexture('/textures/noise.png');

  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(5, 5);
    }
  }, [texture]);

  return (
    <>
      <color attach="background" args={['#111']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={0.8} castShadow />
      <mesh position={[0, 0, -1]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={texture} color="#222" />
      </mesh>
    </>
  );
}

export default function IshanPage() {
  const [isClient, setIsClient] = useState(false);

  // Image paths
  const images = [
    '/FC-logo-short.png',
    '/fc-logo.png',
    '/ishan/ishan.jpg',
    '/ishan/ishan2.jpg',
    '/ishan/ishan3.jpg',
    '/ishan/ishan4.jpg',
    '/ishan/ishan5.jpg',
    '/ishan/ishan6.png',
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create random initial positions for images
  const initialPositions = images.map(() => ({
    x: Math.random() * 6 - 3, // Between -3 and 3
    y: Math.random() * 5 + 2, // Between 2 and 7
  }));

  // Create random initial velocities
  const initialVelocities = images.map(() => ({
    x: (Math.random() - 0.5) * 0.05,
    y: 0,
  }));

  return (
    <main className="w-full h-screen overflow-hidden bg-black">
      {isClient ? (
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 50 }}
          className="w-full h-full"
        >
          <Background />
          <Floor />
          <Walls />

          {images.map((url, i) => (
            <PhysicsImage
              key={i}
              url={url}
              initialPosition={initialPositions[i]}
              initialVelocity={initialVelocities[i]}
              scale={0.8}
            />
          ))}
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
          <p className="text-xl">Loading physics playground...</p>
        </div>
      )}
    </main>
  );
}
