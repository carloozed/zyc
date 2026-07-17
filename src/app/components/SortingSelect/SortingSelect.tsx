import React from 'react';
import { KeyTextField } from '@prismicio/client';

type SortingOption = {
  item: KeyTextField;
  selectkey: KeyTextField;
};

type SortingSelectProps = {
  className?: string;
  label: string;
  items: SortingOption[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SortingSelect({
  className,
  label,
  items,
  onChange,
}: SortingSelectProps) {
  return (
    <div className={className}>
      <h4>{label}</h4>
      <select onChange={onChange}>
        {items.map((item, index) => (
          <option
            key={`${index}-${item.item}`}
            value={item.selectkey as string}
          >
            {item.item}
          </option>
        ))}
      </select>
    </div>
  );
}
