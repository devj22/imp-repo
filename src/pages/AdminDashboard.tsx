import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property, BlogPost, Message } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { data: properties } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blogs'],
  });
  
  const { data: messages } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
  });
  
  const unreadMessages = messages?.filter(message => !message.isRead) || [];
  
  // Format price to Indian currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Calculate total property value
  const totalPropertyValue = properties?.reduce((total, property) => total + property.price, 0) || 0;
  
  useEffect(() => {
    document.title = "Admin Dashboard | Nainaland Deals";
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Nainaland Deals admin panel</p>
      </div>
      
      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-primary/10">
                <i className="fas fa-home text-primary text-xl"></i>
              </div>
              <div>
                <div className="text-3xl font-bold">{properties?.length || 0}</div>
                <p className="text-gray-500 text-sm">Active listings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Property Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-green-500/10">
                <i className="fas fa-rupee-sign text-green-500 text-xl"></i>
              </div>
              <div>
                <div className="text-3xl font-bold">{formatPrice(totalPropertyValue)}</div>
                <p className="text-gray-500 text-sm">Combined value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-blue-500/10">
                <i className="fas fa-file-alt text-blue-500 text-xl"></i>
              </div>
              <div>
                <div className="text-3xl font-bold">{blogPosts?.length || 0}</div>
                <p className="text-gray-500 text-sm">Published articles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Unread Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-yellow-500/10">
                <i className="fas fa-envelope text-yellow-500 text-xl"></i>
              </div>
              <div>
                <div className="text-3xl font-bold">{unreadMessages?.length || 0}</div>
                <p className="text-gray-500 text-sm">Pending responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/properties">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <i className="fas fa-plus-circle text-primary mr-3"></i>
              Add New Property
            </Button>
          </Link>
          
          <Link href="/admin/blogs">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <i className="fas fa-edit text-primary mr-3"></i>
              Create Blog Post
            </Button>
          </Link>
          
          <Link href="/admin/messages">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <i className="fas fa-envelope-open text-primary mr-3"></i>
              View Messages
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <i className="fas fa-eye text-primary mr-3"></i>
              View Website
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Recent Items Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {properties && properties.length > 0 ? (
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <div key={property.id} className="flex items-center border-b border-gray-100 pb-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                      <img 
                        src={property.images?.[0] || "https://via.placeholder.com/150"} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-sm mb-1 truncate">{property.title}</h3>
                      <p className="text-gray-500 text-xs">{property.location}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="font-semibold text-sm">{formatPrice(property.price)}</div>
                      <div className="text-xs text-gray-500">{property.size} {property.sizeUnit}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No properties found
              </div>
            )}
            
            <div className="mt-4">
              <Link href="/admin/properties">
                <Button variant="outline" size="sm" className="w-full">
                  View All Properties
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.slice(0, 5).map((message) => (
                  <div key={message.id} className="flex items-center border-b border-gray-100 pb-4">
                    <div className={`w-2 h-2 rounded-full mr-4 ${message.isRead ? 'bg-gray-300' : 'bg-green-500'}`}></div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-sm mb-1">{message.name}</h3>
                      <p className="text-gray-500 text-xs truncate">{message.message.substring(0, 50)}...</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-xs text-gray-500">{message.interest}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No messages found
              </div>
            )}
            
            <div className="mt-4">
              <Link href="/admin/messages">
                <Button variant="outline" size="sm" className="w-full">
                  View All Messages
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
