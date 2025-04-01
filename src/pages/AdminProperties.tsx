import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import PropertyForm from "@/components/admin/PropertyForm";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeader } from "@/lib/auth";

const AdminProperties = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  const deletePropertyMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/properties/${id}`, undefined, getAuthHeader());
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    },
  });
  
  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };
  
  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };
  
  const openEditDialog = (property: Property) => {
    setSelectedProperty(property);
    setIsEditDialogOpen(true);
  };
  
  const closeEditDialog = () => {
    setSelectedProperty(null);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteProperty = (id: number) => {
    if (confirm("Are you sure you want to delete this property?")) {
      deletePropertyMutation.mutate(id);
    }
  };
  
  // Format price in Indian currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Property Management</h1>
          <p className="text-gray-600">Add, edit, and delete property listings</p>
        </div>
        <Button onClick={openAddDialog} className="bg-primary">
          <i className="fas fa-plus mr-2"></i> Add New Property
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
          <CardDescription>
            {isLoading ? "Loading properties..." : 
            properties ? `${properties.length} properties found` : 
            "No properties found"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>Error loading properties. Please try again later.</p>
            </div>
          ) : properties && properties.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>{property.propertyType}</TableCell>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>{property.size} {property.sizeUnit}</TableCell>
                      <TableCell>{formatPrice(property.price)}</TableCell>
                      <TableCell>
                        {property.isFeatured ? (
                          <Badge className="bg-[#FF6B35]">Featured</Badge>
                        ) : (
                          <Badge variant="outline">Regular</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openEditDialog(property)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No properties found. Click "Add New Property" to create one.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Property Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
          </DialogHeader>
          <PropertyForm 
            mode="create" 
            onSuccess={closeAddDialog}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Property Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <PropertyForm 
              mode="edit" 
              property={selectedProperty}
              onSuccess={closeEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProperties;
