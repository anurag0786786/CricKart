import React, { useEffect, useState } from "react";
import axios from "axios";
import Category from "./Category";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://crickart-mchl.onrender.com/category");
        setCategories(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://crickart-mchl.onrender.com/product");
        console.log(res.data);

        setProducts(res.data.product);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = async () => {
    const toastId = toast.loading("Adding product... ⏳");

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", image);

      const res = await axios.post(
        "https://crickart-mchl.onrender.com/product/add",
        formData,
      );

      // ✅ UI update
      setProducts((prev) => [...prev, res.data.product]);

      // ✅ modal close
      setShowModal(false);

      // ✅ reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategories("");
      setImage("");

      toast.success("Product added ✅", { id: toastId });
    } catch (error) {
      toast.error("Failed to add ❌", { id: toastId });
    }
  };

  const editProduct = async () => {
    const toastId = toast.loading("Updating...");

    toast.success("Updated 🔄", { id: toastId });
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", image);

      const res = await axios.put(
        `https://crickart-mchl.onrender.com/product/${editId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Product updated 🔄");

      setProducts((prev) =>
        prev.map((item) => (item._id === editId ? res.data.product : item)),
      );

      setName("");
      setPrice("");
      setCategory("");
      setImage("");
      setDescription("");
      setShowModal(false);
      setEditId(null);
    } catch (error) {}
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`https://crickart-mchl.onrender.com/product/${id}`);

      setProducts(products.filter((item) => item._id !== id));
      toast.success("Product deleted 🗑️");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>

            <input
              type="text"
              placeholder="Name"
              className="w-full border p-2 mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Description"
              className="w-full border p-2 mb-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="number"
              placeholder="Price"
              className="w-full border p-2 mb-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <select
              className="w-full border p-2 mb-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              className="w-full border p-2 mb-4"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={editId ? editProduct : addProduct}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between px-30 mt-10">
        <h2 className="text-blue-500 font-bold text-3xl">Products</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 rounded-2xl text-1.5xl px-4 py-2 text-white"
        >
          Add New Product
        </button>
      </div>
      <div className="mx-auto max-w-6xl mt-6 px-4">
        <table className="w-full border border-e-black">
          <thead className="border-e-black bg-black text-white">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody className="border-e-black">
            {products.map((item) => (
              <tr key={item._id}>
                <td className="p-3 border">{item.name}</td>
                <td className="p-3 border">{item.description}</td>
                <td className="p-3 border">{item.price}</td>
                <td className="p-3 border">{item.category.name}</td>
                <td className="p-3 border">
                  <img
                    src={item.image}
                    alt="product"
                    className="w-16 h-16 object-cover rounded-2xl"
                  />
                </td>
                <td className="p-3  flex gap-2">
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setEditId(item._id);
                      setName(item.name);
                      setCategory(item.category._id);
                      setPrice(item.price);
                      setDescription(item.description);
                      setImage(item.image);
                    }}
                    className="bg-yellow-500 rounded-2xl px-4 py-1 "
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteProduct(item._id);
                    }}
                    className="bg-red-500 rounded-2xl px-4 py-1 "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Product;
