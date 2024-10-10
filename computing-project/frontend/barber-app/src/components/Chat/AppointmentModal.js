import React, { useState, useEffect } from "react";
import { updateAppointment } from "../../utils/appointment";

const AppointmentModal = ({ appointment, onSubmit, onClose, isEditable }) => {
  const [appointmentDate, setAppointmentDate] = useState(
    appointment?.date || ""
  );
  const [services, setServices] = useState(appointment?.services || "");
  const [notes, setNotes] = useState(appointment?.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      date: appointmentDate,
      services,
      notes,
    });
  };

  useEffect(() => {
    if (appointment) {
      setAppointmentDate(appointment.date);
      setServices(appointment.service);
      setNotes(appointment.notes);
    }
  }, [appointment]); 

  const handleAccept = () => {
    console.log("Appointment accepted");
    updateAppointment(appointment._id, "confirmed")
    onClose()
  };

  const handleDecline = () => {
    console.log("Appointment declined");
    updateAppointment(appointment._id, "cancelled")
    onClose()
  };

  const handleComplete = () => {
    console.log("Appointment accepted");
    updateAppointment(appointment._id, "completed")
    onClose()
  };

  const handleCancel = () => {
    console.log("Appointment canccelled");
    updateAppointment(appointment._id, "cancelled")
    onClose()
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEditable ? "Book Appointment" : "Appointment Details"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Conditionally render inputs or just text */}
          <div>
            <label
              htmlFor="appointmentDate"
              className="block text-sm font-medium text-gray-700"
            >
              Date & Time
            </label>
            {isEditable ? (
              <input
                id="appointmentDate"
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            ) : (
              <p className="mt-1 block w-full py-2 px-3 bg-gray-100 rounded-md shadow-sm sm:text-sm">
                {appointmentDate}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="services"
              className="block text-sm font-medium text-gray-700"
            >
              Services
            </label>
            {isEditable ? (
              <input
                id="services"
                type="text"
                value={services}
                onChange={(e) => setServices(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            ) : (
              <p className="mt-1 block w-full py-2 px-3 bg-gray-100 rounded-md shadow-sm sm:text-sm">
                {services}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            {isEditable ? (
              <input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            ) : (
              <p className="mt-1 block w-full py-2 px-3 bg-gray-100 rounded-md shadow-sm sm:text-sm">
                {notes}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            {isEditable ? (
              // Show continue and cancel buttons for editable mode
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Continue
                </button>
              </>
            ) : (
              // Show accept and decline buttons for read-only mode
              <>
                <button
                  onClick={handleDecline}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={handleComplete}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Complete
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
