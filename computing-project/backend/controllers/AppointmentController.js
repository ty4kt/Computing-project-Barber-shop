const AppointmentService = require("../services/AppointmentService");
const MessageService = require("../services/MessageService");
const Appointment = require("../models/Appointments")

class AppointmentController {
  static async createAppointment(req, res) {
    const userId = req.user.id;

    try {
      const {
        barberId,
        date,
        services,
        notes
      } = req.body;

      const appointmentDate = new Date(date);
      const now = new Date();

      if (appointmentDate < now) {
        return res
          .status(400)
          .json({
            message: "You cannot create an appointment in the past."
          });
      }

      const existingAppointments = await Appointment.find({
        client: userId,
        barber: barberId,
        status: "pending",
        date: {
          $gte: new Date()
        },
      });

      if (existingAppointments.length > 0) {
        return res.status(400).json({
          message: "You already have a pending appointment with this barber.",
        });
      }

      const appointment = await AppointmentService.createAppointment(
        userId,
        barberId,
        date,
        services,
        notes
      );
      const conversation = await MessageService.findOrCreateConversation(
        userId,
        barberId
      );

      const invitationMessage = {
        conversationId: conversation._id,
        type: "system",
        action: "appointment-invitation",
        actionDetails: {
          appointmentId: appointment._id,
          date: appointment.date,
          services: appointment.services,
        },
        sender: userId,
        text: `Appointment invitation on ${new Date(date).toLocaleString()}`,
      };

      await MessageService.createAppointmentAttemptMessage(invitationMessage);

      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }

  static async getAppointmentById(req, res) {
    try {
      const {
        appointmentId
      } = req.query;
      const appointment = await AppointmentService.findAppointmentById(appointmentId);
      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found"
        });
      }
      res.status(200).json(appointment);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }

  static async updateAppointment(req, res) {
    try {
      const {
        appointmentId,
        status
      } = req.body;

      if (!status) {
        return res.status(404).json({
          message: "Status required"
        });
      }

      const userId = req.user.id

      const appointment = await AppointmentService.findAppointmentById(appointmentId);
      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found"
        });
      }

      if (userId != appointment.barber) {
        return res.status(404).json({
          message: "you're not the barber m8"
        });
      }

      switch (status) {
        case 'confirmed':
          break;
        case 'pending':
          break;
        case 'completed':
          break;
        case 'cancelled':
          break;
        default:
          return res.status(404).json({
            message: "invalid status"
          });
      }

      await AppointmentService.updateAppointmentStatus(appointmentId, status)

      
      const conversation = await MessageService.findOrCreateConversation(
        userId,
        appointment.client
      );

      switch (status) {
        case 'confirmed':

          if (appointment.status == "confirmed") {
            return res.status(403).json({
              message: "already confirmed"
            });
          }
          await MessageService.createSystemMessage(conversation._id, userId, "appointment-acceptance", {
            appointmentId: appointment._id,
            date: appointment.date,
            services: appointment.services,
          }, "Appointment has been accepted! See you there.")
    
          break;
        case 'pending':
          break;
        case 'completed':
          await MessageService.createSystemMessage(conversation._id, userId, "appointment-completed", {
            appointmentId: appointment._id,
            date: appointment.date,
            services: appointment.services,
          }, "Appointment has been completed")
          break;
        case 'cancelled':
          await MessageService.createSystemMessage(conversation._id, userId, "appointment-cancelled", {
            appointmentId: appointment._id,
            date: appointment.date,
            services: appointment.services,
          }, "Appointment has been cancelled")
    
          break;
        default:
          return res.status(404).json({
            message: "invalid status"
          });
      }




      res.status(200).json(appointment);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
  // Add other endpoint handlers as needed...
}

module.exports = AppointmentController;