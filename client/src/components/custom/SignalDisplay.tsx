type Props = {
  up: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  down: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

const getQuality = (value: Props["up"]) => {
  switch (value) {
    case 0:
      return { label: "Unknown", color: "text-gray-400" };
    case 1:
      return { label: "Excellent", color: "text-green-500" };
    case 2:
      return { label: "Good", color: "text-lime-500" };
    case 3:
    case 4:
      return { label: "Average", color: "text-yellow-500" };
    case 5:
      return { label: "Poor", color: "text-orange-500" };
    case 6:
      return { label: "Very Poor", color: "text-red-500" };
    default:
      return { label: "Unknown", color: "text-gray-400" };
  }
};

const SignalDisplay = ({ up, down }: Props) => {
  const upQuality = getQuality(up);
  const downQuality = getQuality(down);

  return (
    <div>
      <div className={`${upQuality.color}`}>
        <span className="font-medium">Up:</span> {upQuality.label}
      </div>
      <div className={`${downQuality.color}`}>
        <span className="font-medium">Down:</span> {downQuality.label}
      </div>
    </div>
  );
};

export default SignalDisplay;