const CandidateCard = ({ candidate }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
      <img
        src={candidate?.avatar || 'https://via.placeholder.com/300x200'} // fallback nếu không có ảnh
        alt={candidate.fullName}
        className="w-full h-48 object-cover"
      />
      <div className="p-3">
        <h3 className="text-lg font-semibold">{candidate.fullName}</h3>
        <p className="text-gray-600 text-sm">{candidate.email}</p>
        <p className="text-sm text-gray-500 mt-1">{candidate?.cv || 'Chưa có CV'}</p>
      </div>
    </div>
  );
};

export default CandidateCard;