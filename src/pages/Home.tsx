
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { Bell, FileText, MessageSquare, Users, CreditCard, ChevronRight } from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  
  const featuredAnnouncements = [
    {
      id: '1',
      title: 'Annual Family Reunion',
      content: 'Our annual family reunion is scheduled for July 15-17 at Sunderland Park. Save the date!',
    },
    {
      id: '2',
      title: 'New Family History Documents',
      content: 'Several new family history documents have been added to the Resources section.',
    }
  ];
  
  return (
    <div className="container py-6 animate-fade-in">
      {/* Hero section */}
      <div className="text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
          <span className="text-family-blue">Welcome to the </span>
          <span className="text-family-green">SunderlandFamily Hub</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-8">
          Connect, share, and stay in touch with family members through our dedicated online community.
        </p>
        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-family-blue hover:bg-blue-600 text-lg py-6 px-8" asChild>
              <Link to="/login">
                Sign In
              </Link>
            </Button>
            <Button variant="outline" className="text-lg py-6 px-8" asChild>
              <Link to="/register">
                Create Account
              </Link>
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-xl mb-4">
              Welcome back, <span className="font-bold">{user?.name}</span>!
            </p>
            <Button className="bg-family-green hover:bg-green-600 text-lg py-6 px-8" asChild>
              <Link to="/forum">
                Browse Community Forum
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Feature Cards */}
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Hub Features</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <Users className="h-12 w-12 text-family-blue mb-2" />
              <CardTitle>Community Forum</CardTitle>
              <CardDescription>
                Engage in family discussions, ask questions, and share updates
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/forum" className="flex justify-between items-center w-full">
                  <span>Browse Forum</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <FileText className="h-12 w-12 text-family-green mb-2" />
              <CardTitle>Resources</CardTitle>
              <CardDescription>
                Access and share important family documents and photos
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/resources" className="flex justify-between items-center w-full">
                  <span>View Resources</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <MessageSquare className="h-12 w-12 text-family-orange mb-2" />
              <CardTitle>Family Chat</CardTitle>
              <CardDescription>
                Chat with family members privately or in groups
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/chat" className="flex justify-between items-center w-full">
                  <span>Start Chatting</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <Bell className="h-12 w-12 text-family-blue mb-2" />
              <CardTitle>Announcements</CardTitle>
              <CardDescription>
                Stay updated with important family news and events
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/announcements" className="flex justify-between items-center w-full">
                  <span>View Announcements</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Featured Announcements */}
      <div className="py-12 bg-muted/40 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-6">Latest Announcements</h2>
        <div className="max-w-3xl mx-auto grid gap-6">
          {featuredAnnouncements.map(announcement => (
            <Card key={announcement.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{announcement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
          <div className="text-center mt-4">
            <Button variant="outline" asChild>
              <Link to="/announcements">
                View All Announcements
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Premium CTA */}
      {isAuthenticated && !user?.isPremium && (
        <div className="py-12 text-center">
          <Card className="max-w-3xl mx-auto bg-family-light-orange">
            <CardHeader>
              <CardTitle className="text-2xl">Upgrade to Premium</CardTitle>
              <CardDescription>
                Get access to exclusive features like resources and chat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-6 md:grid-cols-2">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Premium Benefits:</h3>
                  <ul className="list-disc pl-5 text-left space-y-1">
                    <li>Access to all community resources</li>
                    <li>Private chat with community members</li>
                    <li>Group chat capabilities</li>
                    <li>Priority support</li>
                    <li>Early access to community events</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Subscription Details:</h3>
                  <div className="text-left space-y-1">
                    <p><span className="font-medium">Price:</span> $9.99/year</p>
                    <p><span className="font-medium">Billing:</span> Annual</p>
                    <p><span className="font-medium">Features:</span> Full access to all premium features</p>
                    <p><span className="font-medium">Support:</span> Priority support</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button className="bg-family-orange hover:bg-orange-600">
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade to Premium - $9.99/year
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Home;
