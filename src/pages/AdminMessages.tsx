import AdminLayout from "@/components/admin/AdminLayout";
import MessageList from "@/components/admin/MessageList";

const AdminMessages = () => {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Message Management</h1>
        <p className="text-gray-600">View and manage customer inquiries</p>
      </div>
      
      <MessageList />
    </AdminLayout>
  );
};

export default AdminMessages;
