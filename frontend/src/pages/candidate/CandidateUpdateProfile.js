import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobService from '../../services/JobService.js';
import { AuthContext } from '../../contexts/AuthContext.js';
import RequireText from '../../components/RequireText.js';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import api from "../../api.js";


const CandidateUpdateprofile = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        avatar: '',
        jobTitle: '',
        phoneNumber: '',
        birthDay: '',
        address: {
            line: '',
            city: '',
            country: ''
        },
        link: '',
        aboutMe: '',
        education: [
            {
                schoolName: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: ''
            }
        ],
        workExperience: [
            {
                companyName: '',
                jobTitle: '',
                startDate: '',
                endDate: '',
                description: '',
                project: ''
            }
        ],
        skills: [
            {
                coreSkills: [
                    
                ],
                softSkills: [
                    
                ]
            }
        ],
        foreignLanguages: [
            {
                language: '',
                level: ''
            }
        ],
        highlightProjects: [
            {
                name: '',
                startDate: '',
                endDate: '',
                description: '',
                projectUrl: ''
            }
        ],
        certificates: [
            {
                name: '',
                organization: '',
                issueDate: '',
                certificateUrl: '',
                description: ''
            }
        ],
        awards: [
            {
                name: '',
                organization: '',
                issueDate: '',
                description: ''
            }
        ],
        profile: {
            avatar: '',
            jobTitle: '',
            phoneNumber: '',
            birthDay: '',
            gender: '',
            address: {
                line: '',
                city: '',
                country: ''
            },
            link: '',
            aboutMe: '',
            education: [
                {
                    schoolName: '',
                    degree: '',
                    major: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                }
            ],
            workExperience: [
                {
                    companyName: '',
                    jobTitle: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    project: ''
                }
            ],
            skills: [
                {
                    coreSkills: [
                        
                    ],
                    softSkills: [
                        
                    ]
                }
            ],
            foreignLanguages: [
                {
                    language: '',
                    level: ''
                }
            ],
            highlightProjects: [
                {
                    name: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    projectUrl: ''
                }
            ],
            certificates: [
                {
                    name: '',
                    organization: '',
                    issueDate: '',
                    certificateUrl: '',
                    description: ''
                }
            ],
            awards: [
                {
                    name: '',
                    organization: '',
                    issueDate: '',
                    description: ''
                }
            ]
        },
        attachments: {
            preferredWorkLocation: [
                
            ],
            totalYearsOfExperience: 0,
            currentJobLevel: '',
            expectedWorkingModel: '',
            expectedSalary: {
                salaryMin: 0,
                salaryMax: 0
            },
            currentSalary: 0,
            coverLetter: ''
        }
    });

    useEffect(() => {
  const updateProfile = async () => {
    try {
        const response = await api.get('/candidates/profile-cv');
        setForm(response.data);
        console.log("Thông tin hiện có:", response.data);
        setProfile(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin:", error);
    }
  };

  updateProfile();
}, []);

    const validateForm = () => {
        const newErrors = {};

        if (!form.fullName.trim()) newErrors.fullName = 'Họ và tên không được để trống';

        return newErrors;
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
          setForm(prev => ({
              
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

  const handleEducationChange = (e, index) => {
  const { name, value } = e.target;
  setForm((prev) => {
    const updatedEducation = [...prev.education];
    updatedEducation[index][name] = value;
    return {
      ...prev,
      education: updatedEducation,
    };
  });
};


    const handleUpdate = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        try {
      const response = await api.put('/candidates/profile-cv', form);
          console.log("Cập nhật thành công:", response.data);
          localStorage.setItem("fullName", response.data.fullName);
          window.location.reload();
          
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
        navigate('/');
    };

    const cities = [
        "Hồ Chí Minh",
        "Hà Nội",
        "Đà Nẵng",
        "Cần Thơ",
        "Hải Phòng",
    ];

    const countries = [
        "Việt Nam",
        "Mỹ",
        "Nhật Bản",
        "Hàn Quốc",
        "Trung Quốc"
    ];

    const type = [
        "Full-time",
        "Part-time",
        "Remote"
    ]



    if (!profile) return <div className="text-center mt-5">Đang tải...</div>;

    return (
    <div className="container my-5">
      <div className="card shadow-lg p-4 rounded-4">
        <h2 className="text-center mb-4 text-success fw-bold">Cập nhật hồ sơ cá nhân</h2>
        <form onSubmit={handleUpdate}>
          {/* --- Block 1: Thông tin cá nhân --- */}
          <h5 className="fw-bold text-success mt-3">👤 Thông tin cá nhân</h5>
          <hr />
          <div className="row g-3">
            <div className="col-md-6 fw-semibold">
              <RequireText label="Họ và tên:" />
              <input
                type="text"
                name="fullName"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                value={form.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
            </div>

            <div className="col-md-6 fw-semibold">
              <RequireText label="Email:" />
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-md-6 fw-semibold">
              <RequireText label="Số điện thoại:" />
              <input
                type="text"
                name="phoneNumber"
                className="form-control"
                value={form.phoneNumber}
                onChange={handleChange}
              />
            </div>

           
          </div>

          {/* --- Block 2: Địa chỉ --- */}
          <h5 className="fw-bold text-success mt-4">📍 Địa chỉ</h5>
          <hr />
          <div className="row g-3">
            <div className="col-md-6 fw-semibold">
              <RequireText label="Địa chỉ:" />
              <input
                type="text"
                name="address.line"
                className={`form-control ${errors.line ? 'is-invalid' : ''}`}
                value={form.address.line}
                onChange={handleChange}
              />
              {errors.line && <div className="invalid-feedback">{errors.line}</div>}
            </div>

            <div className="col-md-6 fw-semibold">
              <RequireText label="Thành phố:" />
              <Form.Select
                name="address.city"
                value={form.address.city}
                onChange={handleChange}
                className={errors.city ? 'is-invalid' : ''}
              >
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </Form.Select>
              {errors.city && <div className="invalid-feedback">{errors.city}</div>}
            </div>

            <div className="col-md-6 fw-semibold">
              <RequireText label="Quốc gia:" />
              <Form.Select
                name="address.country"
                value={form.address.country}
                onChange={handleChange}
                className={errors.country ? 'is-invalid' : ''}
              >
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </Form.Select>
              {errors.country && <div className="invalid-feedback">{errors.country}</div>}
            </div>
          </div>

          {/* --- Block 3: Kỹ năng --- */}
          <h5 className="fw-bold text-success mt-4">🧠 Kỹ năng</h5>
          <hr />
          <div className="row g-3">
            <div className="col-md-12 fw-semibold">
              <label className="form-label">Kỹ năng chuyên môn (cách nhau bởi dấu phẩy)</label>
              <input
                type="text"
                name="skills.coreSkills"
                className="form-control"
                value={form.skills[0]?.coreSkills.join(', ')}
                onChange={(e) => {
                  const updated = [...form.skills];
                  updated[0].coreSkills = e.target.value.split(',').map(s => s.trim());
                  handleChange({ target: { name: 'skills', value: updated } });
                }}
              />
            </div>
            </div>

            <h5 className="fw-bold text-success mt-4">🎓 Học vấn</h5>
<hr />
<div className="row g-3">
  <div className="col-md-6 fw-semibold">
    <label className="form-label">Trường học</label>
    <input
      type="text"
      name="schoolName"
      className="form-control"
      value={form.education[0]?.schoolName || ''}
      onChange={(e) => handleEducationChange(e, 0)}
    />
  </div>

  <div className="col-md-6 fw-semibold">
    <label className="form-label">Chuyên ngành</label>
    <input
      type="text"
      name="major"
      className="form-control"
      value={form.education[0]?.major || ''}
      onChange={(e) => handleEducationChange(e, 0)}
    />
  </div>

  <div className="col-md-6 fw-semibold">
    <label className="form-label">Bằng cấp</label>
    <input
      type="text"
      name="degree"
      className="form-control"
      value={form.education[0]?.degree || ''}
      onChange={(e) => handleEducationChange(e, 0)}
    />
  </div>

  <div className="col-md-6 fw-semibold">
    <label className="form-label">Mô tả</label>
    <input
      type="text"
      name="description"
      className="form-control"
      value={form.education[0]?.description || ''}
      onChange={(e) => handleEducationChange(e, 0)}
    />
  </div>

 
</div>
            

          {/* --- Nút cập nhật --- */}
          <div className="d-flex justify-content-center gap-3 mt-5">
            <button type="submit" className="btn btn-success px-4 py-2 fw-semibold rounded-3">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateUpdateprofile;