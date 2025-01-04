'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import QRCode from 'react-qr-code';
import { Card } from '@/components/ui/card';
import type { typeformInsertType } from '../../../../../../../schema.zod';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
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

    // Clear canvas and draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    // Draw border
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Draw title
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
  ]);

  const downloadTicket = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const downloadLink = document.createElement('a');
    downloadLink.download = `custom-ticket-${registration?.ticket_id}.png`;
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.click();
  };

  if (loading) return <div>Loading...</div>;
  if (!registration) return <div>Registration not found</div>;

  return (
    <div className="container max-w-4xl mx-auto py-8">
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

            <Button onClick={downloadTicket} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Custom Ticket
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-auto border rounded-lg"
            />
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
