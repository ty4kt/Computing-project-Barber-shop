const Appointment = require("../models/Appointments"); // Assuming Appointment model is in the same directory
const mongoose = require("mongoose");

class AppointmentService {
  // Create a new appointment
  static async createAppointment(client, barber, date, services, notes) {
    const appointment = new Appointment({
      client: new mongoose.Types.ObjectId(client),
      barber: new mongoose.Types.ObjectId(barber),
      date,
      service: services,
      notes,
    });

    await appointment.save();
    return appointment;
  }

  static async findAppointmentById(appointmentId) {
    return await Appointment.findById(appointmentId)
  }

  static async findAppointmentsForUser(userId) {
    return await Appointment.find({ user: userId }).populate(
      "barber",
      "full_name"
    );
  }

  static async findAppointmentsForBarber(barberId) {
    return await Appointment.find({ barber: barberId }).populate(
      "user",
      "full_name"
    );
  }

  static async updateAppointmentStatus(appointmentId, status) {
    return await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );
  }
}

module.exports = AppointmentService;
