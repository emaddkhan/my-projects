import React, { useState } from "react";

function Form({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    description: "",
    fileSize: "",
    close: false,
    tag: {
      isOpen: false,
      tagTitle: "",
      tagColor: "green"
    }
  });

  // Handle change for top-level fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in formData) {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Handle change for nested tag fields
  const handleTagChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      tag: {
        ...formData.tag,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full h-screen bg-zinc-900/90 z-[5] flex-wrap fixed top-0 left-0">
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-[60%] h-[70%] bg-zinc-100 rounded-xl shadow-lg p-8 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Add File Details</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Description */}
            <div>
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            {/* File Size */}
            <div>
              <label className="block font-medium">File Size</label>
              <input
                type="text"
                name="fileSize"
                value={formData.fileSize}
                onChange={handleChange}
                placeholder="e.g. 1.5 MB"
                className="w-full border rounded p-2"
              />
            </div>

            {/* Close */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="close"
                checked={formData.close}
                onChange={handleChange}
              />
              <label>Close</label>
            </div>

            {/* Tag Section */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Tag</h3>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isOpen"
                  checked={formData.tag.isOpen}
                  onChange={handleTagChange}
                />
                <label>Is Open</label>
              </div>

              <div className="mt-2">
                <label className="block font-medium">Tag Title</label>
                <input
                  type="text"
                  name="tagTitle"
                  value={formData.tag.tagTitle}
                  onChange={handleTagChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="mt-2">
                <label className="block font-medium">Tag Color</label>
                <select
                  name="tagColor"
                  value={formData.tag.tagColor}
                  onChange={handleTagChange}
                  className="w-full border rounded p-2"
                >
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-400 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-green-600 text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
