import authRoutes from './authRoutes.js';
import fundraiserRoutes from './fundraiserRoutes.js';
import donationRoutes from './donationRoutes.js';
import contactRoutes from './contactRoutes.js';
export default function setupRoutes(app) {
    app.use('/api', authRoutes); 
    app.use('/api', fundraiserRoutes); 
    app.use('/api', donationRoutes); 
    app.use('/api', contactRoutes); 
}
