'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Engine,
  Render,
  Bodies,
  World,
  Mouse,
  MouseConstraint,
  Runner,
  Body,
  Vector,
} from 'matter-js';

export default function IshanPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fix image paths to ensure they're properly loaded
  const images = [
    '/FC-logo-short.png',
    '/FC-logo.png',
    '/ishan/ishan.jpg',
    '/ishan/ishan2.jpg',
    '/ishan/ishan3.jpg',
    '/ishan/ishan4.jpg',
    '/ishan/ishan5.jpg',
    '/ishan/ishan6.png',
  ];

  // Preload images with better error handling
  useEffect(() => {
    if (!isClient) {
      setIsClient(true);
      return;
    }

    const imageElements: HTMLImageElement[] = [];
    let loadedCount = 0;
    let errorCount = 0;

    const checkAllImagesProcessed = () => {
      if (loadedCount + errorCount === images.length) {
        if (imageElements.length > 0) {
          setImagesLoaded(true);
        } else {
          setLoadError('Failed to load any images');
        }
      }
    };

    for (const src of images) {
      // Add base URL for production if needed
      const fullSrc = process.env.NODE_ENV === 'production' 
        ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${src}`
        : src;
      
      const img = new Image();
      
      // Set crossOrigin if needed for CORS issues
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        console.log(`Image loaded successfully: ${fullSrc}`);
        loadedCount++;
        imageElements.push(img);
        checkAllImagesProcessed();
      };
      
      img.onerror = (e) => {
        console.error(`Failed to load image: ${fullSrc}`, e);
        errorCount++;
        checkAllImagesProcessed();
      };
      
      // Set src last to start loading
      img.src = fullSrc;
    }

    loadedImagesRef.current = imageElements;
    
    // Safety timeout in case images take too long
    const timeoutId = setTimeout(() => {
      if (!imagesLoaded && imageElements.length > 0) {
        console.warn('Image loading timed out, proceeding with loaded images');
        setImagesLoaded(true);
      } else if (!imagesLoaded && imageElements.length === 0) {
        setLoadError('Image loading timed out');
      }
    }, 10000); // 10 second timeout
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isClient, imagesLoaded]);

  // Create physics simulation with images
  useEffect(() => {
    if (
      !isClient ||
      !imagesLoaded ||
      !canvasRef.current ||
      loadedImagesRef.current.length === 0
    )
      return;

    // Setup Matter.js
    const engine = Engine.create({
      gravity: { x: 0, y: 1 }, // Enable gravity right away
    });
    engineRef.current = engine;

    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
      },
    });
    renderRef.current = render;

    // Add walls to contain the elements within viewport
    const wallOptions = { isStatic: true, render: { visible: false } };
    const walls = [
      // Bottom wall
      Bodies.rectangle(
        window.innerWidth / 2,
        window.innerHeight + 25,
        window.innerWidth,
        50,
        wallOptions
      ),
      // Left wall
      Bodies.rectangle(
        -25,
        window.innerHeight / 2,
        50,
        window.innerHeight * 2,
        wallOptions
      ),
      // Right wall
      Bodies.rectangle(
        window.innerWidth + 25,
        window.innerHeight / 2,
        50,
        window.innerHeight * 2,
        wallOptions
      ),
    ];

    World.add(engine.world, walls);

    // Add mouse control for dragging
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(engine.world, mouseConstraint);

    // Create image bodies that will fall with physics
    const MAX_HEIGHT = 200;
    const imageBodies: Matter.Body[] = [];

    loadedImagesRef.current.forEach((img, index) => {
      // Calculate aspect ratio to maintain proportions
      const aspectRatio = img.naturalWidth / img.naturalHeight;

      // Set height to max height and calculate width based on aspect ratio
      const height = Math.min(MAX_HEIGHT, img.naturalHeight);
      const width = height * aspectRatio;

      // Distribute images across the top of the screen
      const totalWidth = window.innerWidth * 0.8;
      const spacing = totalWidth / images.length;
      const xPosition = window.innerWidth * 0.1 + index * spacing + spacing / 2;

      // Start above viewport
      const yPosition = -height * (Math.random() + 0.5);

      const body = Bodies.rectangle(xPosition, yPosition, width, height, {
        chamfer: { radius: 5 },
        render: {
          sprite: {
            texture: img.src,
            xScale: width / img.naturalWidth,
            yScale: height / img.naturalHeight,
          },
        },
        restitution: 0.7, // Bounciness
        friction: 0.01, // Low friction to make it more playful
      });

      imageBodies.push(body);
    });

    World.add(engine.world, imageBodies);

    // Create a runner
    const runner = Runner.create();

    // Start the engine using Runner
    Runner.run(runner, engine);
    Render.run(render);

    // Handle window resize
    const handleResize = () => {
      render.options.width = window.innerWidth;
      render.options.height = window.innerHeight;
      Render.setPixelRatio(render, window.devicePixelRatio);
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;

      // Update walls
      Body.setPosition(
        walls[0],
        Vector.create(window.innerWidth / 2, window.innerHeight + 25)
      );
      Body.setPosition(
        walls[2],
        Vector.create(window.innerWidth + 25, window.innerHeight / 2)
      );
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);

      // Stop the runner
      Runner.stop(runner);
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [isClient, imagesLoaded]);

  return (
    <main className="w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Physics canvas container that's always visible */}
      <div ref={canvasRef} className="w-full h-full" />

      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
          {loadError ? (
            <p className="text-xl text-red-500">{loadError}</p>
          ) : (
            <p className="text-xl">Loading physics playground...</p>
          )}
        </div>
      )}
    </main>
  );
}
