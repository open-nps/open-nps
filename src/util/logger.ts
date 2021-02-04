import winston from 'winston';

const InnerLevels = {
  error: 1,
  debug: 2,
  http: 3,
  silly: 4,
};

const levelIdx = Object.values(InnerLevels).indexOf(
  parseInt(process.env.DEBUG_MODE || '0')
);

export const logger = winston.createLogger({
  level: levelIdx > -1 ? Object.keys(InnerLevels)[levelIdx] : 'none',
  levels: InnerLevels,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

type InternalLogger = (a: string, b: AnyObject) => winston.Logger;
export const LoggerNamespace = (name: string) => (
  verb: string,
  event: string,
  data?: AnyObject
): InternalLogger => logger[verb](`${name}.${event}`, data);
