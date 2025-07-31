import "./ScheduleList.css";

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString(); // Format based on user's locale
};

const ScheduleList = ({ schedules, onEdit }) => {
  return (
    <div className="schedule-list">
      <h3>Bus Schedules</h3>
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Bus</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>
                  {schedule.route?.origin || 'N/A'} - {schedule.route?.destination || 'N/A'}
                </td>
                <td>{formatDateTime(schedule.departure_time)}</td>
                <td>{formatDateTime(schedule.arrival_time)}</td>
                <td>
                  {schedule.bus?.registration_number || 'N/A'}
                </td>
                <td>
                  <button onClick={() => onEdit(schedule)}>Edit</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No schedules found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleList;