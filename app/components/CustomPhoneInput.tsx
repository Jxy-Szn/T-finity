'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import flags from 'react-phone-number-input/flags';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import { getCountryCallingCode } from 'libphonenumber-js';

// Remove problematic import
// import type { CountryCode, E164Number } from 'react-phone-number-input/modules/types';

type CountryCode = string;
type E164Number = string;

const countries: { code: CountryCode; name: string }[] = [
  { code: 'US', name: 'United States' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  // Add more countries as needed
];

type Props = {
  value: E164Number | undefined;
  onChange: (value?: E164Number) => void;
};

export default function CustomPhoneInput({ value, onChange }: Props) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US');

  useEffect(() => {
    if (!value) return;

    // Optional enhancement: auto-select country from value
    const match = countries.find(c =>
      value.startsWith(`+${getCountryCallingCode(c.code as CountryCode)}`)
    );
    if (match) {
      setSelectedCountry(match.code);
    }
  }, [value]);

  // Use type assertion for flags indexing
  const Flag = (flags as Record<string, any>)[selectedCountry];

  return (
    <div className="space-y-4">
      {/* Country Picker */}
      <div>
        <label className="block text-sm text-white mb-1">Select Country</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between items-center bg-white/20 text-white">
              <div className="flex items-center gap-2">
                {Flag && <Flag className="w-5 h-4" />}
                <span>{countries.find(c => c.code === selectedCountry)?.name}</span>
              </div>
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <ScrollArea className="h-60">
                  {countries.map(country => {
                    const CountryFlag = (flags as Record<string, any>)[country.code];
                    return (
                      <CommandItem
                        key={country.code}
                        onSelect={() => setSelectedCountry(country.code)}
                        className="flex items-center gap-2"
                      >
                        {CountryFlag && <CountryFlag className="w-5 h-4" />}
                        <span>{country.name}</span>
                        <span className="ml-auto text-sm text-gray-500">
                          +{getCountryCallingCode(country.code as CountryCode)}
                        </span>
                        {selectedCountry === country.code && <CheckIcon className="ml-2 h-4 w-4 text-green-500" />}
                      </CommandItem>
                    );
                  })}
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Phone Number Input */}
      <div>
        <label className="block text-sm text-white mb-1">Phone Number</label>
        <PhoneInput
          country={selectedCountry}
          value={value}
          onChange={onChange}
          international
          defaultCountry={selectedCountry}
          inputComponent={Input}
          className="bg-white/20 text-white placeholder-white focus:bg-white/30 w-full"
        />
      </div>
    </div>
  );
}
