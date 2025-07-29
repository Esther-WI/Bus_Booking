const ScheduleList = ({ schedules, onDelete, onEdit, userRole }) => {
  return (
    <div className="schedule-list">
      <h3>Bus Schedules</h3>
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Driver</th>
            <th>Bus</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td>
              {schedule.route?.origin} - {schedule.route?.destination}
              </td>
              <td>{schedule.departure_time}</td>
              <td>{schedule.arrival_time}</td>
              <td>{schedule.driver_id}</td>
              <td>{schedule.registration_number}</td>
              <td>
                <button onClick={() => onEdit(schedule)}>Edit</button>
                {userRole === "Admin" && (
                  <button onClick={() => onDelete(schedule.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleList;
