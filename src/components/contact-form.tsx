'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const supabase = createClient('https://eedplvopkhwuhhquagfw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZHBsdm9wa2h3dWhocXVhZ2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNDM1ODUsImV4cCI6MjAyMjgxOTU4NX0.uXlL7xAorEiCd_kmbZ0v3hgB0FR5vskjCHLveoATQ6g');
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage } from './ui/avatar';
import Link from 'next/link';

interface Country {
  name: {
    common: string;
  };
}

export function BookDemoForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    phone: '',
    email: '',
    country: '',
    companySize: '',
    referral: '',
  });

  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = (await response.json()) as Country[];
        const countryNames = data.map(country => country.name.common).sort();
        setCountries(countryNames);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {data, error} = await supabase.from('contactentries')
    .insert([
      {
        name: formData.fullName,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        country: formData.country,
        company_size: formData.companySize,
        referral: formData.referral,

      },
    ]);
    if (error) {
      console.error('Error inserting data:', error);
      alert(`There was an error! Details: "${error.message || error} That's all we know!`)
    } else {
      console.log('Data inserted successfully:', data);
      alert("We got your data !👍😊")
    }

    // After submition the data fields should be empty again :)
    setFormData({
      fullName: '',
      company: '',
      phone: '',
      email: '',
      country: '',
      companySize: '',
      referral: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="z-10 space-y-6 w-full">
      <div className="w-full space-y-6 rounded-xl border border-border bg-background px-6 py-10 shadow-sm">
        <FormField
          label="Full name"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Joe Average"
        />
        <FormField
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          placeholder="Acme Corp"
        />
        <FormField
          label="Phone number"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="12 3456 7890"
        />
        <FormField
          label="Email (business)"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="name@company.com"
        />

        <FormSelect
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleSelectChange('country')}
          placeholder="Select country"
        >
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {countries.map(country => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </div>
        </FormSelect>

        <FormSelect
          label="Company size"
          name="companySize"
          value={formData.companySize}
          onChange={handleSelectChange('companySize')}
          placeholder="Select"
        >
          <SelectItem value="1-10">1-10</SelectItem>
          <SelectItem value="11-50">11-50</SelectItem>
          <SelectItem value="51-200">51-200</SelectItem>
          <SelectItem value="200+">200+</SelectItem>
        </FormSelect>

        <FormSelect
          label="How did you hear about us?"
          name="referral"
          value={formData.referral}
          onChange={handleSelectChange('referral')}
          placeholder="Select"
          optional
        >
          <SelectItem value="search">Web Search</SelectItem>
          <SelectItem value="team">Founders Club Team</SelectItem>
          <SelectItem value="socialmedia">Social Media</SelectItem>
          <SelectItem value="we cool">Someone told you we are cool!</SelectItem>
          {/* Add more options as needed */}
        </FormSelect>

        <div className="flex w-full flex-col justify-end space-y-3 pt-2">
          <Button type="submit">Submit</Button>
          <div className="text-xs text-muted-foreground">
            For more information about how we handle your personal information,
            please visit our{''}
            <Link href="./components/PrivacyPolicy/page.tsx" className="underline">
              privacy policy
            </Link>
            .
          </div>
        </div>
      </div>
    </form>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div>
      <Label htmlFor={name} className="mb-2.5 text-sm font-medium">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function FormSelect({
  label,
  name,
  value,
  onChange,
  placeholder,
  children,
  optional = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={name} className="mb-2.5 text-sm font-medium">
        {label}
        {optional && <span className="text-muted-foreground"> (Optional)</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={name}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}

export function AvatarGroup() {
  return (
    <div className="mt-16 flex overflow-hidden">
      <Avatar className="size-11 -ml-0">
        <AvatarImage
          src="https://shadcnblocks.com/images/block/avatar-1.webp"
          alt="Avatar 1"
        />
      </Avatar>
      <Avatar className="size-11 -ml-4">
        <AvatarImage
          src="https://shadcnblocks.com/images/block/avatar-3.webp"
          alt="Avatar 2"
        />
      </Avatar>
      <Avatar className="size-11 -ml-4">
        <AvatarImage
          src="https://shadcnblocks.com/images/block/avatar-2.webp"
          alt="Avatar 3"
        />
      </Avatar>
    </div>
  );
}
