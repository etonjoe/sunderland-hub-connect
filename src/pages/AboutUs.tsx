
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AboutRow {
  id: string;
  image: string;
  text: string;
}

const AboutUs = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: rows = [], refetch } = useQuery({
    queryKey: ['about-rows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_rows')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching about rows:', error);
        return [];
      }
      
      return data as AboutRow[];
    }
  });

  const addNewRow = async () => {
    if (!isAdmin) return;

    const { error } = await supabase
      .from('about_rows')
      .insert({
        image: '/placeholder.svg',
        text: 'Add your content here...',
        created_by: user?.id
      });

    if (error) {
      console.error('Error adding new row:', error);
      return;
    }

    refetch();
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
      
      {isAuthenticated && isAdmin && (
        <div className="mt-8 text-center">
          <Button onClick={addNewRow} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Row
          </Button>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
