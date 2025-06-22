"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function Post() {
  const [posts, setPosts] = useState<{ id: string; title: string; content: string }[]>([]);
  const [confirmingDeletePost, setConfirmingDeletePost] = useState<{ id: string; title: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as { title: string; content: string }),
      }));
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setPosts(prev => prev.filter(post => post.id !== id));
      toast.success("Post deleted");
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  const handleAddPost = async () => {
    try {
      const docRef = await addDoc(collection(db, "posts"), newPost);
      setPosts(prev => [...prev, { id: docRef.id, ...newPost }]);
      toast.success("Post added");
      setShowAddModal(false);
      setNewPost({ title: "", content: "" });
    } catch (error) {
      toast.error("Failed to add post");
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <Button asChild>
          <Link href="/dashboard/posts/new">Add New Post</Link>
        </Button>
        {/* <Button onClick={() => setShowAddModal(true)}>Add New Post</Button> */}
      </div>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full table-auto text-sm">
          <thead className="border-b">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Title</th>
              <th className="px-4 py-2 text-left font-medium">Category</th>
              <th className="px-4 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b ">
                <td className="px-4 py-2 font-medium">{post.title}</td>
                <td className="px-4 py-2">
                  {Array.isArray(post.categories) ? post.categories.join(", ") : post.categories || "-"}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/posts/${post.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmingDeletePost({ id: post.id, title: post.title })}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              placeholder="Content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAddPost}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!confirmingDeletePost} onOpenChange={() => setConfirmingDeletePost(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete post "{confirmingDeletePost?.title}"?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setConfirmingDeletePost(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmingDeletePost) {
                  handleDelete(confirmingDeletePost.id);
                  setConfirmingDeletePost(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
