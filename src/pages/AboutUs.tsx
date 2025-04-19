
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from 'lucide-react';

interface AboutRow {
  id: number;
  image: string;
  text: string;
}

const AboutUs = () => {
  const [rows, setRows] = useState<AboutRow[]>([
    { id: 1, image: '/placeholder.svg', text: 'Our mission is to connect families and build stronger communities.' },
    { id: 2, image: '/placeholder.svg', text: 'We believe in the power of shared experiences and knowledge.' },
    { id: 3, image: '/placeholder.svg', text: 'Our platform enables seamless communication and resource sharing.' },
    { id: 4, image: '/placeholder.svg', text: 'We support families through every stage of their journey.' },
    { id: 5, image: '/placeholder.svg', text: 'Join us in creating lasting connections and memories.' },
  ]);

  const addNewRow = () => {
    const newId = Math.max(...rows.map(row => row.id)) + 1;
    setRows([...rows, {
      id: newId,
      image: '/placeholder.svg',
      text: 'Add your content here...'
    }]);
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">About Us</h1>
      
      <div className="space-y-8">
        {rows.map((row, index) => (
          <Card key={row.id} className="p-6">
            <div className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
              <div className="w-full md:w-1/2">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={row.image}
                    alt={`About section ${row.id}`}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-lg leading-relaxed">{row.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button onClick={addNewRow} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Row
        </Button>
      </div>
    </div>
  );
};

export default AboutUs;
