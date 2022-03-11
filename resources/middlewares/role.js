const ROLES = {
    Admin: 'ROLE_ADMIN',
    Member: 'ROLE_MEMBER',
    Contributer: 'ROLE_CONTRIBUTOR',
  };
  
const checkRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({status :"failed" , message : "Unauthorized"});
  }
  const hasRole = roles.find(role => req.user.role === role);
  if (!hasRole) {
    return res.status(403).send({status :"failed" , message : "You are not allowed to make this request."});
  }
  return next();
};
  
export const role = { ROLES, checkRole };
