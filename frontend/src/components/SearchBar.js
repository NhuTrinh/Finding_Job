import { useState } from "react";

function SearchBar({ onSearch }) {
  const [searchType, setSearchType] = useState("jobs");

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    onSearch(query, searchType); // Gửi cả query và loại tìm kiếm
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex justify-content-center mb-4">
      <select
        className="form-select w-auto me-2"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      >
        <option value="jobs">Công việc</option>
        <option value="companies">Công ty</option>
        <option value="location">Vị trí</option>
      </select>
      <input
        type="text"
        name="search"
        placeholder={`Tìm kiếm theo ${searchType}...`}
        className="form-control w-50 me-2"
      />
      <button type="submit" className="btn btn-primary">
        Tìm kiếm
      </button>
    </form>
  );
}

export default SearchBar;
