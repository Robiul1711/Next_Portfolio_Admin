import { useApiQuery } from "@/hooks/allCMS";
import React from "react";


const AllContacts = () => {
    const { data: allContact, isLoading } = useApiQuery({
      queryKey: "all-contact",
      url: "/api/contact",
      secure: true,
    });
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">All Contact Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: CONTACT LIST */}
        <div className="lg:col-span-2 space-y-4">
          {allContact?.length === 0 && (
            <p className="text-gray-400">No contacts found.</p>
          )}

          {allContact?.map((contact) => (
            <div
              key={contact._id}
              className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:border-blue-500 transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">{contact.name}</h2>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-300 text-sm mt-2">
                <span className="font-semibold">Email:</span> {contact.email}
              </p>

              <p className="text-gray-300 text-sm mt-2">
                <span className="font-semibold">Address:</span> {contact.address}
              </p>

              <p className="text-gray-400 text-sm mt-3 italic">
                "{contact.message}"
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AllContacts;
