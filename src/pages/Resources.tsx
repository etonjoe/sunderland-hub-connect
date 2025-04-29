import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { Resource } from '@/types';
import { File, FileText, FileImage, FileAudio, Search, Download, Lock } from 'lucide-react';
import CreateResource from '@/components/resources/CreateResource';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const SAMPLE_RESOURCES: Resource[] = [
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
    createdAt: new Date('2023-01-10'),
    isPremium: true
  },
  {
    id: '2',
    title: 'Summer Reunion Photos',
    description: 'All photos from our last summer reunion',
    file_url: '#',
    category: 'photos',
    created_at: new Date().toISOString(),
    fileType: 'zip',
    authorId: '3',
    authorName: 'Premium User',
    createdAt: new Date('2023-03-15'),
    isPremium: true
  },
  {
    id: '3',
    title: 'Family Newsletter - January',
    description: 'Monthly newsletter with family updates',
    file_url: '#',
    category: 'documents',
    created_at: new Date().toISOString(),
    fileType: 'pdf',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: new Date('2023-01-31'),
    isPremium: true
  },
  {
    id: '4',
    title: 'Grandpa\'s Stories Audio Collection',
    description: 'Recorded audio of Grandpa\'s favorite stories',
    file_url: '#',
    category: 'audio',
    created_at: new Date().toISOString(),
    fileType: 'mp3',
    authorId: '3',
    authorName: 'Premium User',
    createdAt: new Date('2023-02-20'),
    isPremium: true
  },
  {
    id: '5',
    title: 'Family Recipes Cookbook',
    description: 'Collection of favorite family recipes',
    file_url: '#',
    category: 'documents',
    created_at: new Date().toISOString(),
    fileType: 'pdf',
    authorId: '3',
    authorName: 'Premium User',
    createdAt: new Date('2023-04-05'),
    isPremium: true
  }
];

const ResourceTypeIcon = ({ fileType }: { fileType: string }) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <FileText className="h-6 w-6 text-red-500" />;
    case 'jpg':
    case 'png':
    case 'gif':
    case 'zip':
      return <FileImage className="h-6 w-6 text-blue-500" />;
    case 'mp3':
    case 'wav':
      return <FileAudio className="h-6 w-6 text-purple-500" />;
    default:
      return <File className="h-6 w-6 text-gray-500" />;
  }
};

const Resources = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isPremium = user?.isPremium || false;
  
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('resources')
          .select(`
            id,
            title,
            description,
            file_url,
            file_type,
            author_id,
            is_premium,
            created_at
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const authorIds = [...new Set(data.map(resource => resource.author_id))];
          
          const { data: authorsData, error: authorsError } = await supabase
            .from('profiles')
            .select('id, name')
            .in('id', authorIds);
          
          if (authorsError) {
            console.error('Error fetching authors:', authorsError);
          }
          
          const authorMap = {};
          authorsData?.forEach(author => {
            authorMap[author.id] = author.name;
          });
          
          const formattedResources: Resource[] = data.map(resource => ({
            id: resource.id,
            title: resource.title,
            description: resource.description,
            file_url: resource.file_url,
            category: resource.file_type, // Using file_type as category
            created_at: resource.created_at,
            fileType: resource.file_type,
            authorId: resource.author_id,
            authorName: authorMap[resource.author_id] || 'Unknown User',
            createdAt: new Date(resource.created_at),
            isPremium: resource.is_premium
          }));
          
          setResources(formattedResources);
        } else {
          setResources(SAMPLE_RESOURCES);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        toast.error('Failed to load resources');
        setResources(SAMPLE_RESOURCES);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated && isPremium) {
      fetchResources();
    }
  }, [isAuthenticated, isPremium]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResources(resources);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredResources(resources.filter(resource => 
        resource.title.toLowerCase().includes(query) || 
        resource.description.toLowerCase().includes(query) ||
        resource.authorName.toLowerCase().includes(query) ||
        resource.fileType.toLowerCase().includes(query)
      ));
    }
  }, [searchQuery, resources]);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleResourceCreated = () => {
    toast.success('Resource created successfully!');
    if (isAuthenticated && isPremium) {
      setIsLoading(true);
      // Refetch logic here similar to fetchResources
    }
  };
  
  const handleDownload = (resource: Resource) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to download resources');
      return;
    }
    
    if (resource.isPremium && !isPremium) {
      toast.error('This resource is only available to premium members');
      return;
    }
    
    window.open(resource.fileUrl, '_blank');
    toast.success('Download started');
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isPremium) {
    return (
      <div className="container py-10 animate-fade-in">
        <div className="max-w-2xl mx-auto text-center">
          <Lock className="h-16 w-16 text-family-orange mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="text-lg text-muted-foreground mb-6">
            The resources section is available exclusively to premium members.
            Upgrade your account to get access to family documents, photos, and more.
          </p>
          <Button className="bg-family-orange hover:bg-orange-600">
            Upgrade to Premium
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Resources</h1>
        <CreateResource onResourceCreated={handleResourceCreated} />
      </div>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                      <div>
                        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No resources found matching your search.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map(resource => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <ResourceTypeIcon fileType={resource.fileType} />
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {resource.fileType.toUpperCase()} • {formatDate(resource.createdAt)}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Uploaded by {resource.authorName}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(resource)}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources
              .filter(resource => ['pdf', 'doc', 'docx', 'txt'].includes(resource.fileType.toLowerCase()))
              .map(resource => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <ResourceTypeIcon fileType={resource.fileType} />
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {resource.fileType.toUpperCase()} • {formatDate(resource.createdAt)}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Uploaded by {resource.authorName}
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="photos" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources
              .filter(resource => ['jpg', 'png', 'gif', 'zip'].includes(resource.fileType.toLowerCase()))
              .map(resource => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <ResourceTypeIcon fileType={resource.fileType} />
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {resource.fileType.toUpperCase()} • {formatDate(resource.createdAt)}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Uploaded by {resource.authorName}
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="audio" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources
              .filter(resource => ['mp3', 'wav'].includes(resource.fileType.toLowerCase()))
              .map(resource => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <ResourceTypeIcon fileType={resource.fileType} />
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {resource.fileType.toUpperCase()} • {formatDate(resource.createdAt)}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Uploaded by {resource.authorName}
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
