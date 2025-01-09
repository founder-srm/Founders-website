'use client';

// Add these imports at the top
import { Download, Share2, Mail } from 'lucide-react';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import QRCode from 'react-qr-code';
import confetti from 'canvas-confetti';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { typeformInsertType } from '../../../../../../../schema.zod';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ScratchToReveal from '@/components/ui/scratch-to-reveal';

export default function CustomizeTicketPage() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticketid');
  const [registration, setRegistration] = useState<typeformInsertType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(24);
  const [selectedTheme, setSelectedTheme] = useState('classic');
  const [qrCodeImage, setQrCodeImage] = useState<HTMLImageElement | null>(null);
  const [patternType, setPatternType] = useState('none');
  const [patternContent, setPatternContent] = useState('🎫');
  const [patternSize, setPatternSize] = useState(30);
  const [patternRotation, setPatternRotation] = useState(0);

  useEffect(() => {
    async function fetchRegistration() {
      if (!ticketId) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from('eventsregistrations')
        .select('*')
        .eq('ticket_id', ticketId)
        .single();

      if (!error && data) {
        setRegistration(data);
      }
      setLoading(false);
    }

    fetchRegistration();
  }, [ticketId]);

  useEffect(() => {
    if (!registration) return;

    // Convert SVG to Image
    const svg = document.getElementById('QRCode');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
      img.onload = () => {
        setQrCodeImage(img);
      };
    }
  }, [registration]);

  useEffect(() => {
    if (!registration || !canvasRef.current || !qrCodeImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw custom pattern background if selected
    if (patternType === 'emoji' || patternType === 'text') {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((patternRotation * Math.PI) / 180);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${patternSize}px Arial`;

      for (let x = -canvas.width; x < canvas.width; x += patternSize * 2) {
        for (let y = -canvas.height; y < canvas.height; y += patternSize * 2) {
          ctx.fillStyle = `${textColor}20`; // 20% opacity
          ctx.fillText(patternContent, x, y);
        }
      }
      ctx.restore();
    }

    // Draw jagged edges
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Left edge zigzag
    for (let y = 20; y < canvas.height - 20; y += 20) {
      if (y === 20) ctx.moveTo(10, y);
      ctx.lineTo(y % 40 === 0 ? 20 : 10, y + 20);
    }

    // Bottom edge
    for (let x = 10; x < canvas.width - 10; x += 20) {
      ctx.lineTo(x + 20, canvas.height - (x % 40 === 0 ? 20 : 10));
    }

    // Right edge zigzag
    for (let y = canvas.height - 20; y > 20; y -= 20) {
      ctx.lineTo(y % 40 === 0 ? canvas.width - 20 : canvas.width - 10, y);
    }

    // Top edge
    for (let x = canvas.width - 10; x > 10; x -= 20) {
      ctx.lineTo(x - 20, x % 40 === 0 ? 20 : 10);
    }

    ctx.closePath();
    ctx.stroke();
    ctx.clip();

    // Theme-specific background
    if (selectedTheme === 'gradient') {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, backgroundColor);
      gradient.addColorStop(1, '#f0f0f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (selectedTheme === 'pattern') {
      // Create diagonal stripes pattern
      const patternCanvas = document.createElement('canvas');
      const patternCtx = patternCanvas.getContext('2d');
      if (!patternCtx) return;
      patternCanvas.width = 20;
      patternCanvas.height = 20;
      patternCtx.strokeStyle = '#f0f0f0';
      patternCtx.lineWidth = 2;
      patternCtx.beginPath();
      patternCtx.moveTo(0, 20);
      patternCtx.lineTo(20, 0);
      patternCtx.stroke();

      const pattern = ctx.createPattern(patternCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw content
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText(registration.event_title, canvas.width / 2, 80);

    // Draw QR Code
    ctx.drawImage(qrCodeImage, (canvas.width - 200) / 2, 120, 200, 200);

    // Draw additional info
    ctx.font = '16px Inter';
    ctx.fillText(
      `Ticket ID: ${registration.ticket_id}`,
      canvas.width / 2,
      canvas.height - 60
    );
    ctx.fillText(
      `Registration Date: ${registration.created_at ? new Date(registration.created_at).toLocaleDateString() : 'Not available'}`,
      canvas.width / 2,
      canvas.height - 30
    );
  }, [
    registration,
    backgroundColor,
    textColor,
    fontSize,
    selectedTheme,
    qrCodeImage,
    patternType,
    patternContent,
    patternSize,
    patternRotation,
  ]);

  const downloadTicket = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const downloadLink = document.createElement('a');
    downloadLink.download = `${registration?.event_title}-${registration?.ticket_id}.png`;
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.click();

    confetti({
      spread: 180,
    });
  };

  // Add new functions for share and email (to be implemented)
  const shareTicket = () => {
    // TODO: Implement sharing functionality
    console.log('Share functionality to be implemented');
  };

  const emailTicket = () => {
    // TODO: Implement email functionality
    console.log('Email functionality to be implemented');
  };

  if (loading) return <div>Loading...</div>;
  if (!registration) return <div>Registration not found</div>;

  return (
    <div className=" max-w-6xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Customize Your Ticket</h1>
            <p className="text-gray-500">Personalize your event ticket</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Theme</Label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="pattern">Pattern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={e => setBackgroundColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={e => setBackgroundColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={textColor}
                  onChange={e => setTextColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={textColor}
                  onChange={e => setTextColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Font Size</Label>
              <Slider
                value={[fontSize]}
                onValueChange={value => setFontSize(value[0])}
                min={16}
                max={48}
                step={1}
                className="my-2"
              />
              <div className="text-sm text-gray-500 text-right">
                {fontSize}px
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Background Pattern</Label>
              <Select value={patternType} onValueChange={setPatternType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="emoji">Emoji Pattern</SelectItem>
                  <SelectItem value="text">Text Pattern</SelectItem>
                </SelectContent>
              </Select>

              {(patternType === 'emoji' || patternType === 'text') && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Pattern Content</Label>
                    <Input
                      value={patternContent}
                      onChange={e => setPatternContent(e.target.value)}
                      placeholder="Enter emoji or text"
                    />
                  </div>

                  <div>
                    <Label>Pattern Size</Label>
                    <Slider
                      value={[patternSize]}
                      onValueChange={value => setPatternSize(value[0])}
                      min={10}
                      max={50}
                      step={1}
                    />
                  </div>

                  <div>
                    <Label>Pattern Rotation</Label>
                    <Slider
                      value={[patternRotation]}
                      onValueChange={value => setPatternRotation(value[0])}
                      min={0}
                      max={360}
                      step={15}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadTicket} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                onClick={shareTicket}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                onClick={emailTicket}
                variant="outline"
                className="flex-1"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6 w-full max-w-xl h-auto">
          <Card className="p-6 w-full min-w-[560px]">
            <CardContent>
              <ScratchToReveal
                width={462}
                height={308}
                minScratchPercentage={70}
                className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
                // onComplete={handleComplete}
                gradientColors={[
                  '#838487',
                  '#8A8B8F',
                  '#AFB0B3',
                  '#A8A9AD',
                  '#A1A2A5',
                  '#929396',
                ]}
              >
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full h-auto border rounded-lg"
                />
              </ScratchToReveal>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500 text-center">
                Scratch the ticket to reveal the QR code
              </p>
            </CardFooter>
          </Card>

          <div className="hidden">
            <QRCode
              id="QRCode"
              value={registration.id || ''}
              size={200}
              level="H"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
