export const logger = (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};
