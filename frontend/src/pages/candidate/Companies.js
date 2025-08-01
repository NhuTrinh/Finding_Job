import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import SearchBar from "../../components/SearchBar";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/companies");
      console.log("Companies API:", res.data);
      setCompanies(res.data.data || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCompanies = async (query, type) => {
  try {
    let url = "/companies";
    if (type === "Công Ty") url = `/companies?search=${query}`;
    if (type === "Vị Trí") url = `/companies?location=${query}`;
    const res = await api.get(url);
    setCompanies(res.data.data || []);
  } catch (err) {
    console.error("Error searching companies:", err);
  }
};


  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Công Ty</h2>
      <SearchBar placeholder="Search companies..." onSearch={handleSearchCompanies} />
      {companies.length > 0 ? (
        <div className="row">
          {companies.map((company) => (
            <div key={company._id} className="col-md-4 mb-4">
              <div
                className="card shadow-sm h-100 text-center p-3 text-white"
                style={{ background: "linear-gradient(135deg, #91C8E4, #749BC2, #4682A9)" }}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold">{company.name}</h5>
                  <p className="mb-1">
                    📍 {company.address?.city || "N/A"},{" "}
                    {company.address?.country || ""}
                  </p>
                  <p className="mb-1">
                    👥 {company.size ? `${company.size} employees` : "Size: N/A"}
                  </p>
                  <p className="small">
                    {company.description || "Chưa có mô tả công ty ."}
                  </p>
                  <Link
                    to={`/candidate/companies/${company._id}`}
                    className="btn btn-light mt-3 w-100 fw-bold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">No companies found.</p>
      )}
    </div>
  );
}

export default Companies;
