const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const authenticateJWT = require("../middlewares/authMiddleware");
const BarberController = require('../controllers/BarberController');
const MessageController = require('../controllers/MessageController');
const AppointmentController = require('../controllers/AppointmentController');

const upload = require('../helpers/MulterHelper'); 


const router = express.Router();


router.post('/account-setup', authenticateJWT, UserController.accountSetup);
router.get('/account-setup/check', authenticateJWT, UserController.checkAccountSetup);
router.get('/me', authenticateJWT, UserController.me);

router.get('/barbers/nearby', authenticateJWT, BarberController.findNearbyBarbers);
router.post('/barbers/like', authenticateJWT, BarberController.likeBarber);
router.post('/barbers/ignore', authenticateJWT, BarberController.ignoreBarber);
router.get('/barbers/liked-list', authenticateJWT, BarberController.barberListLiked);

router.post('/message/conversations/send-message', authenticateJWT, MessageController.sendMessage);
router.get('/message/conversations/get-messages', authenticateJWT, MessageController.getMessages);
router.get('/message/conversations/list', authenticateJWT, MessageController.getLastConversations);
router.post('/message/conversations/findOrCreateConversation', authenticateJWT, MessageController.findOrCreateConversation);
router.post('/message/conversations/conversation-details', authenticateJWT, MessageController.conversationDetails);

router.post('/appointments/create', authenticateJWT, AppointmentController.createAppointment)
router.get('/appointments/get', authenticateJWT, AppointmentController.getAppointmentById)
router.post('/appointments/update', authenticateJWT, AppointmentController.updateAppointment)

router.post('/barber-setup', authenticateJWT, UserController.barberAccountSetup);

router.post('/profile-picture', authenticateJWT, upload.single('image'), UserController.setUserProfilePicture);
router.post('/portfolio-image', authenticateJWT, upload.array('images', 10), UserController.uploadPortfolioImage);

router.get('/barber-media/:barberId', authenticateJWT, UserController.getBarberMedia);


module.exports = router;
