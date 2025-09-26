import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid.' });
  }
};
