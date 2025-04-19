
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationPreference {
  email_announcements: boolean;
  email_messages: boolean;
  email_forum: boolean;
  in_app_announcements: boolean;
  in_app_messages: boolean;
  in_app_forum: boolean;
}

const NotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreference>({
    email_announcements: true,
    email_messages: true,
    email_forum: true,
    in_app_announcements: true,
    in_app_messages: true,
    in_app_forum: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Failed to load notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = async (key: keyof NotificationPreference, value: boolean) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update({ [key]: value })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setPreferences(prev => ({ ...prev, [key]: value }));
      toast.success('Preferences updated');
    } catch (error) {
      console.error('Error updating preference:', error);
      toast.error('Failed to update preference');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-announcements">Announcements</Label>
              <Switch
                id="email-announcements"
                checked={preferences.email_announcements}
                onCheckedChange={(checked) => updatePreference('email_announcements', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-messages">Messages</Label>
              <Switch
                id="email-messages"
                checked={preferences.email_messages}
                onCheckedChange={(checked) => updatePreference('email_messages', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-forum">Forum Activity</Label>
              <Switch
                id="email-forum"
                checked={preferences.email_forum}
                onCheckedChange={(checked) => updatePreference('email_forum', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Bell className="h-5 w-5" />
            In-App Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="app-announcements">Announcements</Label>
              <Switch
                id="app-announcements"
                checked={preferences.in_app_announcements}
                onCheckedChange={(checked) => updatePreference('in_app_announcements', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-messages">Messages</Label>
              <Switch
                id="app-messages"
                checked={preferences.in_app_messages}
                onCheckedChange={(checked) => updatePreference('in_app_messages', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-forum">Forum Activity</Label>
              <Switch
                id="app-forum"
                checked={preferences.in_app_forum}
                onCheckedChange={(checked) => updatePreference('in_app_forum', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
