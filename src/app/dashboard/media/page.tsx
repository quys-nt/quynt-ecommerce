// app/dashboard/media/page.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { toast } from "react-hot-toast";

export default function MediaPage() {
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ name: string; url: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load images from Firestore on page load.
  useEffect(() => {
    const fetchImages = async () => {
      const snapshot = await getDocs(collection(db, "media"));
      const loadedImages = snapshot.docs.map((doc) => ({
        name: doc.data().name,
        url: doc.data().url,
        id: doc.id,
      }));
      setImages(loadedImages);
    };
    fetchImages();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "EV-ONE");

    const res = await fetch("https://api.cloudinary.com/v1_1/dldjbhini/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.secure_url && data.public_id) {
      setImages((prev) => [...prev, { name: data.public_id, url: data.secure_url }]);
      // Save image metadata to Firestore
      await addDoc(collection(db, "media"), { name: data.public_id, url: data.secure_url });
      toast.success("Image uploaded to Cloudinary!");
    } else {
      toast.error("Upload failed.");
    }
  };

  const handleDelete = async () => {
    if (!selectedImage) return;

    try {
      const res = await fetch("/api/cloudinary/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: selectedImage.name }),
      });

      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.name !== selectedImage.name));
        // Delete image document from Firestore
        const snapshot = await getDocs(collection(db, "media"));
        const docToDelete = snapshot.docs.find((doc) => doc.data().name === selectedImage?.name);
        if (docToDelete) {
          await deleteDoc(doc(db, "media", docToDelete.id));
        }
        toast.success("Image deleted from Cloudinary!");
      } else {
        toast.error("Delete failed.");
      }
    } catch (error) {
      toast.error("Error deleting image.");
    } finally {
      setSelectedImage(null);
      setConfirmDelete(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media</h1>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Upload Image
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <Card key={img.name} onClick={() => setSelectedImage(img)} className="cursor-pointer">
            <CardContent className="p-4">
              <img src={img.url} alt={img.name} className="h-40 w-full object-cover" />
              <p className="mt-2 truncate">{img.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Image viewer dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <>
              <img src={selectedImage.url} alt={selectedImage.name} className="w-full" />
              <div className="flex justify-end mt-4">
                <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                  Delete Image
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Delete confirmation dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this image?</p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}