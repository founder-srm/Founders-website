'use client';

import { Download, Share2, Mail, TriangleAlert, X } from 'lucide-react';
// Remove useToast import

import { useRouter, useSearchParams } from 'next/navigation';
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
  const Router = useRouter();
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
  const [patternContent, setPatternContent] = useState('🔥');
  const [patternSize, setPatternSize] = useState(30);
  const [patternRotation, setPatternRotation] = useState(0);
  const [emailLoading, setEmailLoading] = useState(false);
  // Remove toast related code

  useEffect(() => {
    async function fetchRegistration() {
      if (!ticketId) return;

      const supabase = createClient();
      
      // Get current user's session
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('eventsregistrations')
        .select('*')
        .eq('ticket_id', ticketId)
        .single();

      if (!error && data) {
        // Type-safe way to merge details
        const updatedDetails = {
          ...(typeof data.details === 'object' ? data.details : {}),
          email: user?.email,
        };

        setRegistration({
          ...data,
          details: updatedDetails
        });

        console.log('Registration data with email:', {
          ...data,
          details: updatedDetails
        });
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

  const emailTicket = async () => {
    if (!canvasRef.current || !registration) return;

    try {
      setEmailLoading(true);
      const ticketImageUrl = canvasRef.current.toDataURL('image/png');

      // Debug log
      console.log('Sending data:', {
        registration: {
          details: registration.details,
          event_title: registration.event_title,
          ticket_id: registration.ticket_id
        }
      });

      const response = await fetch('/api/send-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration,
          ticketImageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      alert('Ticket has been sent to your email!');

    } catch (error: unknown) {
      console.error('Error sending email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
      alert(`Failed to send email: ${errorMessage}`);
    } finally {
      setEmailLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!registration) return <div>Registration not found</div>;

  if (!registration.is_approved) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-accent">
        <div className="z-[100] max-w-[400px] rounded-lg border border-border bg-background p-4 shadow-lg shadow-black/5">
          <div className="flex gap-2">
            <div className="flex grow gap-3">
              <TriangleAlert
                className="mt-0.5 shrink-0 text-amber-500"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              <div className="flex grow flex-col gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Registration Pending Approval
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your registration is currently being reviewed by the event
                    organizers. You&apos;ll be able to access and customize your
                    ticket once approved.
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Ticket ID: {registration.ticket_id}
                  </p>
                </div>
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => Router.back()}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              aria-label="Close notification"
              // onClick={() => window.location.href = '/dashboard'}
            >
              <X
                size={16}
                strokeWidth={2}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                disabled={emailLoading}
              >
                <Mail className="mr-2 h-4 w-4" />
                {emailLoading ? "Sending..." : "Email"}
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
