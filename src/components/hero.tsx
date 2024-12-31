import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Particles from './ui/particles';

export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-24 relative">
      <Particles className="absolute inset-0 -z-10" />
      <div className="relative grid gap-8 lg:grid-cols-2">
        {/* Text Content */}
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl">
            Welcome to Our Website
          </h1>
          <p className="max-w-[600px] text-lg text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
            doloremque mollitia fugiat omnis! Porro facilis quo animi
            consequatur. Explicabo.
          </p>
          <div className="pt-4">
            <Button className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="relative h-[400px] md:h-[600px]">
          {/* Large hexagon */}
          <div className="absolute right-4 top-1/4 w-48 md:w-64">
            <div className="aspect-square rounded-xl bg-gray-100 p-8 shadow-sm">
              <Image
                src="/placeholder.svg"
                alt="Hexagon Logo"
                width={200}
                height={200}
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Small cube 1 */}
          <div className="absolute left-1/4 top-1/3 w-32 md:w-40">
            <div className="aspect-square rounded-xl bg-gray-100 p-6 shadow-sm">
              <Image
                src="/placeholder.svg"
                alt="Cube Logo"
                width={100}
                height={100}
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Small cube 2 */}
          <div className="absolute bottom-1/4 right-1/3 w-32 md:w-40">
            <div className="aspect-square rounded-xl bg-gray-100 p-6 shadow-sm">
              <Image
                src="/placeholder.svg"
                alt="Cube Logo"
                width={100}
                height={100}
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Small cube 3 */}
          <div className="absolute bottom-8 right-8 w-32 md:w-40">
            <div className="aspect-square rounded-xl bg-gray-100 p-6 shadow-sm">
              <Image
                src="/placeholder.svg"
                alt="Cube Logo"
                width={100}
                height={100}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
