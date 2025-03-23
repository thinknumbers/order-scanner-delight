
import { useState } from 'react';
import { Customization, CustomizationOption } from '@/lib/mockData';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CustomizationOptionsProps {
  customizations: Customization[];
  selectedOptions: Record<string, CustomizationOption[]>;
  onChange: (customizationName: string, options: CustomizationOption[]) => void;
}

const CustomizationOptions = ({
  customizations,
  selectedOptions,
  onChange,
}: CustomizationOptionsProps) => {
  const formatPrice = (price: number) => {
    if (price === 0) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const handleSingleOptionChange = (
    customizationName: string,
    option: CustomizationOption
  ) => {
    onChange(customizationName, [option]);
  };

  const handleMultipleOptionChange = (
    customizationName: string,
    option: CustomizationOption,
    isChecked: boolean
  ) => {
    const currentOptions = selectedOptions[customizationName] || [];
    
    if (isChecked) {
      // Add option if not already selected
      if (!currentOptions.some(opt => opt.name === option.name)) {
        onChange(customizationName, [...currentOptions, option]);
      }
    } else {
      // Remove option
      onChange(
        customizationName,
        currentOptions.filter(opt => opt.name !== option.name)
      );
    }
  };
  
  const isOptionSelected = (
    customizationName: string,
    optionName: string
  ): boolean => {
    const options = selectedOptions[customizationName] || [];
    return options.some(opt => opt.name === optionName);
  };

  return (
    <div className="space-y-6">
      {customizations.map((customization) => (
        <div key={customization.name} className="border-b pb-4">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium">
              {customization.name}
              {customization.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </h3>
            {customization.multiple && (
              <span className="text-sm text-muted-foreground">
                Select multiple
              </span>
            )}
          </div>

          {customization.multiple ? (
            <div className="space-y-3">
              {customization.options.map((option) => (
                <div key={option.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${customization.name}-${option.name}`}
                      checked={isOptionSelected(customization.name, option.name)}
                      onCheckedChange={(checked) =>
                        handleMultipleOptionChange(
                          customization.name,
                          option,
                          checked as boolean
                        )
                      }
                    />
                    <Label 
                      htmlFor={`${customization.name}-${option.name}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.name}
                    </Label>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice(option.price)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup
              value={
                selectedOptions[customization.name]?.[0]?.name || ""
              }
              onValueChange={(value) => {
                const option = customization.options.find(
                  (opt) => opt.name === value
                );
                if (option) {
                  handleSingleOptionChange(customization.name, option);
                }
              }}
              className="space-y-3"
            >
              {customization.options.map((option) => (
                <div key={option.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.name}
                      id={`${customization.name}-${option.name}`}
                    />
                    <Label 
                      htmlFor={`${customization.name}-${option.name}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.name}
                    </Label>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice(option.price)}
                  </span>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomizationOptions;
