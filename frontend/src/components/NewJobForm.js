import React, { useState } from "react";

const NewJobForm = () => {
  const [form, setForm] = useState({
    companyName: "",
    description: "",
    email: "",
    website: "",
    foundedDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 Đăng việc mới</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Tên công ty</label>
          <input
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Mô tả</label>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium">Email liên hệ</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Website</label>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ngày thành lập</label>
          <input
            type="date"
            name="foundedDate"
            value={form.foundedDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
          >
            XÁC NHẬN
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({
                companyName: "",
                description: "",
                email: "",
                website: "",
                foundedDate: "",
              })
            }
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded"
          >
            HỦY
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewJobForm;