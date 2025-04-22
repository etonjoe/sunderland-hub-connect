
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useForumLike = (postId: string) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!postId) return;
    let ignore = false;
    const fetchLikes = async () => {
      // Count likes
      const { count } = await supabase
        .from('forum_post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);
      
      if (!ignore) {
        setLikesCount(count || 0);
      }

      // Check if user liked this post
      if (user) {
        const { data: likeData } = await supabase
          .from('forum_post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (!ignore) {
          setIsLiked(!!likeData);
          setLikeId(likeData?.id ?? null);
        }
      } else {
        if (!ignore) {
          setIsLiked(false);
          setLikeId(null);
        }
      }
    };
    
    fetchLikes();
    return () => { ignore = true; }
    // eslint-disable-next-line
  }, [postId, user]);

  const toggleLike = async () => {
    if (!user) return;
    
    if (isLiked && likeId) {
      await supabase.from('forum_post_likes').delete().eq('id', likeId);
      setIsLiked(false);
      setLikeId(null);
      setLikesCount((c) => c - 1);
    } else {
      const { data } = await supabase.from('forum_post_likes').insert({
        post_id: postId,
        user_id: user.id,
      }).select('id').single();
      
      setIsLiked(true);
      setLikeId(data?.id);
      setLikesCount((c) => c + 1);
    }
  };

  return { isLiked, likesCount, toggleLike, canLike: !!user };
};
