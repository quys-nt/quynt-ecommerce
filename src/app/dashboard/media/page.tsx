// app/dashboard/media/page.tsx
// app/dashboard/media/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from "firebase/storage";
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

  useEffect(() => {
    const fetchImages = async () => {
      const listRef = ref(storage, "media/");
      const res = await listAll(listRef);
      const files = await Promise.all(
        res.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        })
      );
      setImages(files);
    };
    fetchImages();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileRef = ref(storage, `media/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setImages((prev) => [...prev, { name: file.name, url }]);
    toast.success("Image uploaded!");
  };

  const handleDelete = async () => {
    if (!selectedImage) return;
    await deleteObject(ref(storage, `media/${selectedImage.name}`));
    setImages((prev) => prev.filter((img) => img.name !== selectedImage.name));
    setSelectedImage(null);
    setConfirmDelete(false);
    toast.success("Image deleted!");
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