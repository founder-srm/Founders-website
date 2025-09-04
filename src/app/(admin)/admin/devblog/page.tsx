'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getBlogPosts, deleteBlogPost } from '@/actions/blog-posts';
import { useToast } from '@/hooks/use-toast';
import { Database } from '../../../../../database.types';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Tag
} from 'lucide-react';

type BlogPost = Database['public']['Tables']['posts']['Row'];

export default function DevBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getBlogPosts();
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        setPosts(result.data || []);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load blog posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh posts when returning to this page
  useEffect(() => {
    const handleFocus = () => {
      loadPosts();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadPosts]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.tag && post.tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPosts(filtered);
    }
  }, [posts, searchTerm]);

  const handleEdit = (post: BlogPost) => {
    router.push(`/admin/devblog/${post.id}/edit`);
  };

  const handleCreate = () => {
    router.push('/admin/devblog/new');
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }

    try {
      const result = await deleteBlogPost(post.id);
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Blog post deleted successfully',
        });
        loadPosts();
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <main className="space-y-6 mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dev Blog</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading posts...
                </TableCell>
              </TableRow>
            ) : filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {searchTerm ? 'No posts found matching your search.' : 'No blog posts yet.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{post.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {post.summary}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{post.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.tag && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{post.tag}</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.published_at ? 'default' : 'secondary'}>
                      {post.published_at ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.published_at ? (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {post.published_at && (
                          <DropdownMenuItem 
                            onClick={() => window.open(`/blog/posts/${post.slug}`, '_blank')}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(post)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}