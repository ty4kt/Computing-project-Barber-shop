const createAppointment = async (barberId, date, services, notes = '') => {
  const authorization = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/appointments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization}`,
      },
      body: JSON.stringify({
        barberId,
        date,
        services,
        notes,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create appointment');
    }

    const appointment = await response.json();
    return appointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

const getAppointmentById = async (appointmentId) => {
  const authorization = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/appointments/get?appointmentId=${appointmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get appointment');
    }

    const appointment = await response.json();
    return appointment;
  } catch (error) {
    console.error('Error getting appointment:', error);
    throw error;
  }
}

const updateAppointment = async (appointmentId, status) => {
  const authorization = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/appointments/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization}`,
      },
      body: JSON.stringify({
        appointmentId,
        status
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update appointment');
    }

    const appointment = await response.json();
    return appointment;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export {
  createAppointment,
  getAppointmentById,
  updateAppointment
};