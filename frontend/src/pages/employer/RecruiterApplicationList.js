import React, { useEffect, useState, useContext } from 'react';
import CandidateCard from '../../components/CandidateCard';
import ApplicationService from '../../services/ApplicationService';
import { AuthContext } from "../../contexts/AuthContext";
import { formatDate } from '../../utils/formatDate';
import { Pagination } from "react-bootstrap";

const RecruiterApplicationList = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ApplicationService.getApplicationsByRecruiter(user.accessToken);
                setApplications(data.data.data);
            } catch (error) {
                console.error('Lỗi lấy danh sách ứng viên:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.accessToken]);

    const totalPages = Math.ceil(applications.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentApplications = applications.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) return <div className="text-center">Đang tải...</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4" className='text-success'>Danh sách ứng viên</h2>
            {applications.length ? (
                <div className="table-responsive">
                    <table className="table table-bordered text-center">
                        <thead>
                            <tr >
                                <th style={{ color: '#06923E' }}>STT</th>
                                <th style={{ color: '#06923E' }}>Họ tên ứng viên</th>
                                <th style={{ color: '#06923E' }}>Tên công việc</th>
                                <th style={{ color: '#06923E' }}>Ngày nộp</th>
                                <th style={{ color: '#06923E' }}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app, index) => (
                                <tr key={app._id}>
                                    <td>{index + 1}</td>
                                    <td>{app.candidateId?.accountId?.fullName || 'Chưa cập nhật'}</td>
                                    <td>{app.jobId?.title || 'Chưa cập nhật'}</td>
                                    <td>{formatDate(app.createdAt)}</td>
                                    <td>
                                        <span>{app.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination controls */}
                    <style>
                        {`
                .page-item.active .page-link {
                    background-color: #06923E !important;
                    border-color: #06923E !important;
                    color: white !important;
                }
            `}
                    </style>
                    <Pagination className="justify-content-center mt-3">
                        <Pagination.First
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        />

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            ) : (
                <p>Chưa có ứng viên nào nộp</p>
            )}


        </div>
    );

};

export default RecruiterApplicationList;