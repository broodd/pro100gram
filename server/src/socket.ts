import { AppError } from './util/error-handler';
import SocketIO from 'socket.io';

let io: any;

export default {
  init: (httpServer: any) => {
    io = SocketIO(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new AppError('SocketIO not initialized');
    }
    return io;
  }
};
