// app/dashboard/products/[id]/page.tsx
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}

interface Props {
    params: {
        id: string;
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const docRef = doc(db, "products", params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return notFound();
    }

    const product = {
        id: docSnap.id,
        ...docSnap.data(),
    } as Product;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Product Detail</h1>


            <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}