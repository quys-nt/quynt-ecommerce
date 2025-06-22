"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Editor } from "@tinymce/tinymce-react";

export default function NewPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const editorRef = useRef(null);
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const snapshot = await getDocs(collection(db, "categories"));
          const loaded = snapshot.docs.map(doc => doc.data().name as string);
          setAllCategories(loaded);
        } catch (error) {
          console.error("Failed to load categories", error);
        }
      };
      fetchCategories();
    }, []);

    const handleAddCategory = async () => {
      if (newCategory && !categories.includes(newCategory)) {
        try {
          await addDoc(collection(db, "categories"), { name: newCategory });
          setCategories([...categories, newCategory]);
          setAllCategories(prev => [...new Set([...prev, newCategory])]);
        } catch (error) {
          toast.error("Failed to save category");
          console.error(error);
        }
      }
      setNewCategory("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const editorContent = editorRef.current?.getContent();
        if (!title || !editorContent) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "posts"), { title, content: editorContent, categories });
            toast.success("Post created successfully");
            router.push("/dashboard/posts");
        } catch (error) {
            toast.error("Failed to create post");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen p-10">
            <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    placeholder="Post Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <div className="space-y-2">
                    <label className="block font-medium">Select categories:</label>
                    {allCategories.map((cat) => (
                        <label key={cat} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={cat}
                                checked={categories.includes(cat)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setCategories([...categories, cat]);
                                    } else {
                                        setCategories(categories.filter((c) => c !== cat));
                                    }
                                }}
                                className="h-4 w-4"
                            />
                            <span className="text-sm capitalize">{cat}</span>
                        </label>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-sm px-0"
                      onClick={() => setShowNewCategoryInput(prev => !prev)}
                    >
                      {showNewCategoryInput ? "× Cancel" : "+ Add Category"}
                    </Button>
                    {showNewCategoryInput ? (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add new category"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <Button type="button" onClick={handleAddCategory}>
                          Add
                        </Button>
                      </div>
                    ) : null}
                    
                </div>
                <Editor
                    apiKey="pyo0kerowoz1hr7b0ubn790rm2w6chdnylo1q88t200lssw2"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    init={{
                        // height: 300,
                        menubar: false,
                        plugins: [
                            "advlist autolink lists link image charmap preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste help wordcount",
                        ],
                        toolbar:
                            "undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help",
                    }}
                />
                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
