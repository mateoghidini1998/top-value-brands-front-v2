export const DGItemCell = ({ dgItem }: { dgItem: string }) => {
  const checkIfHazmat = (dgItem: string) => {
    const isHazmat: boolean =
      dgItem !== "--" &&
      dgItem !== "STANDARD" &&
      dgItem !== "" &&
      dgItem !== null &&
      dgItem !== undefined;

    return isHazmat;
  };

  return (
    <div className="flex justify-center items-center relative group">
      {checkIfHazmat(dgItem) ? (
        <span className="text-red-500 font-semibold">Yes</span>
      ) : (
        <span>No</span>
      )}
      <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm p-1 rounded">
        {dgItem}
      </div>
    </div>
  );
};
