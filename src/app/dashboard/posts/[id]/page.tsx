"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, getDocs, collection, addDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Editor } from "@tinymce/tinymce-react";

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setContent(data.content);
          setCategories(data.categories || []);
        } else {
          toast.error("Post not found");
          router.push("/dashboard/posts");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const loaded = snapshot.docs.map(doc => doc.data().name as string);
      setAllCategories(loaded);
    };

    fetchPost();
    fetchCategories();
  }, [id, router]);

  const handleSave = async () => {
    try {
      const editorContent = editorRef.current?.getContent();
      await updateDoc(doc(db, "posts", id as string), {
        title,
        content: editorContent,
        categories,
      });
      toast.success("Post updated");
      router.push("/dashboard/posts");
    } catch (error) {
      toast.error("Failed to update post");
      console.error(error);
    }
  };

  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleAddCategory = async () => {
    if (!newCategory || allCategories.includes(newCategory)) return;
    try {
      await addDoc(collection(db, "categories"), { name: newCategory });
      setAllCategories(prev => [...prev, newCategory]);
      setCategories(prev => [...prev, newCategory]);
      setNewCategory("");
      setShowNewCategoryInput(false);
    } catch (error) {
      toast.error("Failed to add category");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <div className="space-y-4 ">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <Editor
          apiKey="pyo0kerowoz1hr7b0ubn790rm2w6chdnylo1q88t200lssw2"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={content}
          init={{
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | removeformat | help",
          }}
        />
        <div className="space-y-2">
          <label className="block font-medium">Categories</label>
          {allCategories.map((cat) => (
            <label key={cat} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
          {showNewCategoryInput ? (
            <div className="flex space-x-2">
              <Input
                placeholder="Add new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="button" onClick={handleAddCategory}>Add</Button>
            </div>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            className="text-sm px-0"
            onClick={() => setShowNewCategoryInput(prev => !prev)}
          >
            {showNewCategoryInput ? "× Cancel" : "+ Add Category"}
          </Button>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}
