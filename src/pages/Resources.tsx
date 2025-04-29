import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, File, FileText, Image, User } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Resource } from '@/types';

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);

  // Mock data for demo purposes
  const sampleResources: Resource[] = [
    {
      id: '1',
      title: 'Family Tree 2023',
      description: 'Updated family tree with all recent additions',
      file_url: '#',
      category: 'documents',
      created_at: new Date().toISOString(),
      fileType: 'pdf',
      authorId: '1',
      authorName: 'Admin User',
      createdAt: new Date(),
      isPremium: false
    },
    {
      id: '2',
      title: 'Old Family Photos',
      description: 'A collection of scanned family photos from the early 20th century',
      file_url: '#',
      category: 'images',
      created_at: new Date().toISOString(),
      fileType: 'jpg',
      authorId: '2',
      authorName: 'Auntie Anne',
      createdAt: new Date(),
      isPremium: false
    },
    {
      id: '3',
      title: 'Grandpa\'s Memoirs',
      description: 'A written account of Grandpa Joe\'s life and experiences',
      file_url: '#',
      category: 'stories',
      created_at: new Date().toISOString(),
      fileType: 'txt',
      authorId: '3',
      authorName: 'Grandpa Joe',
      createdAt: new Date(),
      isPremium: true
    },
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResources(resources);
    } else {
      const query = searchQuery.toLowerCase();
      const results = resources.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.authorName?.toLowerCase().includes(query)
      );
      setFilteredResources(results);
    }
  }, [searchQuery, resources]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getResourceIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-4 w-4 mr-2 text-red-500" />;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return <Image className="h-4 w-4 mr-2 text-blue-500" />;
      default:
        return <File className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const { data: resourcesData, error } = await supabase
        .from('resources')
        .select(`
          id,
          title,
          description,
          file_url,
          file_type,
          created_at,
          author_id,
          is_premium
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const authorIds = [...new Set(resourcesData.map(resource => resource.author_id))];
      
      const { data: authorsData, error: authorsError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', authorIds);
      
      if (authorsError) throw authorsError;
      
      const authorMap = {};
      authorsData.forEach(author => {
        authorMap[author.id] = author.name;
      });
      
      const formattedResources: Resource[] = resourcesData.map(resource => ({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        file_url: resource.file_url,
        category: resource.file_type || 'Other', // Using file_type as category
        created_at: resource.created_at,
        fileType: resource.file_type,
        authorId: resource.author_id,
        authorName: authorMap[resource.author_id] || 'Unknown User',
        createdAt: new Date(resource.created_at),
        isPremium: resource.is_premium
      }));
      
      setResources(formattedResources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  const resourceCard = (resource: Resource) => {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          {getResourceIcon(resource.fileType || '')}
          <CardTitle className="text-lg truncate">{resource.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {resource.description}
          </p>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {formatDate(resource.createdAt || new Date(resource.created_at))}
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <User className="h-3.5 w-3.5 mr-1" />
            {resource.authorName}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between items-center">
          <Button variant="outline" size="sm" asChild>
            <Link to={resource.file_url} target="_blank" rel="noopener noreferrer">
              Download
            </Link>
          </Button>
          {resource.isPremium && (
            <Badge variant="secondary">Premium</Badge>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Family Resources</h1>
        <Input
          type="search"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle><Skeleton className="h-6 w-full" /></CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resourceCard)}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No resources found.</p>
        </div>
      )}
    </div>
  );
};

export default Resources;
