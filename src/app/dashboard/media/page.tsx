// app/dashboard/media/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function MediaPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Image
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="h-40 w-full bg-gray-200" /> {/* Placeholder image */}
            <p className="mt-2 truncate">image1.jpg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="h-40 w-full bg-gray-200" /> {/* Placeholder image */}
            <p className="mt-2 truncate">image2.jpg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="h-40 w-full bg-gray-200" /> {/* Placeholder image */}
            <p className="mt-2 truncate">image3.jpg</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}