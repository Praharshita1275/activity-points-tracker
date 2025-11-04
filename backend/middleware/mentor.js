module.exports = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'mentor') return res.status(403).json({ message: 'Mentor access required' });
  next();
};
