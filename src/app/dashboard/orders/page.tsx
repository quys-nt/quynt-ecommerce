// app/dashboard/orders/page.tsx
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrdersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#1001</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>$149.98</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" className="mr-2">
                View
              </Button>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#1002</TableCell>
            <TableCell>Jane Smith</TableCell>
            <TableCell>$99.99</TableCell>
            <TableCell>Delivered</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" className="mr-2">
                View
              </Button>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}