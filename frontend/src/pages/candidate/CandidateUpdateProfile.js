import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import RequireText from "../../components/RequireText";
import api from "../../api";

const CandidateUpdateprofile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    avatar: "",
    jobTitle: "",
    phoneNumber: "",
    birthDay: "",
    address: { line: "", city: "", country: "" },
    link: "",
    aboutMe: "",

    education: [],
    workExperience: [],
    foreignLanguages: [],
    certificates: [],
    awards: [],
    highlightProjects: [],
    skills: [{ coreSkills: [], softSkills: [] }],
  });

  const [skillInput, setSkillInput] = useState({
    coreSkills: "",
    softSkills: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/candidates/profile-cv");
        const data = res.data;

        setForm({
          ...data,
          address: data.address || { line: "", city: "", country: "" },
          education: data.education || [],
          workExperience: data.workExperience || [],
          foreignLanguages: data.foreignLanguages || [],
          certificates: data.certificates || [],
          awards: data.awards || [],
          highlightProjects: data.highlightProjects || [],
          skills: data.skills?.length
            ? data.skills
            : [{ coreSkills: [], softSkills: [] }],
        });

        setSkillInput({
          coreSkills: data.skills?.[0]?.coreSkills?.join(", ") || "",
          softSkills: data.skills?.[0]?.softSkills?.join(", ") || "",
        });
      } catch (err) {
        console.error("Load profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);


  /* ================= COMMON HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (key, index, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const arr = [...prev[key]];
      arr[index] = { ...arr[index], [name]: value };
      return { ...prev, [key]: arr };
    });
  };

  const handleSkillChange = (type, value) => {
    setForm((prev) => {
      const skills = [...(prev.skills || [{ coreSkills: [], softSkills: [] }])];
      skills[0][type] = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return { ...prev, skills };
    });
  };

  const addItem = (key, emptyItem) => {
    setForm((prev) => ({
      ...prev,
      [key]: [...prev[key], emptyItem],
    }));
  };

  const removeItem = (key, index) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  /* ================= SUBMIT ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      setErrors({ fullName: "Họ tên không được để trống" });
      return;
    }

    const payload = {
      ...form,
      skills: [
        {
          coreSkills: skillInput.coreSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          softSkills: skillInput.softSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      ],
    };

    try {
      await api.put("/candidates/profile-cv", payload);
      alert("Cập nhật hồ sơ thành công");
      navigate("/");
    } catch (err) {
      console.error("Update error:", err.response?.data || err);
    }
  };

  if (loading) return <div className="text-center mt-5">Đang tải...</div>;

  /* ================= UI ================= */
  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4 rounded-4">
        <h3 className="text-center text-success fw-bold mb-4">
          Cập nhật hồ sơ ứng viên
        </h3>

        <Form onSubmit={handleUpdate}>
          {/* ===== BASIC INFO ===== */}
          <h5 className="text-success fw-bold">👤 Thông tin cá nhân</h5>
          <hr />

          <Row className="g-3">
            <Col md={6}>
              <RequireText label="Họ và tên" />
              <Form.Control
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Col>

            <Col md={6}>
              <RequireText label="Email" />
              <Form.Control name="email" value={form.email} disabled />
            </Col>

            <Col md={6}>
              <RequireText label="Số điện thoại" />
              <Form.Control
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* ===== ADDRESS ===== */}
          <h5 className="text-success fw-bold mt-4">📍 Địa chỉ</h5>
          <hr />

          <Row className="g-3">
            <Col md={4}>
              <Form.Control
                placeholder="Địa chỉ"
                name="address.line"
                value={form.address.line}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                placeholder="Thành phố"
                name="address.city"
                value={form.address.city}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                placeholder="Quốc gia"
                name="address.country"
                value={form.address.country}
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* ===== EDUCATION ===== */}
          <Section
            title="🎓 Học vấn"
            data={form.education}
            onAdd={() =>
              addItem("education", {
                schoolName: "",
                degree: "",
                major: "",
                startDate: "",
                endDate: "",
                description: "",
              })
            }
          >
            {(edu, index) => (
              <>
                <Form.Control
                  placeholder="Trường học"
                  name="schoolName"
                  value={edu.schoolName}
                  onChange={(e) => handleArrayChange("education", index, e)}
                />
                <Form.Control
                  placeholder="Chuyên ngành"
                  name="major"
                  value={edu.major}
                  onChange={(e) => handleArrayChange("education", index, e)}
                />
                <Form.Control
                  type="date"
                  name="startDate"
                  value={edu.startDate || ""}
                  onChange={(e) => handleArrayChange("education", index, e)}
                />

                <Form.Control
                  type="date"
                  name="endDate"
                  value={edu.endDate || ""}
                  onChange={(e) => handleArrayChange("education", index, e)}
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeItem("education", index)}
                >
                  Xoá
                </Button>
              </>
            )}
          </Section>

          {/* ===== WORK ===== */}
          <Section
            title="💼 Kinh nghiệm làm việc"
            data={form.workExperience}
            onAdd={() =>
              addItem("workExperience", {
                companyName: "",
                jobTitle: "",
                description: "",
              })
            }
          >
            {(work, index) => (
              <>
                <Form.Control
                  placeholder="Công ty"
                  name="companyName"
                  value={work.companyName}
                  onChange={(e) =>
                    handleArrayChange("workExperience", index, e)
                  }
                />
                <Form.Control
                  placeholder="Vị trí"
                  name="jobTitle"
                  value={work.jobTitle}
                  onChange={(e) =>
                    handleArrayChange("workExperience", index, e)
                  }
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeItem("workExperience", index)}
                >
                  Xoá
                </Button>
              </>
            )}
          </Section>

          {/* ===== LANGUAGES ===== */}
          <Section
            title="🌍 Ngoại ngữ"
            data={form.foreignLanguages}
            onAdd={() => addItem("foreignLanguages", { language: "", level: "" })}
          >
            {(lang, index) => (
              <>
                <Form.Control
                  placeholder="Ngôn ngữ"
                  name="language"
                  value={lang.language}
                  onChange={(e) =>
                    handleArrayChange("foreignLanguages", index, e)
                  }
                />
                <Form.Control
                  placeholder="Trình độ"
                  name="level"
                  value={lang.level}
                  onChange={(e) =>
                    handleArrayChange("foreignLanguages", index, e)
                  }
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeItem("foreignLanguages", index)}
                >
                  Xoá
                </Button>
              </>
            )}
          </Section>



          {/* ===== SKILLS ===== */}
          <h5 className="text-success fw-bold mt-4">🧠 Kỹ năng</h5>
          <hr />

          <Form.Group className="mb-3">
            <Form.Label>Kỹ năng chuyên môn (phân cách bằng dấu ,)</Form.Label>
            <Form.Control
              value={skillInput.coreSkills}
              onChange={(e) =>
                setSkillInput((prev) => ({
                  ...prev,
                  coreSkills: e.target.value,
                }))
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Kỹ năng mềm</Form.Label>
            <Form.Control
              value={skillInput.softSkills}
              onChange={(e) =>
                setSkillInput((prev) => ({
                  ...prev,
                  softSkills: e.target.value,
                }))
              }
            />
          </Form.Group>

          {/* ===== PROJECTS ===== */}
          <Section
            title="🚀 Dự án"
            data={form.highlightProjects}
            onAdd={() =>
              addItem("highlightProjects", {
                name: "",
                startDate: "",
                endDate: "",
                description: "",
                projectUrl: "",
              })
            }
          >
            {(proj, index) => (
              <>
                <Form.Control
                  placeholder="Tên dự án"
                  name="name"
                  value={proj.name}
                  onChange={(e) =>
                    handleArrayChange("highlightProjects", index, e)
                  }
                />
                <Form.Control
                  placeholder="Mô tả"
                  name="description"
                  value={proj.description}
                  onChange={(e) =>
                    handleArrayChange("highlightProjects", index, e)
                  }
                />
                <Form.Control
  type="date"
  name="startDate"
  value={proj.startDate || ""}
  onChange={(e) => handleArrayChange("highlightProjects", index, e)}
/>

<Form.Control
  type="date"
  name="endDate"
  value={proj.endDate || ""}
  onChange={(e) => handleArrayChange("highlightProjects", index, e)}
/>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeItem("highlightProjects", index)}
                >
                  Xoá
                </Button>
              </>
            )}
          </Section>

          {/* ===== CERTIFICATES ===== */}
          <Section
            title="📜 Chứng chỉ"
            data={form.certificates}
            onAdd={() =>
              addItem("certificates", {
                name: "",
                organization: "",
                issueDate: "",
                description: "",
                certificateUrl: "",
              })
            }
          >
            {(cert, index) => (
              <>
                <Form.Control
                  placeholder="Tên chứng chỉ"
                  name="name"
                  value={cert.name}
                  onChange={(e) =>
                    handleArrayChange("certificates", index, e)
                  }
                />
                <Form.Control
                  placeholder="Tổ chức cấp"
                  name="organization"
                  value={cert.organization}
                  onChange={(e) =>
                    handleArrayChange("certificates", index, e)
                  }
                />
                <Form.Control
  type="date"
  name="issueDate"
  value={cert.issueDate || ""}
  onChange={(e) => handleArrayChange("certificates", index, e)}
/>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeItem("certificates", index)}
                >
                  Xoá
                </Button>
              </>
            )}
          </Section>

          {/* ===== AWARDS ===== */}
          <Section
            title="🏆 Giải thưởng"
            data={form.awards}
            onAdd={() =>
              addItem("awards", {
                name: "",
                organization: "",
                issueDate: "",
                description: "",
              })
            }
          >
            {(award, index) => (
              <>
                <Form.Control
                  placeholder="Tên giải"
                  name="name"
                  value={award.name}
                  onChange={(e) => handleArrayChange("awards", index, e)}
                />
                <Form.Control
                  placeholder="Tổ chức"
                  name="organization"
                  value={award.organization}
                  onChange={(e) => handleArrayChange("awards", index, e)}
                />
                <Form.Control
  type="date"
  name="issueDate"
  value={award.issueDate || ""}
  onChange={(e) => handleArrayChange("awards", index, e)}
/>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeItem("awards", index)}
                >
                  Xoá
                </Button>
              </>
            )}
          </Section>

          <div className="text-center mt-5">
            <Button type="submit" variant="success" className="px-4">
              Cập nhật hồ sơ
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

/* ===== SECTION WRAPPER ===== */
const Section = ({ title, data = [], onAdd, children }) => (
  <>
    <h5 className="text-success fw-bold mt-4">{title}</h5>
    <hr />

    {data.length === 0 && (
      <p className="text-muted fst-italic">Chưa có dữ liệu</p>
    )}

    {data.map((item, index) => (
      <div key={index} className="border rounded p-3 mb-3 d-grid gap-2">
        {children(item, index)}
      </div>
    ))}

    <Button variant="outline-success" size="sm" onClick={onAdd}>
      + Thêm
    </Button>
  </>
);

export default CandidateUpdateprofile;