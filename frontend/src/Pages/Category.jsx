import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Category = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://crickart-mchl.onrender.com/category");
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this category?",
      );
      if (!confirmDelete) return;
      await axios.delete(`https://crickart-mchl.onrender.com/category/${id}`);

      setCategories(categories.filter((cat) => cat._id !== id));
      toast.success("Category deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    if (!name) {
      alert("Enter category name");
      return;
    }

    try {
      if (editId) {
        const res = await axios.put(
          `https://crickart-mchl.onrender.com/category/${editId}`,
          { name },
        );
        const updated = categories.map((cat) =>
          cat._id === editId ? res.data.category : cat,
        );
        setCategories(updated);
        toast.success("Category updated successfully");
      } else {
        const res = await axios.post("https://crickart-mchl.onrender.com/category/add", {
          name,
        });

        // UI update
        console.log(res.data);
        setCategories([...categories, res.data.category]);
        toast.success("Category added successfully");
      }

      setName("");
      setEditId("null");
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-100">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Category" : "Add Category"}
            </h2>

            <input
              type="text"
              placeholder="Enter category name"
              className="w-full border p-2 mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAdd}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="flex justify-between items-center px-30 mt-10">
          <h2 className="text-blue-500 text-3xl font-bold">Category</h2>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(true)}
          >
            Add New Category
          </button>
        </div>
        <div className="max-w-6xl mx-auto mt-6 px-4">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">Category Name</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length == 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-4">
                    No Category Found
                  </td>
                </tr>
              ) : (
                categories.map((cat, index) => (
                  <tr key={cat._id}>
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{cat.name}</td>

                    <td className="p-3 flex gap-2  border">
                      <button
                        className="bg-green-500 text-white px-4 py-2 mt-2 rounded "
                        onClick={() => {
                          setShowModal(true);
                          setName(cat.name);
                          setEditId(cat._id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white   rounded px-4 py-2 mt-2 "
                        onClick={() => {
                          handleDelete(cat._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Category;
